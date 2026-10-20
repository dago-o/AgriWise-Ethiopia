import { useState } from "react";
import { Modal } from "../../components/ui/Modal.jsx";
import { FormFooter } from "../../components/ui/FormFooter.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { useSubmit } from "../../hooks/useSubmit.js";
import { GROWTH_STAGES, HEALTH_STATUSES, toOptions } from "../../lib/constants.js";
import { createCropHealth, updateCropHealth } from "../../lib/endpoints.js";
import { toDateInput, todayInput } from "../../lib/formatters.js";

const statusOptions = toOptions(HEALTH_STATUSES);
const stageOptions = toOptions(GROWTH_STAGES);

function HealthForm({ cropId, record, onCancel, onSaved }) {
  const [form, setForm] = useState({
    healthStatus: record?.healthStatus ?? "HEALTHY",
    growthStage: record?.growthStage ?? "SEEDLING",
    observation: record?.observation ?? "",
    recordedAt: record ? toDateInput(record.recordedAt) : todayInput(),
    notes: record?.notes ?? "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const { busy, error, submit } = useSubmit(async () => {
    const body = { healthStatus: form.healthStatus, growthStage: form.growthStage, observation: form.observation.trim(), recordedAt: form.recordedAt || undefined, notes: form.notes.trim() };
    const saved = record ? await updateCropHealth(record._id, body) : await createCropHealth(cropId, body);
    onSaved(saved);
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Health status" name="healthStatus" value={form.healthStatus} onChange={set("healthStatus")}>
          {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
        <Select label="Growth stage" name="growthStage" value={form.growthStage} onChange={set("growthStage")}>
          {stageOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
      </div>
      <Textarea label="What did you observe?" name="observation" required rows={3} value={form.observation} onChange={set("observation")} placeholder="e.g. Leaves look even and green; some yellowing at the field edge." />
      <Input label="Date" name="recordedAt" type="date" required value={form.recordedAt} onChange={set("recordedAt")} />
      <Textarea label="Notes" name="notes" rows={2} value={form.notes} onChange={set("notes")} hint="Optional" />
      <FormFooter busy={busy} error={error} onCancel={onCancel} submitLabel={record ? "Save changes" : "Save record"} />
    </form>
  );
}

export function HealthFormModal({ open, onClose, cropId, record, onSaved }) {
  return (
    <Modal open={open} onClose={onClose} title={record ? "Edit health record" : "Record a health check"}>
      <HealthForm cropId={cropId} record={record} onCancel={onClose} onSaved={(r) => { onSaved?.(r); onClose(); }} />
    </Modal>
  );
}
