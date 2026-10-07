import Image from "next/image";
import Link from "next/link";
import HeroWalk from "@/components/HeroWalk";
import PaybackSlider from "@/components/PaybackSlider";
import { Band, ButtonLink, Page, SimTag, StateMark, type State } from "@/components/ui";
import { Accordion, CountUp, DrawLine, SpotlightCard, StackCards, Stagger, StaggerLi } from "@/components/motion";
import stats from "@/data/stats.json";
import curve from "@/data/training_curve.json";

// Figures follow the latest pitch deck; walking numbers are read from src/data/stats.json.
const levers = [
  { k: "Cost of actuation", big: "In-house", bigLabel: "motor driver, built around commodity parts", h: "Build the drive stack instead of buying it",
    d: "Industrial servo drives dominate a robot's bill of materials. We designed our own field-oriented-control motor driver, the RdriveS1, around commodity parts.",
    state: "done" as State, s: "Built and bench tested" },
  { k: "Cost of installation", big: "₹0", bigLabel: "retrofit: it works in spaces built for people", h: "Fit the world as it already is",
    d: "Conventional automation redesigns the facility around the machine. A humanoid works in spaces built for people: no new fixtures, no line redesign, no integrator.",
    state: "next" as State, s: "Design intent, to be proven in pilots" },
  { k: "Cost of adoption", big: "₹0", bigLabel: "upfront for the customer on a subscription", h: "Remove the capital barrier",
    d: "Even ₹1–5 lakh is a lot for a cash-strapped small business. A subscription turns the purchase into a monthly cost that can be stopped, with no financing.",
    state: "done" as State, s: "Nothing upfront for the customer" },
];

const offers = [
  { name: "Subscription", price: "₹8–20 thousand a month", d: "12–36 month contracts. We deploy, maintain and upgrade the robot." },
  { name: "Outright purchase", price: "₹1–5 lakh", d: "For households and businesses that want to own it. 35–45% gross margin for us." },
  { name: "Software and maintenance", price: "₹5–15 thousand a year", d: "Over-the-air updates, task modules and a maintenance contract on every unit." },
];

const phases = [
  { when: "First 12 months", h: "Prove it in Delhi NCR", d: "5–10 pilot deployments in food outlets and small factories. The first 20 units sold or on subscription." },
  { when: "Months 12–30", h: "Four more metros", d: "Mumbai, Bengaluru, Chennai and Hyderabad, and 200+ active subscriptions." },
  { when: "Months 30–48", h: "A platform beyond hardware", d: "A marketplace for task modules from outside developers, OEM partnerships, 1,000 units deployed." },
];

const status: { name: string; note: string; state: State }[] = [
  { name: "RdriveS1 motor driver", note: "Designed in-house, built and bench tested", state: "done" },
  { name: "Robotic arm with teleoperation", note: "Built, tested end to end outside simulation", state: "done" },
  { name: "Humanoid design, dume_v3", note: "1.19 m, 20 degrees of freedom, CAD complete", state: "done" },
  { name: "Walking, learned in simulation", note: "Flat ground and gentle slopes; stairs next", state: "progress" },
  { name: "First humanoid prototype", note: "Integration starts once simulation has de-risked the build", state: "next" },
];

const faqs = [
  { q: "Does the robot exist yet?",
    a: "Its parts do, and the whole robot exists in simulation. Our own motor driver and a teleoperated arm are built and tested. The humanoid, dume_v3, is fully designed in CAD and walks in a physics simulation built from that CAD. Assembling the first one is the next step." },
  { q: "What will it cost?",
    a: "₹1–5 lakh to buy outright, or ₹8–20 thousand a month on a 12–36 month subscription with nothing upfront. The subscription is priced at about what a small business already pays one worker." },
  { q: "Why a humanoid rather than a cheaper special-purpose machine?",
    a: "Because it fits spaces built for people. Conventional automation means redesigning the line around the machine; a humanoid needs no new fixtures, no line redesign and no integration contractor." },
  { q: "Where will it work first?",
    a: "Pilots start in Delhi NCR, in food outlets and small factories, with a plastics packaging factory and a household already committed as test sites. Then Mumbai, Bengaluru, Chennai and Hyderabad." },
  { q: "How can I get one?",
    a: "Join the waitlist and tell us about the work. We'll contact you when a pilot near you fits." },
];

