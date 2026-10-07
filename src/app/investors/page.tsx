import type { Metadata } from "next";
import InterestForm from "@/components/InterestForm";
import { Band, EMAIL, Page, StateMark, type State } from "@/components/ui";
import curve from "@/data/training_curve.json";

export const metadata: Metadata = {
  title: "For investors | Dum-E Robotics",
  description: "Dum-E is raising a pre-seed round to build its first integrated humanoid and run its first paying pilots.",
};

// Deck slides 2, 10, 11 and 12. The round size is shared on request, not published.
const case_ = [
  { k: "The gap", v: "23 years", d: "for a ₹50 lakh robot to pay back one ₹18,000-a-month worker. Longer than the machine lasts, so small businesses can't buy it." },
  { k: "The answer", v: "₹1–5 lakh", d: "per robot, or ₹8–20 thousand a month on a subscription with nothing upfront. Priced at the wage it replaces." },
  { k: "The proof so far", v: "Actuation", d: "Our own motor driver and a teleoperated arm are built and tested outside simulation. The humanoid walks in simulation today." },
];

const funds = [
  { p: 45, l: "Hardware, electronics and prototyping" },
  { p: 25, l: "Three engineering hires" },
  { p: 13, l: "Operations, legal and contingency" },
  { p: 10, l: "Workshop and facility" },
  { p: 7, l: "Founder stipend" },
];

const derisked: { name: string; state: State }[] = [
  { name: "Motor driver (RdriveS1): built and bench tested", state: "done" },
  { name: "Robotic arm with teleoperation: built, tested end to end", state: "done" },
  { name: "Humanoid design (dume_v3): CAD complete", state: "done" },
  { name: `Walking policy: about ${curve.total_steps_M} million training steps, walking in simulation`, state: "progress" },
  { name: "Test sites: a plastics packaging factory and a household, committed", state: "done" },
  { name: "First integrated humanoid", state: "next" },
];

export default function Investors() {
  return (
    <Page>
      <Band tone="night" inner="pt-36 pb-20 sm:pt-44">
        <p className="text-[16px] text-mist">Are you an investor?</p>
        <h1 className="display mt-3 max-w-[16ch]" style={{ fontSize: "clamp(2.6rem, 6.8vw, 5.8rem)" }}>Funding builds the robot, not the research.</h1>
        <p className="mt-6 max-w-[56ch] text-[19px] leading-relaxed text-mist">
          The highest-risk parts are already built and tested. We&apos;re raising a pre-seed round on a SAFE to integrate them into a working humanoid,
          run it in two live environments and start the first paying pilots.
        </p>
      </Band>

      <Band tone="lab" inner="py-20 sm:py-28">
        <div className="grid gap-12 md:grid-cols-3 md:gap-0">
          {case_.map((c, i) => (
            <div key={c.k} className={`md:px-8 ${i ? "md:border-l md:border-lab-line" : "md:pl-0"}`}>
              <p className="text-[15px] text-fog">{c.k}</p>
              <p className="numeral mt-2 text-graphite" style={{ fontSize: "clamp(2.2rem, 4.2vw, 3.2rem)" }}>{c.v}</p>
              <p className="mt-3 text-[16px] leading-relaxed text-fog">{c.d}</p>
            </div>
          ))}
        </div>
      </Band>

      <Band tone="lab" inner="pb-20 sm:pb-28">
        <div className="grid gap-14 border-t border-lab-line pt-16 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="heading text-graphite" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)" }}>What the round buys</h2>
            <p className="mt-4 max-w-[46ch] text-[17px] leading-relaxed text-fog">
              An 18-month runway to a working, integrated humanoid running in a factory and a home, the first external pilot, and conversations
              with paying customers. At the end, the question moves from whether the robot works to how fast it can be deployed.
            </p>
            <ul className="mt-10 space-y-4" aria-label="Use of funds">
              {funds.map((f) => (
                <li key={f.l}>
                  <div className="flex items-baseline justify-between gap-4 text-[15px]">
                    <span className="text-graphite">{f.l}</span>
                    <span className="numeral text-[18px] text-graphite">{f.p}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 rounded-full bg-lab-2"><div className="h-full rounded-full bg-z" style={{ width: `${(f.p / 45) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="heading text-graphite" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)" }}>Already de-risked</h2>
            <ul className="mt-8 divide-y divide-lab-line border-y border-lab-line">
              {derisked.map((d) => (
                <li key={d.name} className="flex items-start justify-between gap-6 py-4">
                  <span className="text-[16px] text-graphite">{d.name}</span>
                  <span className="shrink-0 text-graphite"><StateMark state={d.state} /></span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[15px] text-fog">
              Simulation results, test data and the design are on the <a href="/engineering" className="text-z-deep underline underline-offset-4">engineering page</a>.
            </p>
          </div>
        </div>
      </Band>

      <Band tone="night" inner="py-20 sm:py-28">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div>
            <h2 className="heading" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)" }}>The founder</h2>
            <p className="heading mt-6 text-[22px]">Pratye Aggarwal</p>
            <p className="text-[15px] text-mist">Founder and CEO. B.Tech in Automation and Robotics, USAR, GGSIPU</p>
            <dl className="mt-8 space-y-6 text-[15px] leading-relaxed">
              <div><dt className="text-lab">Engineering</dt><dd className="mt-1 text-mist">Designed and built the RdriveS1 motor driver and a teleoperated robotic arm. Third place, Real World Design Challenge (UAV); second place, DTU competition (AI posture correction). Summer programme in EECS and data science at UC Berkeley.</dd></div>
              <div><dt className="text-lab">Business</dt><dd className="mt-1 text-mist">Founded NetZero Insights, a bootstrapped B2B SaaS for renewable-energy consultants, piloted with a design partner.</dd></div>
              <div><dt className="text-lab">Domain</dt><dd className="mt-1 text-mist">Grew up around a family-run manufacturing business: the shift patterns, turnover and real cost of a line, seen first-hand.</dd></div>
            </dl>
            <p className="mt-10 text-[15px] text-mist">Prefer email? <a href={`mailto:${EMAIL}`} className="text-lab underline underline-offset-4">{EMAIL}</a></p>
          </div>
          <div className="rounded-3xl border border-night-line bg-night-2/60 p-6 sm:p-9">
            <h2 className="heading text-[26px]">Talk to us</h2>
            <p className="mb-7 mt-2 text-[15px] text-mist">Ask for the deck, or a call.</p>
            <InterestForm kind="investor" />
          </div>
        </div>
      </Band>
    </Page>
  );
}
