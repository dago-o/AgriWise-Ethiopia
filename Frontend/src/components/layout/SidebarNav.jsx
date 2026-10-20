import { NavLink, useLocation } from "react-router-dom";
import { BarChart3, BookOpen, Bot, CloudSun, Home, LogOut, Shield, Store, Tractor } from "lucide-react";
import { useAuth } from "../../context/useAuth.js";
import { BrandMark } from "./BrandMark.jsx";

// `also`: other path prefixes that should keep this item highlighted (e.g. crop pages belong to Farms).
const farmerGroups = [
  {
    title: "Farm",
    links: [
      { to: "/app", end: true, label: "Dashboard", icon: Home },
      { to: "/app/farms", label: "Farms & crops", icon: Tractor, also: ["/app/crops"] },
      { to: "/app/weather", label: "Weather", icon: CloudSun },
    ],
  },
  {
    title: "Insight",
    links: [
      { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
      { to: "/app/market", label: "Market prices", icon: Store },
    ],
  },
  {
    title: "Learn & ask",
    links: [
      { to: "/app/resources", label: "Learning", icon: BookOpen },
      { to: "/app/ai", label: "AI assistant", icon: Bot },
    ],
  },
];

const adminGroups = [
  { title: "Oversight", links: [{ to: "/admin", end: true, label: "Overview", icon: Shield }] },
  {
    title: "Manage",
    links: [
      { to: "/admin/resources", label: "Resources", icon: BookOpen },
      { to: "/admin/market", label: "Market prices", icon: Store },
    ],
  },
];

export function SidebarNav({ onNavigate }) {
  const { user, logout, isAdmin } = useAuth();
  const { pathname } = useLocation();
  const groups = isAdmin ? adminGroups : farmerGroups;

  return (
    <aside className="flex h-full flex-col bg-forest-900 text-white">
      <div className="border-b border-forest-800 px-4 py-5">
        <BrandMark to={isAdmin ? "/admin" : "/app"} tone="light" subtitle={isAdmin ? "Admin console" : "Farmer workspace"} />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label={isAdmin ? "Admin" : "Farmer"}>
        {groups.map((group) => (
          <div key={group.title} className="mb-4">
            <p className="px-3 pb-1.5 text-xs font-semibold text-forest-300">{group.title}</p>
            <ul className="space-y-0.5">
              {group.links.map(({ to, label, icon: Icon, end, also = [] }) => {
                const forced = also.some((prefix) => pathname.startsWith(prefix));
                return (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={end}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          isActive || forced ? "bg-forest-700 text-white" : "text-forest-100/90 hover:bg-forest-800 hover:text-white"
                        }`
                      }
                    >
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {label}
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-forest-800 p-4">
        <p className="truncate text-sm font-medium">{user?.name}</p>
        <p className="truncate text-xs text-forest-200">{user?.email}</p>
        <button type="button" onClick={logout} className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-forest-100/90 hover:bg-forest-800">
          <LogOut className="h-4 w-4" aria-hidden="true" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
