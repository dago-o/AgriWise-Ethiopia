import { useState } from "react";
import { Modal } from "./Modal.jsx";
import { Button } from "./Button.jsx";
import { Alert } from "../feedback/Alert.jsx";
import { getErrorMessage } from "../../lib/errorHandling.js";

export function ConfirmDialog({ open, onClose, title, message, confirmLabel = "Delete", onConfirm }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setBusy(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={busy ? () => {} : onClose} title={title} size="sm">
      <div className="text-sm text-ink-muted">{message}</div>
      {error ? <div className="mt-3"><Alert>{error}</Alert></div> : null}
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={busy}>Cancel</Button>
        <Button variant="danger" onClick={handleConfirm} loading={busy}>{confirmLabel}</Button>
      </div>
    </Modal>
  );
}
