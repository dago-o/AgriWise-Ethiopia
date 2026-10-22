const tones = {
  default: "bg-forest-50 text-forest-800 ring-forest-200",
  neutral: "bg-ivory-100 text-ink-muted ring-ivory-300",
  warning: "bg-harvest-50 text-harvest-700 ring-harvest-400/40",
  danger: "bg-red-50 text-red-700 ring-red-200",
  success: "bg-emerald-50 text-emerald-800 ring-emerald-200",
};

export function Badge({ children, tone = "default", className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${tones[tone] ?? tones.default} ${className}`}>
      {children}
    </span>
  );
}
