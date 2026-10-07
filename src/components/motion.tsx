"use client";

/**
 * Card and section motion, all built on `motion`. Every piece checks reduced motion and falls back to a plain,
 * fully visible layout, so nothing here ever hides content from someone who has turned animation off.
 */
import { Children, useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  AnimatePresence, animate, motion, useInView, useMotionTemplate, useMotionValue,
  useScroll, useSpring, useTransform, type MotionValue,
} from "motion/react";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Reduced-motion preference that hydrates cleanly. The server cannot know the setting, so it renders the animated
 * markup; the client starts from that same snapshot and switches after hydration. (`useReducedMotion` answers
 * differently on each side, which makes React throw away the server HTML.)
 */
const RM = "(prefers-reduced-motion: reduce)";
export function useReduce() {
  return useSyncExternalStore(
    (cb) => { const m = matchMedia(RM); m.addEventListener("change", cb); return () => m.removeEventListener("change", cb); },
    () => matchMedia(RM).matches,
    () => false,
  );
}

/** Children rise into place one after another when the group scrolls into view. */
export function Stagger({ children, className = "", gap = 0.08, as = "div", itemClasses }:
  { children: React.ReactNode; className?: string; gap?: number; as?: "div" | "ul" | "ol" | "dl";
    /** class for the wrapper around child i -- grid placement (col-span etc.) belongs here, not on the child */
    itemClasses?: string[] }) {
  const reduce = useReduce();
  const Tag = motion[as];
  const Item = as === "ul" || as === "ol" ? motion.li : motion.div;
  if (reduce) {
    const T = as;
    return <T className={className}>{itemClasses ? Children.map(children, (c, i) => <div className={itemClasses[i]}>{c}</div>) : children}</T>;
  }
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}>
      {Children.map(children, (c, i) => c == null ? null : (
        as === "ul" || as === "ol"
          ? c
          : <Item className={itemClasses?.[i]} variants={{ hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } } }}>{c}</Item>
      ))}
    </Tag>
  );
}

