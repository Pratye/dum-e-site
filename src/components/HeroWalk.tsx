"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { useReduce } from "@/components/motion";
import type { WalkData } from "./WalkCanvas";
import { SimTag } from "./ui";

const WalkCanvas = dynamic(() => import("./WalkCanvas"), { ssr: false });

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * The hero is the robot itself: dume_v3 replaying the walking policy we trained, one simulation frame per slice of
 * scroll. The telemetry under it is the same rollout's foot contacts and speed, so the picture and the numbers move
 * together. With reduced motion the section is not pinned and the robot holds one mid-stride frame.
 */
export default function HeroWalk() {
  const reduce = useReduce();
  const section = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const [data, setData] = useState<WalkData | null>(null);
  const tOut = useRef<HTMLSpanElement>(null);
  const vOut = useRef<HTMLSpanElement>(null);
  const lDot = useRef<HTMLSpanElement>(null);
  const rDot = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let live = true;
    fetch("/models/dume_v3_walk.json").then((r) => r.json()).then((d: WalkData) => { if (live) setData(d); });
    return () => { live = false; };
  }, []);

  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const playhead = useTransform(scrollYProgress, (v) => `${(reduce ? 0.5 : v) * 100}%`);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  const paint = (v: number) => {
    if (!data) return;
    const f = (reduce ? 0.5 : v) * (data.frames - 1);
    frame.current = f;
    const i = Math.round(f);
    // speed averaged over a quarter second so the readout is legible, not jittery
    const lo = Math.max(0, i - 3), hi = Math.min(data.frames - 1, i + 3);
    let s = 0; for (let k = lo; k <= hi; k++) s += data.vx[k];
    if (tOut.current) tOut.current.textContent = (f / data.fps).toFixed(2);
    const sp = s / (hi - lo + 1);
    if (vOut.current) vOut.current.textContent = (Math.abs(sp) < 0.03 ? 0 : sp).toFixed(2);
    const [l, r] = data.contact[i];
    if (lDot.current) lDot.current.style.opacity = l ? "1" : "0.18";
    if (rDot.current) rDot.current.style.opacity = r ? "1" : "0.18";
  };
  useMotionValueEvent(scrollYProgress, "change", paint);
  useEffect(() => { paint(scrollYProgress.get()); });   // first paint once data arrives

  const rise = (d: number) => reduce ? {} : {
    initial: { opacity: 0, y: 26 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, ease, delay: d },
  };

  return (
    <section ref={section} className="relative bg-night" style={{ height: reduce ? "auto" : "300vh" }} aria-label="Introduction">
      <div className={`${reduce ? "" : "sticky top-0"} flex h-[100svh] min-h-[640px] flex-col overflow-hidden`}>
        {/* a low horizon glow in the brand blue, the only atmosphere on the page */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
          style={{ background: "radial-gradient(60% 70% at 62% 100%, rgba(76,125,255,0.22) 0%, rgba(10,21,48,0) 70%)" }} />

        <div className="relative min-h-0 flex-1">
          {/* the 3D scene: full-bleed behind the headline on wide screens, below it on phones */}
          <div className="absolute inset-x-0 bottom-0 top-[52%] lg:inset-0">
            {data ? <WalkCanvas data={data} frame={frame} /> : (
              <div className="absolute inset-0 flex items-center justify-center lg:justify-end lg:pr-[22%]"><div className="loader-ring" /></div>
            )}
            <div className="pointer-events-none absolute left-5 top-0 lg:left-auto lg:right-[10%] lg:top-[16%]"><SimTag /></div>
          </div>

          <div className="pointer-events-none relative mx-auto flex h-full w-full max-w-[1180px] flex-col px-5 pt-24 sm:px-8 lg:justify-center lg:pt-16">
            <div className="max-w-[600px]">
              <motion.h1 {...rise(0.05)} className="display text-lab" style={{ fontSize: "clamp(2.6rem, 6vw, 5.9rem)" }}>
                The Maruti<br />of robots.
              </motion.h1>
              <motion.p {...rise(0.25)} className="mt-5 max-w-[34ch] text-[17px] leading-relaxed text-mist sm:text-[19px]">
                Humanoid robots that India&apos;s 60 million small businesses can buy for ₹1–5 lakh, or rent for about what they pay one worker.
              </motion.p>
              <motion.div {...rise(0.4)} className="pointer-events-auto mt-7 flex flex-wrap gap-3">
                <Link href="/waitlist" className="rounded-full bg-z px-6 py-3 text-[15px] font-medium text-white transition-colors hover:bg-z-deep">Join the waitlist</Link>
                <Link href="/engineering" className="rounded-full border border-night-line bg-night/40 px-6 py-3 text-[15px] text-lab backdrop-blur transition-colors hover:border-mist/50">See the engineering</Link>
              </motion.div>
            </div>
          </div>
        </div>

        {/* telemetry: the same rollout's contacts and speed, scrubbed with the robot */}
        <div className="relative border-t border-night-line bg-night/80 backdrop-blur">
          <div className="mx-auto grid w-full max-w-[1180px] gap-x-8 gap-y-2 px-5 py-3 sm:px-8 md:grid-cols-[auto_1fr] md:items-center">
            <dl className="flex gap-6 font-mono text-[13px] text-mist">
              <div><dt className="text-fog">time</dt><dd className="text-lab"><span ref={tOut}>0.00</span> s</dd></div>
              <div><dt className="text-fog">speed</dt><dd className="text-lab"><span ref={vOut}>0.00</span> m/s</dd></div>
              <div><dt className="text-fog">command</dt><dd className="text-lab">{data ? data.cmd_mps.toFixed(2) : "0.60"} m/s</dd></div>
            </dl>
            <div className="relative">
              {data && <GaitTrace data={data} />}
              <motion.div aria-hidden="true" className="absolute -top-1 bottom-[-4px] w-px bg-lab" style={{ left: playhead }} />
              <div className="mt-1.5 flex items-center gap-5 font-mono text-[12px] text-fog">
                <span className="inline-flex items-center gap-1.5"><span ref={lDot} className="h-2 w-2 rounded-full bg-z" />left foot down</span>
                <span className="inline-flex items-center gap-1.5"><span ref={rDot} className="h-2 w-2 rounded-full bg-x" />right foot down</span>
                {!reduce && <motion.span style={{ opacity: hintOpacity }} className="ml-auto hidden text-mist sm:inline">Scroll to step through the walk</motion.span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Two rows, one per foot: a bar wherever that foot is on the ground. Real contact flags from the rollout. */
function GaitTrace({ data }: { data: WalkData }) {
  const n = data.frames;
  const runs = (foot: number) => {
    const out: [number, number][] = []; let s = -1;
    data.contact.forEach((c, i) => {
      if (c[foot] && s < 0) s = i;
      if ((!c[foot] || i === n - 1) && s >= 0) { out.push([s, c[foot] ? i : i - 1]); s = -1; }
    });
    return out;
  };
  return (
    <svg viewBox={`0 0 ${n} 20`} preserveAspectRatio="none" className="h-6 w-full" role="img"
      aria-label="Foot contact over four seconds of walking: the left and right feet alternate, with brief double-support phases.">
      {runs(0).map(([a, b]) => <rect key={`l${a}`} x={a} y={1} width={b - a + 1} height={7} rx={1} fill="var(--color-z)" />)}
      {runs(1).map(([a, b]) => <rect key={`r${a}`} x={a} y={12} width={b - a + 1} height={7} rx={1} fill="var(--color-x)" />)}
    </svg>
  );
}
