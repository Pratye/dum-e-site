"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

const ACCENT = "var(--color-z)";
const QUERY = "(prefers-reduced-motion: reduce)";

// An external system (the OS setting), so read it with useSyncExternalStore rather than copying it into state.
const subscribe = (cb: () => void) => {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/**
 * A muted looping clip that loads and plays only while it is on screen. With preload="none" the browser
 * fetches nothing but the poster until the clip scrolls into view; with reduced motion requested it never
 * autoplays and shows native controls instead.
 */
export default function LazyVideo({
  src, poster, aspect, label, tag,
}: { src: string; poster: string; aspect: string; label: string; tag?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduced = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); },
      { threshold: 0.35 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: aspect, background: "#0d1a3a", border: "1px solid var(--color-night-line)" }}>
      <video
        ref={ref}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        controls={reduced}
        disablePictureInPicture
        aria-label={label}
        className="h-full w-full object-cover"
      />
      {tag && (
        <span
          className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-medium"
          style={{ background: "rgba(10,21,48,0.72)", color: "var(--color-mist)", border: "1px solid var(--color-night-line)" }}
        >
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: ACCENT }} />
          {tag}
        </span>
      )}
    </div>
  );
}
