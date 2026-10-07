"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { EMAIL } from "./ui";

type Kind = "waitlist" | "investor";
type Field = { name: string; label: string; type?: "text" | "email" | "tel" | "textarea" | "select" | "checkbox"; required?: boolean;
  options?: string[]; hint?: string; autoComplete?: string; wide?: boolean };

const FIELDS: Record<Kind, Field[]> = {
  waitlist: [
    { name: "name", label: "Your name", required: true, autoComplete: "name" },
    { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
    { name: "phone", label: "Phone", type: "tel", hint: "Optional", autoComplete: "tel" },
    { name: "organisation", label: "Business or household", hint: "Optional", autoComplete: "organization" },
    { name: "city", label: "City", autoComplete: "address-level2" },
    { name: "sector", label: "Where would it work?", type: "select",
      options: ["Factory or packaging line", "Warehouse or logistics", "Food outlet or kitchen", "Shop or reception", "Household", "Something else"] },
    { name: "interest", label: "Would you rather", type: "select", options: ["Subscribe monthly", "Buy outright", "Not sure yet"] },
    { name: "tasks", label: "What would you want it to do?", type: "textarea", wide: true, hint: "The tasks, shifts and space it would work in" },
  ],
  investor: [
    { name: "name", label: "Your name", required: true, autoComplete: "name" },
    { name: "email", label: "Email", type: "email", required: true, autoComplete: "email" },
    { name: "firm", label: "Firm or fund", hint: "Optional", autoComplete: "organization" },
    { name: "investor_type", label: "You invest as", type: "select", options: ["Angel", "Venture fund", "Accelerator or programme", "Family office", "Corporate or strategic", "Other"] },
    { name: "cheque", label: "Typical cheque", hint: "Optional", type: "select", options: ["Under ₹10 lakh", "₹10–50 lakh", "₹50 lakh–1 crore", "Over ₹1 crore", "Prefer not to say"] },
    { name: "message", label: "What would you like to know?", type: "textarea", wide: true, hint: "Optional" },
    { name: "wants_deck", label: "Send me the pitch deck", type: "checkbox" },
  ],
};

const input = "mt-2 w-full rounded-xl border border-night-line bg-night px-4 py-3 text-[16px] text-lab placeholder:text-fog focus:border-z focus:outline-none";

export default function InterestForm({ kind }: { kind: Kind }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "fallback" | "error">("idle");
  const [error, setError] = useState("");
  const [mailto, setMailto] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = { kind };
    fd.forEach((v, k) => { data[k] = String(v); });
    if (FIELDS[kind].some((f) => f.type === "checkbox")) data.wants_deck = fd.get("wants_deck") ? "yes" : "no";
    setState("sending"); setError("");
    // the same message, ready for the visitor's own email app if sending from the site is not possible
    const subject = kind === "investor" ? "Investor enquiry" : "Dum-E waitlist";
    const body = FIELDS[kind].map((f) => `${f.label}: ${data[f.name] || "-"}`).join("\n");
    setMailto(`mailto:${EMAIL}?subject=${encodeURIComponent(`${subject}: ${data.name ?? ""}`)}&body=${encodeURIComponent(body)}`);
    try {
      const res = await fetch("/api/interest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const out = await res.json().catch(() => ({}));
      if (res.ok && out.ok) return setState("sent");
      if (out.code === "invalid") { setError(out.message ?? "Check the name and email."); return setState("error"); }
      setState("fallback");
    } catch {
      setState("fallback");
    }
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      {state === "sent" ? (
        <motion.div key="sent" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-night-line bg-night-2 p-8" role="status">
          <p className="heading text-[26px]">{kind === "investor" ? "Thanks. We'll be in touch." : "You're on the waitlist."}</p>
          <p className="mt-3 max-w-[46ch] text-[16px] text-mist">
            {kind === "investor"
              ? "Your message has gone to the founder, who will reply by email."
              : "We'll contact you when a pilot near you fits the work you described."}
          </p>
        </motion.div>
      ) : state === "fallback" ? (
        <motion.div key="fb" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl border border-night-line bg-night-2 p-8" role="alert">
          <p className="heading text-[24px]">This couldn&apos;t be sent from the site.</p>
          <p className="mt-3 max-w-[46ch] text-[16px] text-mist">Your answers are ready in an email to {EMAIL}. Open it in your email app and press send.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={mailto} className="rounded-full bg-z px-6 py-3 text-[15px] font-medium text-white hover:bg-z-deep">Open in your email app</a>
            <button type="button" onClick={() => setState("idle")} className="rounded-full border border-night-line px-6 py-3 text-[15px] text-lab">Edit answers</button>
          </div>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={submit} noValidate={false} initial={false} className="grid gap-5 sm:grid-cols-2">
          {/* honeypot: hidden from people and assistive tech, filled only by bots */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          </div>
          {FIELDS[kind].map((f) => (
            <div key={f.name} className={f.wide || f.type === "checkbox" ? "sm:col-span-2" : ""}>
              {f.type === "checkbox" ? (
                <label className="flex cursor-pointer items-center gap-3 text-[16px] text-lab">
                  <input type="checkbox" name={f.name} className="h-5 w-5 accent-[var(--color-z)]" defaultChecked /> {f.label}
                </label>
              ) : (
                <label className="block text-[15px] text-mist">
                  {f.label}{f.required && <span className="text-x" aria-hidden="true"> *</span>}
                  {f.hint && <span className="ml-2 text-[13px] text-fog">{f.hint}</span>}
                  {f.type === "textarea" ? (
                    <textarea name={f.name} rows={4} className={input} />
                  ) : f.type === "select" ? (
                    <select name={f.name} className={input} defaultValue="">
                      <option value="" disabled>Choose one</option>
                      {f.options!.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input name={f.name} type={f.type ?? "text"} required={f.required} autoComplete={f.autoComplete} className={input} />
                  )}
                </label>
              )}
            </div>
          ))}
          {state === "error" && <p role="alert" className="text-[15px] text-x sm:col-span-2">{error}</p>}
          <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
            <button type="submit" disabled={state === "sending"} className="rounded-full bg-z px-7 py-3.5 text-[16px] font-medium text-white transition-colors hover:bg-z-deep disabled:opacity-60">
              {state === "sending" ? "Sending…" : kind === "investor" ? "Send to the founder" : "Join the waitlist"}
            </button>
            <p className="text-[13px] text-fog">We use this only to contact you about Dum-E.</p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
