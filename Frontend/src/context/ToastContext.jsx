import { useCallback, useMemo, useRef, useState } from "react";
import { CheckCircle2, CircleAlert, X } from "lucide-react";
import { ToastContext } from "./toastContext.js";

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);
  const push = useCallback(
    (tone, message) => {
      const id = ++idRef.current;
      setToasts((list) => [...list, { id, tone, message }]);
      setTimeout(() => dismiss(id), 4500);
    },
    [dismiss],
  );
  const api = useMemo(() => ({ success: (m) => push("success", m), error: (m) => push("error", m) }), [push]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl bg-forest-950 px-4 py-3 text-sm text-white shadow-[var(--shadow-pop)]">
            {t.tone === "success" ? (
              <CheckCircle2 className="mt-0.5 h-[18px] w-[18px] shrink-0 text-forest-300" />
            ) : (
              <CircleAlert className="mt-0.5 h-[18px] w-[18px] shrink-0 text-harvest-400" />
            )}
            <p className="flex-1">{t.message}</p>
            <button type="button" onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-white/60 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
