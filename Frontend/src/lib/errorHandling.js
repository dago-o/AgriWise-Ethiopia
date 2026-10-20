export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;
  if (typeof error.message === "string" && error.message) return error.message;
  return fallback;
}

/** The session is over (token missing/expired). A 403 for "wrong role" is NOT an auth error. */
export function isAuthError(error) {
  return error?.kind === "auth";
}

export function isForbidden(error) {
  return error?.kind === "forbidden";
}
