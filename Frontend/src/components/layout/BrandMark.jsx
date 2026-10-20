import { Link } from "react-router-dom";

export function LogoMark({ className = "h-9 w-9" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <rect width="64" height="64" rx="16" fill="#16402a" />
      <path d="M10 44c10-6 18-6 22-6s12 0 22 6v6H10z" fill="#2d8054" />
      <path d="M10 36c10-6 18-6 22-6s12 0 22 6" fill="none" stroke="#8fc2a4" strokeWidth="3" strokeLinecap="round" />
      <path d="M14 28c9-5 15-5 18-5s9 0 18 5" fill="none" stroke="#d4a843" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="14" r="5" fill="#d4a843" />
    </svg>
  );
}

export function BrandMark({ to = "/", tone = "dark", subtitle }) {
  const light = tone === "light";
  return (
    <Link to={to} className="inline-flex items-center gap-2.5 rounded-lg" aria-label="AgriWise-Ethiopia home">
      <LogoMark />
      <span className="leading-tight">
        <span className={`block font-display text-lg font-bold tracking-tight ${light ? "text-white" : "text-forest-900"}`}>
          AgriWise<span className={light ? "text-forest-300" : "text-forest-500"}>-Ethiopia</span>
        </span>
        {subtitle ? <span className={`block text-xs ${light ? "text-forest-200" : "text-ink-soft"}`}>{subtitle}</span> : null}
      </span>
    </Link>
  );
}
