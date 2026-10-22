import { getToken } from "./authSession.js";

const configuredBase = import.meta.env.VITE_API_BASE_URL || "/api";
export const API_BASE_URL = configuredBase.replace(/\/+$/, "");
const PROXIED = API_BASE_URL.startsWith("/");
const DEFAULT_TIMEOUT_MS = 20000;

let onUnauthorized = null;
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

/**
 * Every failure is an ApiError with a `kind`:
 *  network | unreachable  server cannot be reached (down, wrong port, or a browser CORS block)
 *  timeout                no answer in time
 *  auth                   token missing / invalid / expired  -> session must end
 *  forbidden              signed in, but the role may not do this (does NOT end the session)
 *  http                   the backend answered with an error and a `message`
 *  parse                  the answer was not the expected JSON
 */
export class ApiError extends Error {
  constructor(kind, message, { status = null, data = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    this.data = data;
    this.network = kind === "network" || kind === "unreachable";
  }
}

function describeNetworkFailure() {
  if (PROXIED) {
    return "Cannot reach the AgriWise server. Check that the backend is running and that VITE_PROXY_TARGET in .env matches its PORT.";
  }
  return `Cannot reach the AgriWise server at ${API_BASE_URL}. It is either not running, or the browser blocked the request because the backend sends no CORS headers. Use the default VITE_API_BASE_URL=/api (Vite proxy), or enable CORS in the backend.`;
}

// The backend forwards raw upstream error text (Open-Meteo / Gemini) as its message.
function friendlyServerMessage(message) {
  if (!message) return message;
  if (/^fetch failed$/i.test(message.trim())) {
    return "The server could not reach an outside service (weather or AI). Check the server's internet connection and try again.";
  }
  if (/api key/i.test(message) && /gemini|api_key|not valid|should be set|configured/i.test(message)) {
    return "The AI service is not set up correctly on the server. Ask the administrator to check GEMINI_API_KEY.";
  }
  return message;
}

function parseJson(raw) {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  const { signal, timeoutMs = DEFAULT_TIMEOUT_MS, auth = true, body, method = "GET" } = options;
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = auth ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  const url = `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;

  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const abortFromCaller = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener("abort", abortFromCaller, { once: true });
  }

  let response;
  try {
    response = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    if (timedOut) throw new ApiError("timeout", "The server took too long to respond. Please try again.");
    if (signal?.aborted) throw err; // cancelled on purpose (unmount / newer request)
    throw new ApiError("network", describeNetworkFailure());
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abortFromCaller);
  }

  const raw = await response.text();
  const data = parseJson(raw);
  const message = data && typeof data.message === "string" ? data.message : null;

  if (response.ok) {
    if (data === null) throw new ApiError("parse", "The server sent an unexpected (non-JSON) response.", { status: response.status });
    return data;
  }

  // Vite proxy with the backend switched off answers 5xx with an empty body.
  if (response.status >= 500 && !message && PROXIED) {
    throw new ApiError("unreachable", describeNetworkFailure(), { status: response.status });
  }

  const tokenRejected =
    response.status === 401 || (response.status === 403 && /invalid or expired token/i.test(message || ""));
  if (tokenRejected) {
    const error = new ApiError("auth", message || "Your session has ended. Please sign in again.", { status: response.status, data });
    // Login uses auth:false: a wrong password must not look like an expired session.
    if (auth && token && onUnauthorized) onUnauthorized(error);
    throw error;
  }

  if (response.status === 403) {
    throw new ApiError("forbidden", message || "You do not have permission to do that.", { status: 403, data });
  }

  if (data === null) {
    const hint = /Cannot (GET|POST|PUT|DELETE)/.exec(raw)?.[0];
    throw new ApiError("http", hint ? `The server has no route for this request (${hint}).` : `Unexpected server response (${response.status}).`, { status: response.status });
  }

  throw new ApiError("http", friendlyServerMessage(message) || `Request failed (${response.status}).`, { status: response.status, data });
}

export const apiGet = (path, options) => apiRequest(path, { ...options });
export const apiPost = (path, body, options) => apiRequest(path, { ...options, method: "POST", body: body ?? {} });
export const apiPut = (path, body, options) => apiRequest(path, { ...options, method: "PUT", body: body ?? {} });
export const apiPatch = (path, body, options) => apiRequest(path, { ...options, method: "PATCH", body: body ?? {} });
export const apiDelete = (path, options) => apiRequest(path, { ...options, method: "DELETE" });

/** Any HTTP answer (even a 404) proves the server is reachable. */
export async function pingBackend(signal) {
  try {
    const res = await fetch(`${API_BASE_URL}/__ping`, { signal, headers: { Accept: "application/json" } });
    if (res.status >= 500 && PROXIED && !(await res.text())) return { ok: false, reason: describeNetworkFailure() };
    return { ok: true };
  } catch (err) {
    if (signal?.aborted) throw err;
    return { ok: false, reason: describeNetworkFailure() };
  }
}

/** Reads an array from `payload[key]`. Fails loudly if the backend response shape changed. */
export function unwrapList(payload, keys = []) {
  if (Array.isArray(payload)) return payload;
  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }
  throw new ApiError("parse", "The server returned data in an unexpected shape.");
}

/** Reads an object from `payload[key]`. */
export function unwrapEntity(payload, key) {
  const value = payload?.[key];
  if (value === undefined || value === null) {
    throw new ApiError("parse", "The server returned data in an unexpected shape.");
  }
  return value;
}
