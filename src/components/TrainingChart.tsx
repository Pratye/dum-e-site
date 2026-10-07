import curve from "@/data/training_curve.json";

const ORANGE = "#4C7DFF";            // terrain stage, brand Z blue
const FG = "#EEF1EC";
const MUTED = "#8A96AD";
const GRID = "rgba(176,196,255,0.12)";

type Segment = { label: string; stage: string; start_M: number; points: number[][] };

/** Mean time the robots stay upright during evaluation, against training steps. Episodes are capped at 20 s. */
export default function TrainingChart() {
  const W = 820, H = 400, L = 62, R = 18, T = 24, B = 66;
  const cap = curve.episode_cap_s;
  const segments = curve.segments as Segment[];
  const maxX = Math.max(...segments.flatMap((s) => s.points.map((p) => p[0])));
  const x = (v: number) => L + (v / (Math.ceil(maxX / 50) * 50)) * (W - L - R);
  const y = (v: number) => T + (1 - v / cap) * (H - T - B);
  const xMax = Math.ceil(maxX / 50) * 50;
  const split = x(curve.terrain_starts_M);
  const path = (pts: number[][]) => pts.map((p, i) => `${i ? "L" : "M"}${x(p[0]).toFixed(1)},${y(p[1]).toFixed(1)}`).join(" ");
  // join consecutive segments of one stage into a single polyline so a restart does not draw a gap
  const stages = ["flat", "terrain"].map((st) => segments.filter((s) => s.stage === st).flatMap((s) => s.points));

  return (
    <figure className="w-full">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-label={`Mean time upright during evaluation rises from under one second to about eighteen seconds on flat ground over ${curve.terrain_starts_M} million training steps, then settles near fourteen seconds on the harder terrain mix.`}
        className="w-full h-auto"
      >
        <rect x={split} y={T} width={W - R - split} height={H - T - B} fill="rgba(76,125,255,0.07)" />
        {[0, 5, 10, 15, 20].map((v) => (
          <g key={v}>
            <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke={GRID} />
            <text x={L - 10} y={y(v) + 4} textAnchor="end" fontSize="17" fill={MUTED}>{v}</text>
          </g>
        ))}
        {Array.from({ length: xMax / 50 + 1 }, (_, i) => i * 50).map((v) => (
          <g key={v}>
            <line x1={x(v)} x2={x(v)} y1={T} y2={H - B} stroke={GRID} strokeDasharray={v === 0 ? undefined : "2 4"} />
            <text x={x(v)} y={H - B + 24} textAnchor="middle" fontSize="17" fill={MUTED}>{v}</text>
          </g>
        ))}
        <line x1={split} x2={split} y1={T} y2={H - B} stroke={ORANGE} strokeOpacity="0.55" strokeDasharray="5 4" />
        <text x={L + 10} y={T + 20} fontSize="15" fill={FG} >Flat ground</text>
        <text x={split + 10} y={T + 20} fontSize="15" fill={ORANGE} >Terrain: stairs and ramps</text>
        <path d={path(stages[0])} fill="none" stroke={FG} strokeWidth="3" strokeLinejoin="round" />
        <path d={path(stages[1])} fill="none" stroke={ORANGE} strokeWidth="3" strokeLinejoin="round" />
        {stages.flatMap((pts, k) => pts.map((p, i) => (
          <circle key={`${k}-${i}`} cx={x(p[0])} cy={y(p[1])} r="3.2" fill={k ? ORANGE : FG} />
        )))}
        <text x={(L + W - R) / 2} y={H - 10} textAnchor="middle" fontSize="17" fill={MUTED}>Training steps (millions)</text>
        <text x={16} y={(T + H - B) / 2} textAnchor="middle" fontSize="17" fill={MUTED} transform={`rotate(-90 16 ${(T + H - B) / 2})`}>
          Mean time upright (s)
        </text>
      </svg>
      <figcaption className="mt-3 text-xs leading-relaxed" style={{ color: MUTED }}>
        Mean over evaluation robots; episodes end at 20 s. The terrain stage is a harder test (stairs and ramps on a share of the robots, including
        stairs the policy cannot yet climb), so the line steps down where it begins. Segments are chained by the checkpoint each run resumed from;
        step counts are approximate to one evaluation interval.
      </figcaption>
    </figure>
  );
}
