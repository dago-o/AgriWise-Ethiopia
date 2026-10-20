import { useId } from "react";

export function Checkbox({ label, hint, ...props }) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input id={id} type="checkbox" className="mt-1 h-4 w-4 rounded border-ivory-300 accent-forest-700" {...props} />
      <label htmlFor={id} className="text-sm text-ink">
        <span className="font-medium">{label}</span>
        {hint ? <span className="block text-ink-soft">{hint}</span> : null}
      </label>
    </div>
  );
}
