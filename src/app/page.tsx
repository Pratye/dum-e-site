import Image from "next/image";
import Link from "next/link";
import RobotViewerClient from "@/components/RobotViewerClient";
import { Shell, SiteFooter, Section, H2, Chip, Card, EMAIL, ORANGE, LINE, MUTED, FG, CARD_BG } from "@/components/ui";
import type { Tone } from "@/components/ui";
import stats from "@/data/stats.json";
import curve from "@/data/training_curve.json";

// Figures below follow the latest pitch deck (13 slides). Walking numbers are read from src/data/stats.json.
const stats_strip = [
  { v: "₹1–5L",   l: "Unit price, against ₹50L+ today" },
  { v: "₹8–20K",  l: "RaaS per month" },
  { v: "60M+",    l: "Indian SMEs" },
  { v: "23 yrs",  l: "Payback on a ₹50L robot vs one worker" },
];

const levers = [
  { n: "01", k: "Cost of actuation", h: "Build the drive stack, don't buy it",
    d: "Industrial servo drives dominate a robot's bill of materials. We designed our own field-oriented control driver, the RdriveS1, around commodity parts.",
    tag: "Built and bench tested" },
  { n: "02", k: "Cost of installation", h: "Fit the world as it is",
    d: "Conventional automation demands the facility be redesigned around the machine. A humanoid works in spaces already built for people: no new fixtures, no line redesign, no integration contractor.",
    tag: "Design intent, validated in pilots" },
  { n: "03", k: "Cost of adoption", h: "Remove the capital barrier",
    d: "Even at ₹1–5L, upfront cost deters a cash-constrained SME. RaaS turns the purchase into a monthly operating expense, so adoption is reversible and needs no financing.",
    tag: "₹0 upfront to customer" },
];

const model = [
  { name: "RaaS",           price: "₹8–20K / mo",  detail: "12–36 month contracts. Zero upfront capital for businesses." },
  { name: "Hardware sales", price: "35–45% margin", detail: "₹1–5L per unit. Direct ownership for households and SMEs." },
  { name: "Software + AMC", price: "₹5–15K / yr",  detail: "OTA firmware, maintenance contracts and task modules." },
];

const market = [
  { v: "₹3.0–7.7L", l: "Per robot", s: "Over a 36-month RaaS contract, including software and AMC" },
  { v: "₹30–77 Cr", l: "First 1,000 robots", s: "Three-year revenue; the model depends only on our own contract pricing" },
  { v: "1 in 60,000", l: "Share of SMEs", s: "1,000 units is 0.002% of India's 60M+ SMEs" },
];

const status: { name: string; note: string; tone: Tone; chip: string }[] = [
  { name: "RdriveS1 FOC motor driver", note: "Designed in-house", tone: "done", chip: "Built · bench tested" },
  { name: "Robotic arm with teleoperation", note: "Actuation and control chain proven outside simulation", tone: "done", chip: "Built · tested" },
  { name: "Humanoid CAD design", note: "dume_v3: 1.19 m, 20 degrees of freedom", tone: "done", chip: "Complete" },
  { name: "Walking, learned in simulation", note: "Flat ground and gentle slopes working; stairs next", tone: "progress", chip: "In progress" },
  { name: "Full prototype integration", note: "Starts once simulation has de-risked the build", tone: "next", chip: "Next" },
  { name: "Closed-environment testing", note: "A plastics packaging factory and a household are committed", tone: "next", chip: "After integration" },
];

const phases = [
  { p: "Phase 1", w: "0–12 months", h: "Prove it in Delhi NCR", d: "5–10 pilot deployments in NCR F&B outlets and small factories. First 20 units sold or on RaaS; reference case studies." },
  { p: "Phase 2", w: "12–30 months", h: "Scale across four metros", d: "Mumbai, Bengaluru, Chennai and Hyderabad. 200+ active subscriptions; sales, service and engineering hires." },
  { p: "Phase 3", w: "30–48 months", h: "Platform beyond hardware", d: "A task-module marketplace for outside developers, OEM and white-label partnerships. 1,000 units deployed." },
];

