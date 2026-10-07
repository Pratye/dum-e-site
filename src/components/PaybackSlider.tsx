"use client";

import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion, useSpring, useTransform } from "motion/react";

// Deck exhibit 2: payback = robot price / one worker's annual wage (₹18,000 a month).
const WAGE_YEAR = 18_000 * 12;
const MIN_L = 1, MAX_L = 50;                       // ₹ lakh
const MARKS = [
  { l: 50, label: "Robots today" },
  { l: 5, label: "Dum-E, upper" },
  { l: 1, label: "Dum-E, lower" },
];
// log scale so ₹1 L and ₹5 L are as easy to reach as ₹50 L
const toPos = (l: number) => (Math.log(l) - Math.log(MIN_L)) / (Math.log(MAX_L) - Math.log(MIN_L));
const fromPos = (p: number) => Math.exp(Math.log(MIN_L) + p * (Math.log(MAX_L) - Math.log(MIN_L)));
const years = (l: number) => (l * 1e5) / WAGE_YEAR;

export default function PaybackSlider() {
  const id = useId();
  const reduce = useReducedMotion();
  const [lakh, setLakh] = useState(50);
  const y = years(lakh);
  const spring = useSpring(y, reduce ? { duration: 0 } : { stiffness: 120, damping: 22 });
  useEffect(() => { spring.set(y); }, [spring, y]);
  const shown = useTransform(spring, (v) => (v < 10 ? v.toFixed(1) : v.toFixed(0)));
  const bar = useTransform(spring, (v) => `${Math.min(v / years(MAX_L), 1) * 100}%`);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
      <div>
        <p className="text-[15px] text-fog">Years for a robot to pay back one ₹18,000-a-month job</p>
        <p className="numeral mt-2 leading-none text-graphite" style={{ fontSize: "clamp(4.5rem, 13vw, 9.5rem)" }} aria-live="polite">
          <motion.span>{shown}</motion.span>
          <span className="ml-3 align-baseline text-[0.28em] font-semibold tracking-normal text-fog">years</span>
        </p>
        <div className="mt-6 h-2 w-full rounded-full bg-lab-2" aria-hidden="true">
          <motion.div className="h-full rounded-full bg-z" style={{ width: bar }} />
        </div>
      </div>
      <div className="flex flex-col justify-end">
        <label htmlFor={id} className="text-[15px] text-fog">
          Robot price: <span className="numeral text-[22px] text-graphite">₹{lakh < 10 ? lakh.toFixed(1) : lakh.toFixed(0)} lakh</span>
        </label>
        <input
          id={id} type="range" className="track mt-3" min={0} max={1000} step={1}
          value={Math.round(toPos(lakh) * 1000)}
          aria-valuetext={`₹${lakh.toFixed(1)} lakh, paying back in ${y.toFixed(1)} years`}
          onChange={(e) => setLakh(fromPos(Number(e.target.value) / 1000))}
        />
        <div className="mt-4 flex flex-wrap gap-2">
          {MARKS.map((m) => (
            <button key={m.l} type="button" onClick={() => setLakh(m.l)}
              className={`rounded-full border px-4 py-2 text-[14px] transition-colors ${Math.abs(lakh - m.l) < 0.05 ? "border-z bg-z text-white" : "border-lab-line text-graphite hover:border-graphite/40"}`}>
              {m.label}, ₹{m.l} L
            </button>
          ))}
        </div>
        <p className="mt-6 max-w-[48ch] text-[15px] leading-relaxed text-fog">
          At ₹50 lakh a robot outlives its own payback period. At ₹1–5 lakh it pays for itself in under two and a half years, and on a
          ₹8–20 thousand monthly subscription it costs about what the job already does.
        </p>
      </div>
    </div>
  );
}
