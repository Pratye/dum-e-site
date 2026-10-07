import Image from "next/image";
import Link from "next/link";

export const EMAIL = "pratye.aggarwal@gmail.com";
export const ORANGE = "#FF6600";
export const LINE = "rgba(255,102,0,0.15)";
export const MUTED = "#8A8A8A";
export const FG = "#FAFAF8";
export const CARD_BG = "rgba(255,102,0,0.03)";

/** Page frame: dark ground, soft orange glows, centred 1100px column. */
export function Shell({ children, active }: { children: React.ReactNode; active?: "home" | "engineering" }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "#0D0D0D", color: FG }}>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
        <div style={{
          position: "absolute", top: "-100px", left: "-100px", width: "500px", height: "500px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,102,0,0.12) 0%, transparent 65%)", filter: "blur(60px)",
        }} />
        <div style={{
          position: "absolute", bottom: "20vh", right: "-120px", width: "420px", height: "420px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,102,0,0.08) 0%, transparent 65%)", filter: "blur(70px)",
        }} />
      </div>
      <SiteHeader active={active} />
      <div className="relative z-10 mx-auto w-full max-w-[1100px] px-5 sm:px-8 lg:px-10">{children}</div>
    </div>
  );
}

export function SiteHeader({ active }: { active?: "home" | "engineering" }) {
  const link = (on: boolean): React.CSSProperties => ({ color: on ? FG : MUTED });
  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md"
      style={{ background: "rgba(13,13,13,0.82)", borderBottom: `1px solid ${LINE}` }}
    >
      <div className="mx-auto flex w-full max-w-[1100px] items-center justify-between gap-3 px-5 py-4 sm:px-8 lg:px-10">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/dum-e-logo.png" alt="Dum-E Robotics" width={36} height={36} style={{ height: "auto", objectFit: "contain" }} priority />
          <span className="font-semibold tracking-tight text-sm sm:text-base" style={{ color: FG, letterSpacing: "-0.01em" }}>
            Dum-E Robotics
          </span>
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6 text-xs uppercase tracking-widest">
          <Link href="/engineering" className="transition-colors hover:text-white" style={link(active === "engineering")}>
            Engineering
          </Link>
          <a href={`mailto:${EMAIL}`} className="btn-outline-orange border rounded-full px-4 py-2.5 transition-all duration-200">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer
      className="py-8 flex flex-wrap items-center justify-between gap-4 text-xs uppercase tracking-wider"
      style={{ borderTop: `1px solid ${LINE}`, color: MUTED }}
    >
      <p>Dum-E Robotics · New Delhi, India · 2026</p>
      <a href={`mailto:${EMAIL}`} className="border rounded-full px-4 py-2.5 transition-all duration-200 btn-outline-orange">
        Start a conversation
      </a>
    </footer>
  );
}

export function Section({ id, children, first }: { id?: string; children: React.ReactNode; first?: boolean }) {
  return (
    <section id={id} className="py-16 scroll-mt-20" style={first ? undefined : { borderTop: `1px solid ${LINE}` }}>
      {children}
    </section>
  );
}

export function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`font-semibold leading-[1.1] ${className}`} style={{ fontSize: "clamp(1.4rem, 2.6vw, 2.2rem)", color: FG }}>
      {children}
    </h2>
  );
}

export function Lede({ children }: { children: React.ReactNode }) {
  return <p className="mt-3 leading-[1.72] text-[0.94rem] max-w-[640px]" style={{ color: MUTED }}>{children}</p>;
}

export type Tone = "done" | "progress" | "next" | "sim";

/** Small status chip. "sim" marks a figure that comes from simulation, not hardware. */
export function Chip({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  const styles: Record<Tone, React.CSSProperties> = {
    done:     { background: ORANGE, color: "#0D0D0D", borderColor: ORANGE },
    progress: { background: "rgba(255,102,0,0.10)", color: ORANGE, borderColor: "rgba(255,102,0,0.45)" },
    next:     { background: "transparent", color: MUTED, borderColor: "rgba(138,138,138,0.4)" },
    sim:      { background: "rgba(13,13,13,0.72)", color: FG, borderColor: "rgba(250,250,248,0.28)" },
  };
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.14em] whitespace-nowrap"
      style={styles[tone]}
    >
      {tone === "sim" && <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: ORANGE }} />}
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`card-hover rounded-2xl p-6 ${className}`} style={{ border: `1px solid ${LINE}`, background: CARD_BG }}>
      {children}
    </div>
  );
}