export default function Home() {
  const flat = stats.scenarios.find((s) => s.id === "flat")!;
  const ramp = stats.scenarios.find((s) => s.id === "ramp_4_deg")!;
  const now = [
    { href: "/engineering#simulation", img: "walk_flat", alt: "The dume_v3 humanoid walking in simulation",
      h: "Walking, learned in simulation",
      d: `Trained on a GPU over about ${curve.total_steps_M} million steps. It stays upright for ${flat.survived_s.toFixed(0)} of ${flat.episode_s.toFixed(0)} seconds on flat ground, tracking a 0.6 m/s command.` },
    { href: "/engineering#simulation", img: "walk_ramp8", alt: "The dume_v3 humanoid walking up an 8 degree ramp in simulation",
      h: "Real terrain, real failures",
      d: `Stairs and ramps are modelled as real geometry. A 4° ramp is ${ramp.survived_s.toFixed(0)} of ${ramp.episode_s.toFixed(0)} seconds upright; stairs are the next milestone, and we show where it fails.` },
    { href: "/engineering#arm", img: "arm_calibration_card", alt: "Simulated robot arm reaching a target after automatic calibration",
      h: "An arm that calibrates itself",
      d: "An off-the-shelf vision-language-action model plus an automatic calibration layer: reach error 28.7 mm down to 1.5 mm, in simulation." },
  ];

  return (
    <Shell active="home">
      {/* ── HERO ── */}
      <section className="pt-20 pb-6 lg:pt-28">
        <p className="eyebrow fade-up fade-up-1 mb-6">Humanoid Robotics · India-First</p>
        <h1 className="disp fade-up fade-up-2 leading-[0.92] tracking-[-0.03em]" style={{ fontSize: "clamp(3rem, 10.5vw, 9.4rem)", color: FG }}>
          The Maruti<br />of Robots.
        </h1>
        <p className="fade-up fade-up-3 mt-7 max-w-[520px] leading-[1.72]" style={{ fontSize: "clamp(1rem, 1.4vw, 1.18rem)", color: MUTED }}>
          Dum-E builds general-purpose humanoid robots any household, shop, or factory in India can own or subscribe to — at a fraction of what existing robots cost.
        </p>
        <div className="fade-up fade-up-4 flex flex-wrap gap-3 mt-9">
          <a href={`mailto:${EMAIL}`} className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200" style={{ background: ORANGE, color: "#0D0D0D" }}>
            Email Founder
          </a>
          <Link href="/engineering" className="inline-flex items-center border rounded-full px-6 py-3 text-sm transition-all duration-200" style={{ borderColor: LINE, color: MUTED }}>
            See what we&apos;re building →
          </Link>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div className="fade-up fade-up-4 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 py-8 mt-4" style={{ borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
        {stats_strip.map((s) => (
          <div key={s.l}>
            <p className="disp leading-none tracking-tight" style={{ fontSize: "clamp(1.5rem, 3vw, 2.2rem)", color: FG }}>{s.v}</p>
            <p className="mt-2 text-xs uppercase tracking-widest leading-snug" style={{ color: ORANGE }}>{s.l}</p>
          </div>
        ))}
      </div>

      {/* ── PROTOTYPE ── */}
      <section id="prototype" className="pt-16 pb-4 scroll-mt-20">
        <p className="eyebrow mb-3">Prototype</p>
        <H2 className="mb-2">Design complete. Walking in simulation. Assembly next.</H2>
        <p className="mb-8 text-[0.92rem] leading-relaxed" style={{ color: MUTED, maxWidth: "560px" }}>
          dume_v3 is a 1.19 m, 20-degree-of-freedom humanoid designed in-house. Our own motor driver is built and bench tested; the whole robot is being
          proven in simulation before we commit to the build.
        </p>
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{ background: "radial-gradient(ellipse at 50% 20%, rgba(255,102,0,0.08) 0%, rgba(13,13,13,0.98) 60%)", border: `1px solid ${LINE}` }}
        >
          <RobotViewerClient src="/models/dume_v3.glb" />
        </div>
        <p className="mt-4 text-sm">
          <Link href="/engineering#design" className="underline underline-offset-4" style={{ color: ORANGE, textDecorationColor: "rgba(255,102,0,0.4)" }}>
            Specs, simulation and results →
          </Link>
        </p>
      </section>

      {/* ── NOW BUILDING ── */}
      <Section id="now">
        <p className="eyebrow mb-3">Now building</p>
        <H2 className="mb-10">What the last few weeks produced</H2>
        <div className="grid gap-4 md:grid-cols-3">
          {now.map((n) => (
            <Link key={n.h} href={n.href} className="card-hover group block overflow-hidden rounded-2xl" style={{ border: `1px solid ${LINE}`, background: CARD_BG }}>
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image src={`/engineering/${n.img}.jpg`} alt={n.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                <span className="absolute left-3 top-3"><Chip tone="sim">Simulation</Chip></span>
              </div>
              <div className="p-6">
                <h3 className="mb-2 font-semibold" style={{ color: FG }}>{n.h}</h3>
                <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{n.d}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* ── PROBLEM / SOLUTION ── */}
      <section className="grid md:grid-cols-2 gap-10 lg:gap-16 py-16" style={{ borderTop: `1px solid ${LINE}` }}>
        <div>
          <p className="eyebrow mb-4">Problem</p>
          <H2 className="mb-4">Robotics solved capability. Cost is the unsolved problem.</H2>
          <p className="leading-[1.72] text-[0.94rem]" style={{ color: MUTED }}>
            A ₹50L robot takes 23 years to pay for itself against one ₹18K-a-month worker, longer than the machine will last. 47% of Indian SMEs report acute
            labour shortages and wages rise about 8% a year, yet the automation that exists is priced for large enterprises.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-4">Solution</p>
          <H2 className="mb-4">Own it. Subscribe to it. Put it to work.</H2>
          <p className="leading-[1.72] text-[0.94rem]" style={{ color: MUTED }}>
            A humanoid form factor needs no facility re-engineering. Buy outright at ₹1–5L, or subscribe via RaaS at ₹8–20K a month, about what an SME already
            pays one worker, with nothing due upfront.
          </p>
        </div>
      </section>

      {/* ── HOW WE GET THERE ── */}
      <Section id="how">
        <p className="eyebrow mb-3">How we get there</p>
        <H2 className="mb-10">Three design decisions take it from ₹50L to ₹1–5L</H2>
        <div className="grid md:grid-cols-3 gap-4">
          {levers.map((l) => (
            <Card key={l.n} className="flex flex-col">
              <div className="mb-4 flex items-center gap-3">
                <span className="disp inline-flex h-9 w-9 items-center justify-center rounded-full text-sm" style={{ background: ORANGE, color: "#0D0D0D" }}>{l.n}</span>
                <span className="text-[0.66rem] uppercase tracking-[0.18em]" style={{ color: MUTED }}>{l.k}</span>
              </div>
              <h3 className="mb-3 font-semibold" style={{ color: FG }}>{l.h}</h3>
              <p className="flex-1 text-sm leading-relaxed" style={{ color: MUTED }}>{l.d}</p>
              <p className="mt-5 rounded-lg px-3 py-2 text-center text-xs font-semibold" style={{ background: "rgba(255,102,0,0.08)", color: ORANGE }}>{l.tag}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── USE CASES ── */}
      <Section>
        <p className="eyebrow mb-8">Use Cases</p>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { title: "Industrial & Commercial", items: ["Factories and packaging lines", "Warehouses and logistics stations", "F&B counters and reception desks", "Defense and security workflows"] },
            { title: "Household & Personal", items: ["Cleaning and household chores", "Elderly care and daily assistance", "Routine home errands", "Daily productivity tasks"] },
          ].map((col) => (
            <Card key={col.title}>
              <h3 className="font-semibold mb-5 text-[1.05rem]" style={{ color: FG }}>{col.title}</h3>
              <ul className="space-y-3">
                {col.items.map((item) => (
                  <li key={item} className="flex gap-3 text-[0.88rem]" style={{ color: MUTED }}>
                    <span style={{ color: ORANGE }} className="shrink-0 mt-0.5">—</span>{item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </Section>

      {/* ── BUSINESS MODEL ── */}
      <Section id="model">
        <p className="eyebrow mb-3">Business Model</p>
        <H2 className="mb-10">Every deployed robot earns ₹3.0–7.7L over a three-year contract</H2>
        <div className="grid md:grid-cols-3 gap-4">
          {model.map((m) => (
            <Card key={m.name}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: ORANGE }}>{m.name}</p>
              <p className="disp leading-none mb-4" style={{ fontSize: "clamp(1.05rem, 2vw, 1.5rem)", color: FG }}>{m.price}</p>
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{m.detail}</p>
            </Card>
          ))}
        </div>
        <p className="mt-6 text-sm leading-relaxed max-w-[640px]" style={{ color: MUTED }}>
          The model is deliberately annuity-led: subscription and AMC revenue accrue for as long as a unit is deployed, so fleet economics improve with every install.
        </p>
      </Section>

      {/* ── MARKET ── */}
      <Section>
        <p className="eyebrow mb-3">Market Opportunity</p>
        <H2 className="mb-10">The first 1,000 robots mean winning one SME in every sixty thousand</H2>
        <div className="grid sm:grid-cols-3 gap-4">
          {market.map((m) => (
            <div key={m.l} className="rounded-2xl p-6 text-center" style={{ border: `1px solid ${LINE}`, background: CARD_BG }}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: ORANGE }}>{m.l}</p>
              <p className="disp" style={{ fontSize: "clamp(1.5rem, 3vw, 2.4rem)", color: FG }}>{m.v}</p>
              <p className="text-xs mt-2 leading-relaxed" style={{ color: MUTED }}>{m.s}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs leading-relaxed max-w-[640px]" style={{ color: MUTED }}>
          Sized from unit economics, not a share of a global forecast. For reference, the IFR sizes the global service-robot market at $290B by 2030, a boundary
          condition rather than our target.
        </p>
      </Section>

      {/* ── ROADMAP ── */}
      <Section id="roadmap">
        <p className="eyebrow mb-3">Where we are</p>
        <H2 className="mb-8">Highest-risk pieces first</H2>
        {status.map((s, i) => (
          <div key={s.name} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-4" style={{ borderTop: i ? "1px solid rgba(255,102,0,0.1)" : "none" }}>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-sm" style={{ color: FG }}>{s.name}</p>
              <p className="text-sm mt-0.5 leading-relaxed" style={{ color: MUTED }}>{s.note}</p>
            </div>
            <Chip tone={s.tone}>{s.chip}</Chip>
          </div>
        ))}
        <p className="eyebrow mt-14 mb-6">Go to market</p>
        <div className="grid md:grid-cols-3 gap-4">
          {phases.map((p) => (
            <Card key={p.p}>
              <p className="text-xs uppercase tracking-widest" style={{ color: ORANGE }}>{p.p} · {p.w}</p>
              <h3 className="mt-3 mb-2 font-semibold" style={{ color: FG }}>{p.h}</h3>
              <p className="text-sm leading-relaxed" style={{ color: MUTED }}>{p.d}</p>
            </Card>
          ))}
        </div>
        <p className="mt-5 text-xs leading-relaxed max-w-[640px]" style={{ color: MUTED }}>
          Density before geography: proving unit economics in one city keeps service costs controllable and produces the reference customers that make the next
          phase sellable.
        </p>
      </Section>

      {/* ── FOUNDER ── */}
      <Section>
        <p className="eyebrow mb-8">Founder</p>
        <blockquote className="disp leading-[1.08] mb-10 max-w-4xl" style={{ fontSize: "clamp(1.4rem, 3.5vw, 3rem)", color: FG }}>
          &quot;We are building the Maruti of robots. Affordable. Indian. For everyone.&quot;
        </blockquote>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <div>
            <p className="font-medium text-sm" style={{ color: FG }}>Pratye Aggarwal</p>
            <p className="text-xs mt-0.5" style={{ color: MUTED }}>Founder & CEO · B.Tech Automation & Robotics, USAR</p>
          </div>
          <div className="flex gap-5 text-sm">
            <a href={`mailto:${EMAIL}`} className="underline underline-offset-4" style={{ color: ORANGE, textDecorationColor: "rgba(255,102,0,0.4)" }}>{EMAIL}</a>
            <a href="https://linkedin.com/in/pratye-aggarwal-84076a210" target="_blank" rel="noreferrer" className="underline underline-offset-4" style={{ color: MUTED, textDecorationColor: "rgba(138,138,138,0.35)" }}>
              LinkedIn
            </a>
          </div>
        </div>
      </Section>

      <SiteFooter />
    </Shell>
  );
}
