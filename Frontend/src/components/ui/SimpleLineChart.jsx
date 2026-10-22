import { formatDate, formatNumber } from "../../lib/formatters.js";

const COLORS = ["#256845", "#c4922a", "#5aa07a", "#b91c1c", "#6f5017", "#16402a"];

/**
 * Dependency-free SVG line chart.
 * `points`: [{ date: "YYYY-MM-DD", series: "Market A", value: 123 }] — only real recorded points are drawn.
 */
export function SimpleLineChart({ points, unit }) {
  const W = 640;
  const H = 260;
  const m = { l: 52, r: 16, t: 14, b: 30 };
  const series = [...new Set(points.map((p) => p.series))];
  const times = points.map((p) => new Date(p.date).getTime());
  const values = points.map((p) => p.value);
  const tMin = Math.min(...times);
  const tMax = Math.max(...times);
  const vMax = Math.max(...values) * 1.08 || 1;
  const vMin = Math.max(0, Math.min(...values) * 0.9);
  const x = (t) => m.l + (tMax === tMin ? (W - m.l - m.r) / 2 : ((t - tMin) / (tMax - tMin)) * (W - m.l - m.r));
  const y = (v) => H - m.b - ((v - vMin) / (vMax - vMin || 1)) * (H - m.t - m.b);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => vMin + f * (vMax - vMin));
  const dateTicks = [...new Set([tMin, tMax])];

  return (
    <figure>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Line chart of recorded prices over time${unit ? `, per ${unit}` : ""}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={m.l} x2={W - m.r} y1={y(t)} y2={y(t)} stroke="#e8e2d4" />
            <text x={m.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill="#6b766f">{formatNumber(Math.round(t))}</text>
          </g>
        ))}
        {dateTicks.map((t) => (
          <text key={t} x={x(t)} y={H - 8} textAnchor={t === tMin && tMax !== tMin ? "start" : t === tMax && tMax !== tMin ? "end" : "middle"} fontSize="11" fill="#6b766f">{formatDate(t)}</text>
        ))}
        {series.map((s, i) => {
          const pts = points.filter((p) => p.series === s).sort((a, b) => a.date.localeCompare(b.date));
          const d = pts.map((p, idx) => `${idx ? "L" : "M"} ${x(new Date(p.date).getTime()).toFixed(1)} ${y(p.value).toFixed(1)}`).join(" ");
          return (
            <g key={s} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]}>
              <path d={d} fill="none" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              {pts.map((p) => (
                <circle key={p.date} cx={x(new Date(p.date).getTime())} cy={y(p.value)} r="3.5" stroke="none">
                  <title>{`${s}: ${formatNumber(p.value)} on ${formatDate(p.date)}`}</title>
                </circle>
              ))}
            </g>
          );
        })}
      </svg>
      {series.length > 1 ? (
        <figcaption className="mt-2 flex flex-wrap gap-4 text-sm text-ink-muted">
          {series.map((s, i) => (
            <span key={s} className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              {s}
            </span>
          ))}
        </figcaption>
      ) : null}
    </figure>
  );
}
