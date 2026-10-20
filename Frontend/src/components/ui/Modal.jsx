import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const widths = { sm: "w-[min(92vw,26rem)]", md: "w-[min(92vw,34rem)]", lg: "w-[min(94vw,46rem)]" };

/** Accessible modal on the native <dialog>: focus trap, Esc to close, focus restored on close. */
export function Modal({ open, onClose, title, description, size = "md", children }) {
  const ref = useRef(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="modal-title"
      className={`dialog-in m-auto max-h-[90vh] overflow-hidden rounded-2xl bg-white p-0 text-ink shadow-[var(--shadow-pop)] ${widths[size]}`}
    >
      {open ? (
        <div className="flex max-h-[90vh] flex-col">
          <div className="flex items-start justify-between gap-4 border-b border-ivory-200 px-6 py-4">
            <div>
              <h2 id="modal-title" className="text-lg font-semibold text-forest-900">{title}</h2>
              {description ? <p className="mt-0.5 text-sm text-ink-muted">{description}</p> : null}
            </div>
            <button type="button" onClick={onClose} aria-label="Close dialog" className="-mr-2 grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink-soft hover:bg-ivory-100">
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-5">{children}</div>
        </div>
      ) : null}
    </dialog>
  );
}