export default function Home() {
  const flat = stats.scenarios.find((s) => s.id === "flat")!;
  const ramp = stats.scenarios.find((s) => s.id === "ramp_4_deg")!;
  const tiles = [
    { href: "/engineering#simulation", img: "walk_flat.jpg", alt: "dume_v3 walking on flat ground in simulation",
      h: "It walks, in simulation", d: `Upright for ${flat.survived_s.toFixed(0)} of ${flat.episode_s.toFixed(0)} seconds on flat ground, after about ${curve.total_steps_M} million training steps on one cloud GPU.` },
    { href: "/engineering#simulation", img: "walk_ramp8.jpg", alt: "dume_v3 walking up a ramp in simulation",
      h: "Real terrain, honest results", d: `${ramp.survived_s.toFixed(0)} of ${ramp.episode_s.toFixed(0)} seconds up a 4° ramp. Stairs are the next milestone, and the engineering page shows where it still falls.` },
    { href: "/engineering#arm", img: "arm_calibration_card.jpg", alt: "Simulated robot arm reaching a target after calibration",
      h: "An arm that calibrates itself", d: "An off-the-shelf vision-language-action model plus an automatic calibration layer cut reach error from 28.7 mm to 1.5 mm." },
  ];

  return (
    <Page>
      <HeroWalk />

      <Band tone="lab" id="problem" inner="py-24 sm:py-32">
        <h2 className="heading max-w-[22ch] text-graphite" style={{ fontSize: "clamp(2rem, 4.4vw, 3.6rem)" }}>
          A ₹50 lakh robot takes 23 years to pay back one job.
        </h2>
        <p className="measure mt-5 text-[18px] text-fog">
          Capability is solved. Price is not. 47% of Indian small businesses report acute labour shortages and wages rise about 8% a year, yet the automation
          that exists is priced for large enterprises.
        </p>
        <div className="mt-16"><PaybackSlider /></div>
      </Band>

      <Band tone="lab" id="how" inner="pb-24 sm:pb-32">
        <div className="border-t border-lab-line pt-16">
          <h2 className="heading max-w-[24ch] text-graphite" style={{ fontSize: "clamp(1.8rem, 3.6vw, 2.9rem)" }}>
            Three decisions take the price from ₹50 lakh to ₹1–5 lakh.
          </h2>
          <p className="measure mt-4 text-[17px] text-fog">Each one attacks a different cost, so the savings add up rather than overlap.</p>
          <div className="mt-12">
            <StackCards items={levers.map((l, i) => (
              <article key={l.h} className={`grid min-h-[340px] gap-8 rounded-[28px] border p-8 sm:p-12 md:grid-cols-[1.3fr_1fr] ${
                i === 2 ? "border-night-line bg-night text-lab" : i === 1 ? "border-lab-line bg-lab-2 text-graphite" : "border-lab-line bg-white text-graphite"}`}>
                <div className="flex flex-col">
                  <p className={`text-[15px] ${i === 2 ? "text-mist" : "text-fog"}`}>{l.k}</p>
                  <h3 className="heading mt-2 text-[28px] sm:text-[36px]">{l.h}</h3>
                  <p className={`mt-4 max-w-[46ch] text-[17px] leading-relaxed ${i === 2 ? "text-mist" : "text-fog"}`}>{l.d}</p>
                  <div className="mt-auto pt-8"><StateMark state={l.state} label={l.s} /></div>
                </div>
                <div className="flex flex-col justify-end md:items-end md:text-right">
                  <p className="numeral whitespace-nowrap leading-none" style={{ fontSize: l.big.length > 3 ? "clamp(2.6rem, 5vw, 4rem)" : "clamp(3.4rem, 8vw, 6.2rem)" }}>{l.big}</p>
                  <p className={`mt-2 max-w-[24ch] text-[15px] ${i === 2 ? "text-mist" : "text-fog"}`}>{l.bigLabel}</p>
                </div>
              </article>
            ))} />
          </div>
        </div>
      </Band>

      <Band tone="night" id="building" inner="py-24 sm:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="heading max-w-[18ch]" style={{ fontSize: "clamp(2rem, 4.4vw, 3.6rem)" }}>Being built now, in the open.</h2>
          <ButtonLink href="/engineering" kind="secondary">See the engineering</ButtonLink>
        </div>
        <Stagger className="mt-12 grid gap-4 md:grid-cols-6"
          itemClasses={["md:col-span-4 md:row-span-2", "md:col-span-2", "md:col-span-2", "md:col-span-3", "md:col-span-3"]}>
          {tiles.map((t, i) => (
            <Link key={t.h} href={t.href} className="block h-full">
              <SpotlightCard className="flex h-full flex-col rounded-3xl border border-night-line bg-night-2">
                <div className={`relative w-full overflow-hidden ${i === 0 ? "aspect-[16/10] md:aspect-auto md:flex-1 md:min-h-[360px]" : "aspect-[16/10]"}`}>
                  <Image src={`/engineering/${t.img}`} alt={t.alt} fill sizes={i === 0 ? "(min-width: 768px) 66vw, 100vw" : "(min-width: 768px) 33vw, 100vw"}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
                  <span className="absolute left-4 top-4"><SimTag /></span>
                </div>
                <div className="p-6">
                  <h3 className="heading text-[20px] text-lab">{t.h}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-mist">{t.d}</p>
                </div>
              </SpotlightCard>
            </Link>
          ))}
          <SpotlightCard className="flex h-full flex-col justify-between rounded-3xl border border-night-line bg-night-2 p-6">
            <p className="text-[15px] text-mist">Training so far</p>
            <p className="numeral mt-6 text-lab" style={{ fontSize: "clamp(2.8rem, 6vw, 4.4rem)" }}><CountUp value={`${curve.total_steps_M}M`} /></p>
            <p className="mt-2 text-[15px] text-mist">simulated steps on one cloud GPU, flat ground first, then stairs and ramps</p>
          </SpotlightCard>
          <Link href="/engineering#lessons" className="block h-full">
            <SpotlightCard className="flex h-full flex-col justify-between rounded-3xl border border-night-line bg-night-2 p-6">
              <p className="text-[15px] text-mist">What broke along the way</p>
              <p className="heading mt-6 text-[26px] text-lab">Knees that bent backwards, joint limits 57 times too small, and a randomiser that did nothing.</p>
              <p className="mt-4 text-[15px] text-z">Read the four lessons</p>
            </SpotlightCard>
          </Link>
        </Stagger>
        <div className="mt-20 grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h3 className="heading text-[26px]">Where each piece stands</h3>
            <p className="mt-3 max-w-[36ch] text-[16px] text-mist">The highest-risk parts went first. The humanoid itself is proven in simulation before we commit to the build.</p>
          </div>
          <Stagger as="ul" className="divide-y divide-night-line border-y border-night-line">
            {status.map((s) => (
              <StaggerLi key={s.name} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-4">
                <div className="min-w-0">
                  <p className="text-[16px] text-lab">{s.name}</p>
                  <p className="text-[14px] text-fog">{s.note}</p>
                </div>
                <span className="text-mist"><StateMark state={s.state} /></span>
              </StaggerLi>
            ))}
          </Stagger>
        </div>
      </Band>

      <Band tone="lab" id="model" inner="py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <h2 className="heading text-graphite" style={{ fontSize: "clamp(2rem, 4.4vw, 3.6rem)" }}>Own it, or rent it by the month.</h2>
            <p className="measure mt-5 text-[18px] text-fog">
              Every deployed robot earns ₹3.0–7.7 lakh over a three-year contract, and keeps earning for as long as it is working. The model is
              built on subscriptions, not one-off sales.
            </p>
          </div>
          <dl className="divide-y divide-lab-line border-y border-lab-line">
            {offers.map((o) => (
              <div key={o.name} className="grid gap-1 py-6 sm:grid-cols-[1fr_1.4fr] sm:gap-8">
                <dt>
                  <span className="block text-[15px] text-fog">{o.name}</span>
                  <span className="numeral block text-[24px] text-graphite">{o.price}</span>
                </dt>
                <dd className="text-[16px] leading-relaxed text-fog sm:pt-6">{o.d}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-24 grid gap-10 border-t border-lab-line pt-16 sm:grid-cols-3">
          {[
            ["₹30–77 crore", "Three-year revenue from the first 1,000 robots, sized from our own contract pricing."],
            ["1 in 60,000", "The share of India's 60M+ small businesses those 1,000 robots need. The plan does not need market dominance."],
            ["$290 billion", "The IFR's global service-robot market by 2030. We treat it as a ceiling, not a target."],
          ].map(([v, d]) => (
            <div key={v}>
              <p className="numeral whitespace-nowrap text-graphite" style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}><CountUp value={v} /></p>
              <p className="mt-2 max-w-[30ch] text-[15px] leading-relaxed text-fog">{d}</p>
            </div>
          ))}
        </div>
      </Band>

      <Band tone="night" id="phases" inner="py-24 sm:py-32">
        <h2 className="heading max-w-[20ch]" style={{ fontSize: "clamp(2rem, 4.4vw, 3.6rem)" }}>One city first, then the country.</h2>
        <p className="measure mt-5 text-[18px] text-mist">
          Proving the economics in one city keeps service costs under control and produces the reference customers that sell the next phase.
        </p>
        <DrawLine className="mt-14" />
        <Stagger as="ol" gap={0.14} className="mt-8 grid gap-4 md:grid-cols-3">
          {phases.map((p, i) => (
            <StaggerLi key={p.h} className="rounded-3xl border border-night-line bg-night-2/60 p-7">
              <p className="numeral text-[44px] leading-none text-z">{i + 1}</p>
              <p className="mt-6 text-[14px] text-fog">{p.when}</p>
              <h3 className="heading mt-1 text-[22px]">{p.h}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-mist">{p.d}</p>
            </StaggerLi>
          ))}
        </Stagger>
      </Band>

      <Band tone="lab" id="faq" inner="py-24 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <h2 className="heading text-graphite" style={{ fontSize: "clamp(2rem, 4.4vw, 3.4rem)" }}>Questions people ask</h2>
          <div className="text-graphite"><Accordion tone="lab" items={faqs} /></div>
        </div>
      </Band>

      <Band tone="night-2" id="join" inner="py-24 sm:py-28">
        <div className="grid gap-5 md:grid-cols-2">
          <SpotlightCard className="rounded-3xl border border-night-line bg-night p-8 sm:p-10">
            <h2 className="heading text-[28px] sm:text-[34px]">Run a factory, a shop or a kitchen?</h2>
            <p className="mt-3 max-w-[40ch] text-[16px] text-mist">Our first pilots are in Delhi NCR. Tell us about the work and we will contact you when a pilot fits.</p>
            <div className="mt-8"><ButtonLink href="/waitlist">Join the waitlist</ButtonLink></div>
          </SpotlightCard>
          <SpotlightCard className="rounded-3xl border border-night-line bg-night p-8 sm:p-10">
            <h2 className="heading text-[28px] sm:text-[34px]">Investing in deep tech?</h2>
            <p className="mt-3 max-w-[40ch] text-[16px] text-mist">We are raising a pre-seed round to build the first humanoid and run the first paying pilots.</p>
            <div className="mt-8"><ButtonLink href="/investors" kind="secondary">For investors</ButtonLink></div>
          </SpotlightCard>
        </div>
      </Band>
    </Page>
  );
}
