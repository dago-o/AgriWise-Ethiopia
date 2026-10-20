import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/useAuth.js";
import { BrandMark } from "./BrandMark.jsx";
import { ButtonLink } from "../ui/Button.jsx";

const links = [
  { href: "/#features", label: "What it does" },
  { href: "/#how-it-works", label: "How it works" },
];

export function PublicHeader({ overlay = false }) {
  const { isAuthenticated, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const dashboardPath = isAdmin ? "/admin" : "/app";

  return (
    <header className={overlay ? "absolute inset-x-0 top-0 z-30" : "border-b border-ivory-200 bg-white/90 backdrop-blur"}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <BrandMark tone={overlay ? "light" : "dark"} />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {links.map((l) => (
            <a key={l.href} href={l.href} className={`text-sm font-medium ${overlay ? "text-white/80 hover:text-white" : "text-ink-muted hover:text-forest-700"}`}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <ButtonLink to={dashboardPath} size="sm" variant={overlay ? "accent" : "primary"}>Open dashboard</ButtonLink>
          ) : (
            <>
              <ButtonLink to="/login" size="sm" variant={overlay ? "onDark" : "ghost"}>Sign in</ButtonLink>
              <ButtonLink to="/register" size="sm" variant="accent">Get started</ButtonLink>
            </>
          )}
        </div>
        <button
          type="button"
          className={`grid h-10 w-10 place-items-center rounded-lg md:hidden ${overlay ? "text-white hover:bg-white/10" : "text-forest-900 hover:bg-forest-50"}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="mx-4 mb-4 rounded-2xl bg-white p-4 text-ink shadow-[var(--shadow-pop)] md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 font-medium hover:bg-ivory-100">{l.label}</a>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-ivory-200 pt-4">
              {isAuthenticated ? (
                <Link to={dashboardPath} className="col-span-2 rounded-lg bg-forest-700 py-3 text-center font-medium text-white">Open dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="rounded-lg border border-ivory-300 py-3 text-center font-medium">Sign in</Link>
                  <Link to="/register" className="rounded-lg bg-forest-700 py-3 text-center font-medium text-white">Get started</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
