import { useState } from "react";
import { getErrorMessage } from "../lib/errorHandling.js";

/** Wraps an async save action with busy + error state. Returns true on success. */
export function useSubmit(action) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event?.preventDefault?.();
    setBusy(true);
    setError("");
    try {
      await action();
      return true;
    } catch (err) {
      setError(getErrorMessage(err));
      return false;
    } finally {
      setBusy(false);
    }
  }

  return { busy, error, submit };
}
