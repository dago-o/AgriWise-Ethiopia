/** One surface with dividers instead of N separate KPI cards. */
export function StatRow({ stats }) {
  return (
    <dl className="grid overflow-hidden rounded-[var(--radius-card)] border border-ivory-200 bg-white shadow-[var(--shadow-card)] sm:grid-cols-2 lg:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]" style={{ "--cols": stats.length }}>
      {stats.map((s) => (
        <div key={s.label} className="border-b border-ivory-200 px-5 py-4 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:border-r lg:[&:nth-child(2n)]:border-r lg:last:border-r-0">
          <dt className="text-sm text-ink-muted">{s.label}</dt>
          <dd className={`mt-1 font-display text-2xl font-bold ${s.tone === "good" ? "text-emerald-700" : s.tone === "bad" ? "text-red-700" : "text-forest-900"}`}>{s.value}</dd>
          {s.hint ? <p className="mt-0.5 text-xs text-ink-soft">{s.hint}</p> : null}
        </div>
      ))}
    </dl>
  );
}
