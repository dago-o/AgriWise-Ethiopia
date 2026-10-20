import { Alert } from "../feedback/Alert.jsx";
import { Button } from "./Button.jsx";

export function FormFooter({ busy, error, onCancel, submitLabel = "Save" }) {
  return (
    <div className="mt-6 space-y-4">
      {error ? <Alert>{error}</Alert> : null}
      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
        <Button type="submit" loading={busy}>{submitLabel}</Button>
      </div>
    </div>
  );
}
