import { useCallback, useEffect, useEffectEvent, useState } from "react";

/**
 * Loads data and re-loads when `deps` change or `reload()` is called.
 *
 *   const { data, error, loading, reload } = useAsync((signal) => fetchFarms({ signal }), []);
 *
 * - `deps` must be a list of primitives (ids, filters).
 * - Old requests are cancelled, so a slow answer can never overwrite a newer one.
 * - While reloading after a change, the previous `data` stays visible.
 * - `{ enabled: false }` (or `{ immediate: false }`) skips loading.
 */
export function useAsync(fn, deps = [], { enabled = true, immediate = true } = {}) {
  const active = enabled && immediate;
  const [nonce, setNonce] = useState(0);
  const depsKey = JSON.stringify(deps);
  const [state, setState] = useState({ depsKey: null, nonce: -1, data: null, error: null });
  const run = useEffectEvent((signal) => fn(signal));

  useEffect(() => {
    if (!active) return undefined;
    const controller = new AbortController();
    run(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setState({ depsKey, nonce, data, error: null });
      })
      .catch((error) => {
        if (controller.signal.aborted || error?.name === "AbortError") return;
        setState({ depsKey, nonce, data: null, error });
      });
    return () => controller.abort();
  }, [depsKey, nonce, active]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  const setData = useCallback((updater) => {
    setState((s) => ({ ...s, data: typeof updater === "function" ? updater(s.data) : updater }));
  }, []);

  const sameDeps = state.depsKey === depsKey;
  const settled = sameDeps && state.nonce === nonce;
  return {
    data: sameDeps ? state.data : null,
    error: sameDeps ? state.error : null,
    loading: active && !settled,
    reload,
    run: reload,
    setData,
  };
}
