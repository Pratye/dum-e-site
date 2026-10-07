import Link from "next/link";
import Nav from "./Nav";

export const EMAIL = "pratye.aggarwal@gmail.com";

/** The deck's robot-head mark, redrawn as vector so it takes the brand colour. */
export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="32" fill="var(--color-z)" />
      <rect x="31" y="11" width="2.6" height="8" rx="1.3" fill="#fff" />
      <rect x="18" y="19" width="28" height="22" rx="5" fill="#fff" />
      <rect x="12.5" y="25" width="3.6" height="10" rx="1.8" fill="#fff" />
      <rect x="47.9" y="25" width="3.6" height="10" rx="1.8" fill="#fff" />
      <circle cx="26" cy="28" r="2.8" fill="var(--color-z)" />
      <circle cx="38" cy="28" r="2.8" fill="var(--color-z)" />
      <rect x="25" y="34" width="4" height="2" rx="1" fill="var(--color-z)" />
      <rect x="30.5" y="34" width="4" height="2" rx="1" fill="var(--color-z)" />
      <rect x="36" y="34" width="4" height="2" rx="1" fill="var(--color-z)" />
    </svg>
  );
}

export function Page({ children, tone = "night" }: { children: React.ReactNode; tone?: "night" | "lab" }) {
  return (
    <div className={tone === "lab" ? "bg-lab text-graphite" : "bg-night text-lab"}>
      <Nav />
      <main id="main">{children}</main>
      <Footer />
    </div>
  );
}

/** A full-bleed band in one of the two grounds, with the standard column inside. */
export function Band({ tone, id, children, className = "", inner = "" }:
  { tone: "night" | "lab" | "night-2"; id?: string; children: React.ReactNode; className?: string; inner?: string }) {
  const bg = tone === "lab" ? "bg-lab text-graphite" : tone === "night-2" ? "bg-night-2 text-lab" : "bg-night text-lab";
  return (
    <section id={id} className={`${bg} relative scroll-mt-24 ${className}`}>
      <div className={`mx-auto w-full max-w-[1180px] px-5 sm:px-8 ${inner}`}>{children}</div>
    </section>
  );
}

export function ButtonLink({ href, children, kind = "primary", tone = "night" }:
  { href: string; children: React.ReactNode; kind?: "primary" | "secondary"; tone?: "night" | "lab" }) {
  const base = "inline-flex items-center justify-center rounded-full px-6 py-3 text-[15px] font-medium transition-colors duration-200";
  const cls = kind === "primary"
    ? "bg-z text-white hover:bg-z-deep"
    : tone === "lab"
      ? "border border-lab-line text-graphite hover:border-graphite/40"
      : "border border-night-line text-lab hover:border-mist/50";
  const external = href.startsWith("mailto:") || href.startsWith("http");
  return external
    ? <a href={href} className={`${base} ${cls}`}>{children}</a>
    : <Link href={href} className={`${base} ${cls}`}>{children}</Link>;
}

export type State = "done" | "progress" | "next";
const STATE_LABEL: Record<State, string> = { done: "Done", progress: "In progress", next: "Next" };

/** Progress state as shape + word, never colour alone: a filled, half-filled or empty dot. */
export function StateMark({ state, label }: { state: State; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-[13px] font-medium">
      <svg viewBox="0 0 12 12" className="h-3 w-3 shrink-0" aria-hidden="true">
        <circle cx="6" cy="6" r="5" fill="none" stroke="var(--color-z)" strokeWidth="1.5" />
        {state === "done" && <circle cx="6" cy="6" r="5" fill="var(--color-z)" />}
        {state === "progress" && <path d="M6 1 A5 5 0 0 1 6 11 Z" fill="var(--color-z)" />}
      </svg>
      {label ?? STATE_LABEL[state]}
    </span>
  );
}

/** Marks a number or clip as coming from simulation, not hardware. */
export function SimTag() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-night-line bg-night/70 px-2.5 py-0.5 text-[12px] font-medium text-mist backdrop-blur">
      <span className="h-1.5 w-1.5 rounded-full bg-z" aria-hidden="true" />
      Simulation
    </span>
  );
}

function Footer() {
  return (
    <footer className="bg-night text-mist border-t border-night-line">
      <div className="mx-auto grid w-full max-w-[1180px] gap-10 px-5 py-14 sm:grid-cols-[1.4fr_1fr_1fr] sm:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3 text-lab">
            <Logo className="h-8 w-8" />
            <span className="heading text-lg">Dum-E Robotics</span>
          </Link>
          <p className="mt-4 max-w-[34ch] text-[15px]">Affordable humanoid robots for India&apos;s small businesses. Built in New Delhi.</p>
        </div>
        <nav aria-label="Site" className="flex flex-col gap-2.5 text-[15px]">
          <Link href="/engineering" className="hover:text-lab">Engineering</Link>
          <Link href="/waitlist" className="hover:text-lab">Join the waitlist</Link>
          <Link href="/investors" className="hover:text-lab">For investors</Link>
        </nav>
        <div className="flex flex-col gap-2.5 text-[15px]">
          <a href={`mailto:${EMAIL}`} className="hover:text-lab">{EMAIL}</a>
          <a href="https://linkedin.com/in/pratye-aggarwal-84076a210" target="_blank" rel="noreferrer" className="hover:text-lab">LinkedIn</a>
          <p className="mt-2 text-[13px] text-fog">© 2026 Dum-E Robotics, New Delhi</p>
        </div>
      </div>
    </footer>
  );
}
