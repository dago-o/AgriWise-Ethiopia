import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import { Button } from "../components/ui/Button.jsx";
import { LogoMark } from "../components/layout/BrandMark.jsx";

function homeFor(user) {
  if (user?.role === "admin") return "/admin";
  if (user?.role === "farmer") return "/app";
  return null;
}

function UnknownRole() {
  const { user, logout } = useAuth();
  return (
    <div className="grid min-h-dvh place-items-center px-6">
      <div className="max-w-md text-center">
        <LogoMark className="mx-auto h-12 w-12" />
        <h1 className="mt-5 text-2xl font-bold text-forest-900">This account has no valid role</h1>
        <p className="mt-2 text-ink-muted">
          The account <strong>{user?.email}</strong> has the role “{String(user?.role)}”, which AgriWise does not recognise. Sign out and contact an administrator.
        </p>
        <Button className="mt-6" onClick={logout}>Sign out</Button>
      </div>
    </div>
  );
}

function RequireRole({ role, children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  const home = homeFor(user);
  if (!home) return <UnknownRole />;
  if (user.role !== role) return <Navigate to={home} replace />; // never silently upgraded
  return children;
}

export function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

export const RequireFarmer = ({ children }) => <RequireRole role="farmer">{children}</RequireRole>;
export const RequireAdmin = ({ children }) => <RequireRole role="admin">{children}</RequireRole>;

/** Login / register: signed-in users go straight to their own area. */
export function GuestOnly({ children }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return children;
  const home = homeFor(user);
  return home ? <Navigate to={home} replace /> : <UnknownRole />;
}
