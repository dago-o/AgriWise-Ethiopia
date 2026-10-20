export function IconButton({ label, tone = "neutral", className = "", children, ...props }) {
  const color = tone === "danger" ? "text-ink-soft hover:bg-red-50 hover:text-red-700" : "text-ink-soft hover:bg-ivory-100 hover:text-ink";
  return (
    <button type="button" aria-label={label} title={label} className={`grid h-9 w-9 place-items-center rounded-lg transition-colors ${color} ${className}`} {...props}>
      {children}
    </button>
  );
}
