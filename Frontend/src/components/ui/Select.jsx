import { useId } from "react";

export function Select({ label, id, error, hint, children, className = "", ...props }) {
  const autoId = useId();
  const selectId = id || props.name || autoId;
  const describedBy = error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined;
  return (
    <div className="block space-y-1.5">
      {label ? (
        <label htmlFor={selectId} className="text-sm font-medium text-ink">
          {label}
          {props.required ? <span className="ml-0.5 text-red-600" aria-hidden="true">*</span> : null}
        </label>
      ) : null}
      <select
        id={selectId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-ink shadow-sm focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100 disabled:bg-ivory-100 disabled:text-ink-soft ${error ? "border-red-400" : "border-ivory-300"} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error ? <p id={`${selectId}-error`} className="text-xs text-red-600" role="alert">{error}</p> : hint ? <p id={`${selectId}-hint`} className="text-xs text-ink-soft">{hint}</p> : null}
    </div>
  );
}
