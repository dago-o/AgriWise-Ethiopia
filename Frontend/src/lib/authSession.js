const TOKEN_KEY = "agriwise_token";
const USER_KEY = "agriwise_user";

/** Session stored in localStorage for persistence across reloads. Not safe against XSS — treat as convenience only. */
export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

export function saveSession(token, user) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    /* storage unavailable (private mode): the session then lasts until reload */
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    /* ignore */
  }
}

/** Reads the (unverified) `exp` claim only to sign out politely; the server stays authoritative. */
export function getTokenExpiry(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = JSON.parse(atob(payload.padEnd(Math.ceil(payload.length / 4) * 4, "=")));
    return typeof json.exp === "number" ? json.exp * 1000 : null;
  } catch {
    return null;
  }
}

/** Stored session if it exists and has not expired. */
export function loadValidSession() {
  const token = getToken();
  const user = getStoredUser();
  if (!token || !user) return { token: null, user: null };
  const exp = getTokenExpiry(token);
  if (exp && exp <= Date.now()) {
    clearSession();
    return { token: null, user: null };
  }
  return { token, user };
}

/** Login: { message, user: { token, user: { id, name, email, role } } } */
export function parseLoginResponse(data) {
  const payload = data?.user;
  if (payload?.token && payload?.user) {
    return { token: payload.token, user: payload.user };
  }
  return { token: null, user: null };
}

/** Register: { message, user: { user: { id, name, email, role } } } — no token issued */
export function parseRegisterResponse(data) {
  return { user: data?.user?.user ?? null };
}
