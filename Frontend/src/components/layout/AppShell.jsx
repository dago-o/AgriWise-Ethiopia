import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Outlet } from "react-router-dom";
import { SidebarNav } from "./SidebarNav.jsx";
import { BrandMark } from "./BrandMark.jsx";
import { useAuth } from "../../context/useAuth.js";

export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <div className="min-h-dvh bg-ivory-50 lg:pl-64">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-lg focus:bg-white focus:px-3 focus:py-2">
        Skip to content
      </a>

      <div className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarNav />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button type="button" className="absolute inset-0 bg-forest-950/60" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 h-full w-72 max-w-[85vw] shadow-xl">
            <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="absolute right-3 top-4 z-10 grid h-9 w-9 place-items-center rounded-lg text-white hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ivory-200 bg-white px-4 py-2.5 lg:hidden">
        <BrandMark to={isAdmin ? "/admin" : "/app"} />
        <button type="button" className="rounded-lg p-2 text-forest-800 hover:bg-forest-50" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>
      </header>

      <main id="main" className="page-container">
        <Outlet />
      </main>
    </div>
  );
}
