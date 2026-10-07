const ORANGE = "#FF6600";
const FG = "#FAFAF8";
const MUTED = "#8A8A8A";

export type Bar = { label: string; value: number; sub?: string; accent?: boolean };

/** Horizontal bars with the value printed on each, for a handful of before/after numbers. */
export default function BarCompare({ bars, unit, ariaLabel }: { bars: Bar[]; unit: string; ariaLabel: string }) {
  const max = Math.max(...bars.map((b) => b.value));
  return (
    <div role="img" aria-label={ariaLabel} className="space-y-4">
      {bars.map((b) => (
        <div key={b.label}>
          <div className="mb-1.5 flex items-baseline justify-between gap-3 text-xs">
            <span style={{ color: FG }}>{b.label}</span>
            <span className="disp" style={{ color: b.accent ? ORANGE : FG }}>{b.value} {unit}</span>
          </div>
          <div className="h-2.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${Math.max((b.value / max) * 100, 1.2)}%`, background: b.accent ? ORANGE : "rgba(250,250,248,0.55)" }}
            />
          </div>
          {b.sub && <p className="mt-1 text-[0.7rem]" style={{ color: MUTED }}>{b.sub}</p>}
        </div>
      ))}
    </div>
  );
}
