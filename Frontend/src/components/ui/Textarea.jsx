import { useId } from "react";

export function Textarea({ label, id, error, hint, className = "", ...props }) {
  const autoId = useId();
  const areaId = id || props.name || autoId;
  const describedBy = error ? `${areaId}-error` : hint ? `${areaId}-hint` : undefined;
  return (
    <div className="block space-y-1.5">
      {label ? (
        <label htmlFor={areaId} className="text-sm font-medium text-ink">
          {label}
          {props.required ? <span className="ml-0.5 text-red-600" aria-hidden="true">*</span> : null}
        </label>
      ) : null}
      <textarea
        id={areaId}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`min-h-24 w-full resize-y rounded-lg border bg-white px-3 py-2 text-ink shadow-sm placeholder:text-ink-soft focus:border-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-100 ${error ? "border-red-400" : "border-ivory-300"} ${className}`}
        {...props}
      />
      {error ? <p id={`${areaId}-error`} className="text-xs text-red-600" role="alert">{error}</p> : hint ? <p id={`${areaId}-hint`} className="text-xs text-ink-soft">{hint}</p> : null}
    </div>
  );
}
