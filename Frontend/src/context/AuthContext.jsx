import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./authContext.js";
import { setUnauthorizedHandler } from "../lib/apiClient.js";
import { clearSession, getTokenExpiry, loadValidSession, saveSession } from "../lib/authSession.js";
import * as api from "../lib/endpoints.js";

const EXPIRED = "Your session has expired. Please sign in again.";

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadValidSession);
  const [notice, setNotice] = useState("");

  const endSession = useCallback((message = "") => {
    clearSession();
    setSession({ token: null, user: null });
    setNotice(message);
  }, []);

  // The API client reports "token invalid / expired" here.
  useEffect(() => {
    setUnauthorizedHandler(() => endSession(EXPIRED));
    return () => setUnauthorizedHandler(null);
  }, [endSession]);

  // Sign out politely when the token's own expiry passes (the server remains authoritative).
  useEffect(() => {
    if (!session.token) return undefined;
    const exp = getTokenExpiry(session.token);
    if (!exp) return undefined;
    const delay = Math.max(0, Math.min(exp - Date.now(), 2 ** 31 - 1));
    const timer = setTimeout(() => endSession(EXPIRED), delay);
    return () => clearTimeout(timer);
  }, [session.token, endSession]);

  const login = useCallback(async (credentials) => {
    const { token, user } = await api.login(credentials);
    if (!token || !user) throw new Error("The server's login response did not include a token.");
    saveSession(token, user);
    setSession({ token, user });
    setNotice("");
    return user;
  }, []);

  /** Registers, then signs in (the backend does not return a token on registration). */
  const register = useCallback(
    async (details) => {
      await api.register(details);
      return login({ email: details.email, password: details.password });
    },
    [login],
  );

  const logout = useCallback(() => endSession(""), [endSession]);
  const clearNotice = useCallback(() => setNotice(""), []);

  const value = useMemo(
    () => ({
      user: session.user,
      token: session.token,
      isAuthenticated: Boolean(session.token && session.user),
      isAdmin: session.user?.role === "admin",
      isFarmer: session.user?.role === "farmer",
      notice,
      login,
      register,
      logout,
      clearNotice,
    }),
    [session, notice, login, register, logout, clearNotice],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
