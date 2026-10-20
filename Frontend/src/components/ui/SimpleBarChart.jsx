/** Dependency-free horizontal bar chart. Zero stays zero (no fake minimum bar). */
export function SimpleBarChart({ items, labelKey = "label", valueKey = "value", className = "", format = (v) => v, color = "bg-forest-600" }) {
  if (!items?.length) return null;
  const max = Math.max(...items.map((i) => Number(i[valueKey]) || 0), 1);

  return (
    <ul className={`space-y-3 ${className}`}>
      {items.map((item) => {
        const value = Number(item[valueKey]) || 0;
        const width = `${(value / max) * 100}%`;
        return (
          <li key={item[labelKey]}>
            <div className="mb-1 flex justify-between gap-3 text-sm">
              <span className="text-ink-muted">{item[labelKey]}</span>
              <span className="font-medium text-ink">{format(value)}</span>
            </div>
            <div className="h-2.5 rounded-full bg-forest-50" role="img" aria-label={`${item[labelKey]}: ${format(value)}`}>
              <div className={`h-2.5 rounded-full transition-[width] ${color}`} style={{ width }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