/** A list item that takes part in a parent <Stagger as="ul|ol">. */
export function StaggerLi({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const reduce = useReduce();
  if (reduce) return <li className={className}>{children}</li>;
  return (
    <motion.li className={className}
      variants={{ hidden: { opacity: 0, x: -16 }, show: { opacity: 1, x: 0, transition: { duration: 0.55, ease } } }}>
      {children}
    </motion.li>
  );
}

/**
 * A card with a soft spotlight that follows the cursor and a slight lift. The light answers the pointer, so it only
 * appears while someone is actually exploring the card.
 */
export function SpotlightCard({ children, className = "", tone = "night" }:
  { children: React.ReactNode; className?: string; tone?: "night" | "lab" }) {
  const reduce = useReduce();
  const x = useMotionValue(-400), y = useMotionValue(-400);
  const rx = useSpring(0, { stiffness: 160, damping: 18 }), ry = useSpring(0, { stiffness: 160, damping: 18 });
  const glow = tone === "lab" ? "rgba(76,125,255,0.14)" : "rgba(76,125,255,0.22)";
  const bg = useMotionTemplate`radial-gradient(420px circle at ${x}px ${y}px, ${glow}, transparent 70%)`;
  return (
    <motion.div
      className={`group relative overflow-hidden ${className}`}
      style={reduce ? undefined : { rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - r.left); y.set(e.clientY - r.top);
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 5); rx.set(-((e.clientY - r.top) / r.height - 0.5) * 5);
      }}
      onPointerLeave={() => { x.set(-400); y.set(-400); rx.set(0); ry.set(0); }}
      whileHover={reduce ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      {!reduce && <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" style={{ background: bg }} />}
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}

/**
 * Cards that pin and stack as you scroll: each one slides over the last, and the ones underneath settle back and dim.
 * Used where the content is a set the reader should hold in mind together.
 */
export function StackCards({ items, top = 104 }: { items: React.ReactNode[]; top?: number }) {
  const reduce = useReduce();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  if (reduce) return <div className="grid gap-5">{items.map((c, i) => <div key={i}>{c}</div>)}</div>;
  return (
    <div ref={ref} className="relative">
      {items.map((c, i) => (
        <div key={i}>
          <StackCard i={i} n={items.length} progress={scrollYProgress} top={top}>{c}</StackCard>
          {/* the scroll distance between cards: each spacer is how long the reader dwells on a card before the next arrives */}
          {i < items.length - 1 && <div aria-hidden="true" style={{ height: "34vh" }} />}
        </div>
      ))}
    </div>
  );
}

function StackCard({ children, i, n, progress, top }:
  { children: React.ReactNode; i: number; n: number; progress: MotionValue<number>; top: number }) {
  // once the next card starts to arrive, this one settles back a little and dims under it
  const from = Math.min((i + 0.6) / n, 1);
  const scale = useTransform(progress, [from, 1], [1, 1 - (n - 1 - i) * 0.04]);
  const dim = useTransform(progress, [from, 1], [0, i === n - 1 ? 0 : 0.28]);
  return (
    <div className="sticky" style={{ top: top + i * 20 }}>
      <motion.div style={{ scale, transformOrigin: "top center" }} className="relative">
        {children}
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-[28px] bg-graphite" style={{ opacity: dim }} />
      </motion.div>
    </div>
  );
}

/**
 * A number that counts up once, when it first comes into view. Non-numeric parts (₹, crore, ranges) stay put. The
 * server renders the real figure, so it is right without JavaScript; the client zeroes it only until it is seen.
 */
export function CountUp({ value, className = "", style }: { value: string; className?: string; style?: React.CSSProperties }) {
  const reduce = useReduce();
  const ref = useRef<HTMLSpanElement>(null);
  const text = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const p = useMotionValue(1);
  useEffect(() => {
    const nums = [...value.matchAll(/\d[\d,]*(?:\.\d+)?/g)].map((m) => ({ s: m[0], i: m.index!, v: Number(m[0].replace(/,/g, "")) }));
    const draw = (k: number) => {
      if (!text.current) return;
      let out = "", last = 0;
      for (const n of nums) {
        const dec = (n.s.split(".")[1] ?? "").length;
        let t = (n.v * k).toFixed(dec);
        if (n.s.includes(",")) t = Number(t).toLocaleString("en-IN");
        out += value.slice(last, n.i) + t; last = n.i + n.s.length;
      }
      text.current.textContent = out + value.slice(last);
    };
    const off = p.on("change", draw);
    if (reduce) { p.set(1); draw(1); return off; }
    if (!seen) { p.set(0); draw(0); return off; }
    const ctl = animate(p, 1, { duration: 1.4, ease: [0.16, 1, 0.3, 1] });
    return () => { ctl.stop(); off(); };
  }, [seen, reduce, value, p]);
  return <span ref={ref} className={className} style={style} aria-label={value}><span ref={text} aria-hidden="true">{value}</span></span>;
}

/** A horizontal line that draws itself as its section scrolls through the viewport. */
export function DrawLine({ className = "" }: { className?: string }) {
  const reduce = useReduce();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const scaleX = useSpring(useTransform(scrollYProgress, [0, 1], [0, 1]), { stiffness: 120, damping: 28 });
  return (
    <div ref={ref} className={`relative h-px w-full bg-night-line ${className}`} aria-hidden="true">
      <motion.div className="absolute inset-0 origin-left bg-z" style={{ scaleX: reduce ? 1 : scaleX }} />
    </div>
  );
}

/** FAQ: one open at a time, height animated so the page below moves smoothly rather than jumping. */
export function Accordion({ items, tone = "night" }: { items: { q: string; a: string }[]; tone?: "night" | "lab" }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReduce();
  const line = tone === "lab" ? "border-lab-line" : "border-night-line";
  return (
    <div className={`divide-y ${tone === "lab" ? "divide-lab-line" : "divide-night-line"} border-y ${line}`}>
      {items.map((it, i) => {
        const on = open === i;
        return (
          <div key={it.q}>
            <h3>
              <button type="button" aria-expanded={on} aria-controls={`faq-${i}`} id={`faq-q-${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left text-[18px] heading">
                {it.q}
                <motion.span aria-hidden="true" animate={{ rotate: on ? 45 : 0 }} transition={{ duration: reduce ? 0 : 0.25 }}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-current/20 text-[20px] font-light">+</motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div id={`faq-${i}`} role="region" aria-labelledby={`faq-q-${i}`} key="a"
                  initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.35, ease }} className="overflow-hidden">
                  <p className={`max-w-[68ch] pb-6 text-[16px] leading-relaxed ${tone === "lab" ? "text-fog" : "text-mist"}`}>{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
