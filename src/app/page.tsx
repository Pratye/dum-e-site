import Image from "next/image";
import RobotViewerClient from "@/components/RobotViewerClient";

const EMAIL = "pratye.aggarwal@gmail.com";
const ORANGE = "#FF6600";
const LINE   = "rgba(255,102,0,0.15)";
const MUTED  = "#8A8A8A";
const FG     = "#FAFAF8";
const CARD_BG = "rgba(255,102,0,0.03)";

const stats = [
  { v: "₹1-5L",  l: "Unit Price" },
  { v: "₹8-20K", l: "RaaS / Month" },
  { v: "60M+",   l: "Indian SMEs" },
  { v: "$290B",  l: "Global TAM 2030" },
];

const model = [
  { name: "RaaS",          price: "₹8–20K / mo",   detail: "12–36 month contracts. Zero upfront capital for businesses." },
  { name: "Hardware Sales", price: "35–45% margin", detail: "₹1–5L per unit. Direct ownership for households and SMEs." },
  { name: "Software + AMC", price: "₹5–15K / yr",  detail: "OTA firmware, maintenance contracts, and task modules." },
];

const roadmap = [
  { q: "Q2 2026", h: "Prototype Assembly",  d: "Full mechanical and electronics integration complete and powered on." },
  { q: "Q3 2026", h: "Controlled Testing",  d: "Closed-environment runs in household and plastics packaging factory." },
  { q: "Q4 2026", h: "Refinement",          d: "Stability testing sprint and first working robot video documentation." },
  { q: "Q1 2027", h: "First Pilot",         d: "External deployment begins. Initial paying customer conversations." },
  { q: "Q3 2027", h: "Scale Launch",        d: "10 units deployed. First RaaS contracts signed. Series A prep starts." },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "#0D0D0D", color: FG }}>

      {/* ── Background atmosphere ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div style={{
          position: "absolute", top: "-100px", left: "-100px",
          width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,102,0,0.12) 0%, transparent 65%)",
          filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute", bottom: "20vh", right: "-120px",
          width: "420px", height: "420px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,102,0,0.08) 0%, transparent 65%)",
          filter: "blur(70px)",
        }} />
      </div>

      {/* ── NAV — full-width so backdrop covers the whole bar ── */}
      <header
        className="fade-up fade-up-1 sticky top-0 z-50 w-full backdrop-blur-md"
        style={{ background: "rgba(13,13,13,0.82)", borderBottom: `1px solid ${LINE}` }}
      >
        <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <Image
              src="/dum-e-logo.png"
              alt="Dum-E Robotics"
              width={36}
              height={36}
              style={{ height: "auto", objectFit: "contain" }}
              priority
            />
            <span
              className="font-semibold tracking-tight text-sm sm:text-base"
              style={{ color: FG, letterSpacing: "-0.01em" }}
            >
              Dum-E Robotics
            </span>
          </div>
          <a
            href={`mailto:${EMAIL}`}
            className="btn-outline-orange text-xs tracking-widest border rounded-full px-4 py-2.5 transition-all duration-200 uppercase"
          >
            Contact
          </a>
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-5 sm:px-8 lg:px-10">

        {/* ── HERO ── */}
        <section className="pt-20 pb-6 lg:pt-28">
          <p className="eyebrow fade-up fade-up-1 mb-6">Humanoid Robotics · India-First</p>

          <h1
            className="disp fade-up fade-up-2 leading-[0.92] tracking-[-0.03em]"
            style={{ fontSize: "clamp(3rem, 10.5vw, 9.4rem)", color: FG }}
          >
            The Maruti<br />of Robots.
          </h1>

          <p
            className="fade-up fade-up-3 mt-7 max-w-[520px] leading-[1.72]"
            style={{ fontSize: "clamp(1rem, 1.4vw, 1.18rem)", color: MUTED }}
          >
            Dum-E builds general-purpose humanoid robots any household, shop,
            or factory in India can own or subscribe to — at a fraction of what
            existing robots cost.
          </p>

          <div className="fade-up fade-up-4 flex flex-wrap gap-3 mt-9">
            <a
              href={`mailto:${EMAIL}`}
              className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200"
              style={{ background: ORANGE, color: "#0D0D0D" }}
            >
              Email Founder
            </a>
            <a
              href="#prototype"
              className="inline-flex items-center border rounded-full px-6 py-3 text-sm transition-all duration-200"
              style={{ borderColor: LINE, color: MUTED }}
            >
              See Prototype →
            </a>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <div
          className="fade-up fade-up-4 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 py-8 mt-4"
          style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}
        >
          {stats.map((s) => (
            <div key={s.l}>
              <p className="disp leading-none tracking-tight" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: FG }}>
                {s.v}
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest" style={{ color: ORANGE }}>{s.l}</p>
            </div>
          ))}
        </div>

        {/* ── 3D PROTOTYPE ── */}
        <section id="prototype" className="pt-16 pb-4">
          <p className="eyebrow mb-3">Prototype</p>
          <h2
            className="font-semibold leading-[1.1] mb-2"
            style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.2rem)", color: FG }}
          >
            CAD/CAM design complete. Electronics in progress.
          </h2>
          <p className="mb-8 text-[0.92rem] leading-relaxed" style={{ color: MUTED, maxWidth: "520px" }}>
            Full humanoid robot modeled and ready for assembly.
            Motor drivers, sensor arrays, and onboard compute architecture are locked.
          </p>

          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{
              background: "radial-gradient(ellipse at 50% 20%, rgba(255,102,0,0.08) 0%, rgba(13,13,13,0.98) 60%)",
              border: `1px solid ${LINE}`,
            }}
          >
            <RobotViewerClient />
          </div>
        </section>

        {/* ── PROBLEM / SOLUTION ── */}
        <section
          className="grid md:grid-cols-2 gap-10 lg:gap-16 py-16"
          style={{ borderTop: `1px solid ${LINE}` }}
        >
          <div>
            <p className="eyebrow mb-4">Problem</p>
            <h2 className="font-semibold leading-[1.1] mb-4" style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.2rem)", color: FG }}>
              60M Indian SMEs. Zero robotics access.
            </h2>
            <p className="leading-[1.72] text-[0.94rem]" style={{ color: MUTED }}>
              Existing robots cost ₹50L or more — accessible only to large enterprises.
              47% of Indian SMEs report acute labor shortages with no affordable automation
              path. The technology exists. The price point does not. Yet.
            </p>
          </div>
          <div>
            <p className="eyebrow mb-4">Solution</p>
            <h2 className="font-semibold leading-[1.1] mb-4" style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.2rem)", color: FG }}>
              Own it. Subscribe to it. Put it to work.
            </h2>
            <p className="leading-[1.72] text-[0.94rem]" style={{ color: MUTED }}>
              Humanoid form factor means no facility re-engineering required. Buy outright
              at ₹1-5L or subscribe via RaaS at ₹8-20K/month. Plug-and-deploy from day one.
            </p>
          </div>
        </section>

        {/* ── USE CASES ── */}
        <section className="py-16" style={{ borderTop: `1px solid ${LINE}` }}>
          <p className="eyebrow mb-8">Use Cases</p>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: "Industrial & Commercial",
                items: ["Factories and packaging lines", "Warehouses and logistics stations", "F&B counters and reception desks", "Defense and security workflows"],
              },
              {
                title: "Household & Personal",
                items: ["Cleaning and household chores", "Elderly care and daily assistance", "Routine home errands", "Daily productivity tasks"],
              },
            ].map((col) => (
              <div
                key={col.title}
                className="card-hover rounded-2xl p-6"
                style={{ border: `1px solid ${LINE}`, background: CARD_BG }}
              >
                <h3 className="font-semibold mb-5 text-[1.05rem]" style={{ color: FG }}>{col.title}</h3>
                <ul className="space-y-3">
                  {col.items.map((item) => (
                    <li key={item} className="flex gap-3 text-[0.88rem]" style={{ color: MUTED }}>
                      <span style={{ color: ORANGE }} className="shrink-0 mt-0.5">—</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── BUSINESS MODEL ── */}
        <section id="model" className="py-16" style={{ borderTop: `1px solid ${LINE}` }}>
          <p className="eyebrow mb-3">Business Model</p>
          <h2 className="font-semibold leading-tight mb-10" style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.2rem)", color: FG }}>
            RaaS-first. Three compounding revenue streams.
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {model.map((m) => (
              <div
                key={m.name}
                className="card-hover rounded-2xl p-6"
                style={{ border: `1px solid ${LINE}`, background: CARD_BG }}
              >
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: ORANGE }}>{m.name}</p>
                <p className="disp leading-none mb-4" style={{ fontSize: "clamp(1.05rem, 2vw, 1.5rem)", color: FG }}>
                  {m.price}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{m.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── MARKET ── */}
        <section className="py-16" style={{ borderTop: `1px solid ${LINE}` }}>
          <p className="eyebrow mb-8">Market Opportunity</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "TAM", value: "$290B", sub: "Global Service Robots by 2030" },
              { label: "SAM", value: "$750M", sub: "Service Robotics, India today" },
              { label: "SOM", value: "$20M",  sub: "Indian metro cities, 1K+ deployments" },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-2xl p-6 text-center"
                style={{ border: `1px solid ${LINE}`, background: CARD_BG }}
              >
                <p className="text-xs uppercase tracking-widest mb-3" style={{ color: ORANGE }}>{m.label}</p>
                <p className="disp" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: FG }}>{m.value}</p>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: MUTED }}>{m.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── ROADMAP ── */}
        <section className="py-16" style={{ borderTop: `1px solid ${LINE}` }}>
          <p className="eyebrow mb-8">Roadmap</p>
          {roadmap.map((t, i) => (
            <div
              key={t.q}
              className="grid gap-4 py-5"
              style={{
                gridTemplateColumns: "110px 1fr",
                borderTop: i > 0 ? `1px solid rgba(255,102,0,0.1)` : "none",
              }}
            >
              <p className="text-[0.7rem] uppercase tracking-[0.14em] pt-0.5 shrink-0" style={{ color: ORANGE }}>{t.q}</p>
              <div>
                <p className="font-medium text-sm" style={{ color: FG }}>{t.h}</p>
                <p className="text-sm mt-1 leading-relaxed" style={{ color: MUTED }}>{t.d}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── FOUNDER ── */}
        <section className="py-16" style={{ borderTop: `1px solid ${LINE}` }}>
          <p className="eyebrow mb-8">Founder</p>
          <blockquote
            className="disp leading-[1.08] mb-10 max-w-4xl"
            style={{ fontSize: "clamp(1.4rem, 3.5vw, 3rem)", color: FG }}
          >
            &quot;We are building the Maruti of robots. Affordable. Indian. For everyone.&quot;
          </blockquote>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
            <div>
              <p className="font-medium text-sm" style={{ color: FG }}>Pratye Aggarwal</p>
              <p className="text-xs mt-0.5" style={{ color: MUTED }}>Founder & CEO · B.Tech Automation & Robotics, USAR</p>
            </div>
            <div className="flex gap-5 text-sm">
              <a
                href={`mailto:${EMAIL}`}
                className="underline underline-offset-4"
                style={{ color: ORANGE, textDecorationColor: "rgba(255,102,0,0.4)" }}
              >
                {EMAIL}
              </a>
              <a
                href="https://linkedin.com/in/pratye-aggarwal-84076a210"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4"
                style={{ color: MUTED, textDecorationColor: "rgba(138,138,138,0.35)" }}
              >
                LinkedIn
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer
          className="py-8 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-wider"
          style={{ borderTop: `1px solid ${LINE}`, color: MUTED }}
        >
          <p>Dum-E Robotics · New Delhi, India · 2026</p>
          <a
            href={`mailto:${EMAIL}`}
            className="border rounded-full px-4 py-2.5 transition-all duration-200 btn-outline-orange"
          >
            Start a conversation
          </a>
        </footer>

      </div>
    </div>
  );
}
