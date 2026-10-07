import type { Metadata } from "next";
import InterestForm from "@/components/InterestForm";
import { Band, Page } from "@/components/ui";

export const metadata: Metadata = {
  title: "Join the waitlist | Dum-E Robotics",
  description: "Tell us about the work a Dum-E humanoid would do for your business or home, and we'll contact you when a pilot fits.",
};

const steps = [
  { h: "Tell us about the work", d: "The tasks, the shifts and the space. The more specific, the better we can match a pilot to it." },
  { h: "We contact you when a pilot fits", d: "The first pilots are in Delhi NCR, in food outlets and small factories, then four more metros." },
  { h: "Pilots run on a subscription", d: "We deploy, maintain and upgrade the robot. You pay monthly, with nothing upfront." },
];

export default function Waitlist() {
  return (
    <Page>
      <Band tone="night" inner="pt-36 pb-24 sm:pt-44">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <h1 className="display" style={{ fontSize: "clamp(2.6rem, 6.4vw, 5.2rem)" }}>Be first in line for a robot.</h1>
            <p className="mt-6 max-w-[42ch] text-[18px] leading-relaxed text-mist">
              Dum-E humanoids will cost ₹1–5 lakh to buy, or ₹8–20 thousand a month to rent. We aren&apos;t taking orders yet: the first robot is being
              proven in simulation before it&apos;s built. Join the list and we&apos;ll contact you when a pilot near you fits.
            </p>
            <ol className="mt-12 space-y-7">
              {steps.map((s, i) => (
                <li key={s.h} className="grid grid-cols-[2.5rem_1fr] gap-3">
                  <span className="numeral text-[28px] leading-none text-z">{i + 1}</span>
                  <div>
                    <h2 className="heading text-[20px]">{s.h}</h2>
                    <p className="mt-1 text-[15px] leading-relaxed text-mist">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-3xl border border-night-line bg-night-2/60 p-6 sm:p-9">
            <InterestForm kind="waitlist" />
          </div>
        </div>
      </Band>
    </Page>
  );
}
