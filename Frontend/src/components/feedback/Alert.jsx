const styles = {
  error: "border-red-200 bg-red-50 text-red-900",
  warning: "border-harvest-400/50 bg-harvest-50 text-harvest-700",
  info: "border-forest-200 bg-forest-50 text-forest-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

export function Alert({ variant = "error", title, children, onRetry, className = "" }) {
  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[variant]} ${className}`} role={variant === "error" ? "alert" : "status"}>
      {title ? <p className="font-semibold">{title}</p> : null}
      {children ? <div className={title ? "mt-1" : ""}>{children}</div> : null}
      {onRetry ? (
        <button type="button" onClick={onRetry} className="mt-2 font-medium underline underline-offset-2">
          Try again
        </button>
      ) : null}
    </div>
  );
}
