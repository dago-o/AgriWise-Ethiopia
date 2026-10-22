export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ivory-300 bg-white/60 px-6 py-12 text-center">
      {Icon ? <Icon className="mb-3 h-10 w-10 text-forest-500" aria-hidden="true" /> : null}
      <h3 className="text-lg font-semibold text-forest-900">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm text-ink-muted">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
