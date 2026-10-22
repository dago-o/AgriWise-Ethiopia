export function DefinitionList({ items }) {
  return (
    <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-sm text-ink-muted">{item.label}</dt>
          <dd className="mt-0.5 font-medium text-ink">{item.value ?? "—"}</dd>
        </div>
      ))}
    </dl>
  );
}
