"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "./ui";

const LINKS = [
  { href: "/engineering", label: "Engineering" },
  { href: "/investors", label: "For investors" },
];

/** A floating pill that stays dark over both grounds, so it reads the same over Night and Lab. */
export default function Nav() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:rounded-full focus:bg-z focus:px-4 focus:py-2 focus:text-white">
        Skip to content
      </a>
      <div className="mx-auto flex max-w-[1180px] items-center justify-between gap-3 rounded-full border border-night-line bg-night/75 py-2 pl-3 pr-2 text-lab shadow-[0_8px_30px_rgba(5,10,25,0.35)] backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Logo className="h-8 w-8" />
          <span className="heading text-[17px]">Dum-E</span>
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-1 sm:flex">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className={`rounded-full px-4 py-2 text-[15px] transition-colors ${path === l.href ? "bg-night-2 text-lab" : "text-mist hover:text-lab"}`}>
              {l.label}
            </Link>
          ))}
          <Link href="/waitlist" className="ml-1 rounded-full bg-z px-5 py-2 text-[15px] font-medium text-white transition-colors hover:bg-z-deep">
            Join the waitlist
          </Link>
        </nav>
        <button type="button" className="rounded-full px-4 py-2 text-[15px] text-mist sm:hidden" aria-expanded={open} aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Menu"}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav id="mobile-menu" aria-label="Primary" key="m"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}
            className="mx-auto mt-2 flex max-w-[1180px] flex-col gap-1 rounded-3xl border border-night-line bg-night/95 p-2 text-lab backdrop-blur-md sm:hidden">
            {[...LINKS, { href: "/waitlist", label: "Join the waitlist" }].map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-[16px] hover:bg-night-2">{l.label}</Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
