/**
 * Waitlist and investor enquiries, emailed to the founder through Resend (https://resend.com).
 *
 * Configure on Vercel:
 *   RESEND_API_KEY   required; without it this returns 503 { code: "not_configured" } and the form offers the
 *                    visitor's own email app instead, so no enquiry is lost
 *   INTEREST_TO      optional, defaults to the founder's address
 *   INTEREST_FROM    optional; Resend's shared "onboarding@resend.dev" sender only delivers to the Resend
 *                    account's own address until a domain is verified
 */
const TO = process.env.INTEREST_TO ?? "pratye.aggarwal@gmail.com";
const FROM = process.env.INTEREST_FROM ?? "Dum-E website <onboarding@resend.dev>";
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

const FIELDS: Record<"waitlist" | "investor", string[]> = {
  waitlist: ["name", "email", "phone", "organisation", "city", "sector", "interest", "tasks"],
  investor: ["name", "email", "firm", "investor_type", "cheque", "message", "wants_deck"],
};

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.replace(/\r/g, "").trim().slice(0, max) : "");

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return Response.json({ ok: false, code: "bad_request" }, { status: 400 }); }

  // honeypot: a field people never see. Bots fill it; answer as if it worked and drop it.
  if (clean(body.website, 200)) return Response.json({ ok: true });

  const kind = body.kind === "investor" ? "investor" : body.kind === "waitlist" ? "waitlist" : null;
  if (!kind) return Response.json({ ok: false, code: "bad_request" }, { status: 400 });
  const name = clean(body.name, 120), email = clean(body.email, 254);
  if (!name || !EMAIL_RE.test(email)) return Response.json({ ok: false, code: "invalid", message: "A name and a valid email are required." }, { status: 422 });

  const key = process.env.RESEND_API_KEY;
  if (!key) return Response.json({ ok: false, code: "not_configured" }, { status: 503 });

  const lines = FIELDS[kind].map((f) => `${f.replace(/_/g, " ")}: ${clean(body[f], 2000) || "-"}`);
  const subject = `${kind === "investor" ? "Investor enquiry" : "Waitlist"}: ${name.replace(/[\r\n]+/g, " ")}`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    // plain text only: nothing a visitor types is ever rendered as HTML
    body: JSON.stringify({ from: FROM, to: [TO], reply_to: email, subject, text: `${lines.join("\n")}\n\nSent from the Dum-E website.` }),
  });
  if (!res.ok) {
    // Resend explains every refusal (unverified domain, restricted key, bad sender); keep it in the function log
    console.error("interest: resend refused", res.status, await res.text());
    return Response.json({ ok: false, code: "send_failed" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
