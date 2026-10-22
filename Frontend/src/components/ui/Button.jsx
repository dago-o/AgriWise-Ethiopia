import { Link } from "react-router-dom";
import { Spinner } from "./Spinner.jsx";

const variants = {
  primary: "bg-forest-700 text-white hover:bg-forest-800 active:bg-forest-900",
  secondary: "bg-white text-forest-800 border border-forest-200 hover:bg-forest-50",
  danger: "bg-red-700 text-white hover:bg-red-800",
  dangerGhost: "bg-transparent text-red-700 hover:bg-red-50",
  ghost: "bg-transparent text-forest-700 hover:bg-forest-50",
  accent: "bg-harvest-500 text-forest-950 hover:bg-harvest-400",
  onDark: "bg-white/10 text-white border border-white/30 hover:bg-white/20",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

function classes(variant, size, className) {
  return `inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:pointer-events-none disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`;
}

export function Button({ variant = "primary", size = "md", className = "", type = "button", loading = false, disabled, children, ...props }) {
  return (
    <button type={type} disabled={disabled || loading} className={classes(variant, size, className)} {...props}>
      {loading ? <Spinner className="h-4 w-4 text-current" /> : null}
      {children}
    </button>
  );
}

/** A real link that looks like a button (avoids putting a <button> inside an <a>). */
export function ButtonLink({ variant = "primary", size = "md", className = "", children, ...props }) {
  return (
    <Link className={classes(variant, size, className)} {...props}>
      {children}
    </Link>
  );
}
