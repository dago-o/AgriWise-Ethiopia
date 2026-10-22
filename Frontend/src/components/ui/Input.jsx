import { useId } from "react";

export function Input({ label, id, error, hint, className = "", ...props }) {
  const autoId = useId();
  const inputId = id || props.name || autoId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;
  return (
    <div className="block space-y-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
          {props.required ? <span className="ml-0.5 text-red-600" aria-hidden="true">*</span> : null}
        </label>
      ) : null}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-ink shadow-sm placeholder:text-ink-soft focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100 disabled:bg-ivory-100 ${error ? "border-red-400" : "border-ivory-300"} ${className}`}
        {...props}
      />
      {error ? <p id={`${inputId}-error`} className="text-xs text-red-600" role="alert">{error}</p> : hint ? <p id={`${inputId}-hint`} className="text-xs text-ink-soft">{hint}</p> : null}
    </div>
  );
}
