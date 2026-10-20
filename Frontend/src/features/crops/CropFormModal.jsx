import { useState } from "react";
import { Modal } from "../../components/ui/Modal.jsx";
import { FormFooter } from "../../components/ui/FormFooter.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { useSubmit } from "../../hooks/useSubmit.js";
import { CROP_STATUSES, toOptions } from "../../lib/constants.js";
import { createCrop, updateCrop } from "../../lib/endpoints.js";
import { toDateInput } from "../../lib/formatters.js";

const statusOptions = toOptions(CROP_STATUSES);

function CropForm({ fieldId, crop, onCancel, onSaved }) {
  const [form, setForm] = useState({
    cropName: crop?.cropName ?? "",
    plantDate: toDateInput(crop?.plantDate),
    expectedHarvestDate: toDateInput(crop?.expectedHarvestDate),
    status: crop?.status ?? "PLANNED",
    notes: crop?.notes ?? "",
  });
  const [dateError, setDateError] = useState("");
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const { busy, error, submit } = useSubmit(async () => {
    const body = { cropName: form.cropName.trim(), plantDate: form.plantDate, expectedHarvestDate: form.expectedHarvestDate, status: form.status, notes: form.notes.trim() };
    const saved = crop ? await updateCrop(crop._id, body) : await createCrop(fieldId, body);
    onSaved(saved);
  });

  function onSubmit(e) {
    e.preventDefault();
    if (form.expectedHarvestDate < form.plantDate) {
      setDateError("The expected harvest cannot be before the planting date.");
      return;
    }
    setDateError("");
    submit();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input label="Crop" name="cropName" required value={form.cropName} onChange={set("cropName")} placeholder="e.g. Teff" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Planting date" name="plantDate" type="date" required value={form.plantDate} onChange={set("plantDate")} />
        <Input label="Expected harvest" name="expectedHarvestDate" type="date" required value={form.expectedHarvestDate} onChange={set("expectedHarvestDate")} error={dateError} />
      </div>
      <Select label="Status" name="status" value={form.status} onChange={set("status")}>
        {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </Select>
      <Textarea label="Notes" name="notes" rows={3} value={form.notes} onChange={set("notes")} hint="Optional" />
      <FormFooter busy={busy} error={error} onCancel={onCancel} submitLabel={crop ? "Save changes" : "Add crop"} />
    </form>
  );
}

export function CropFormModal({ open, onClose, fieldId, crop, onSaved }) {
  return (
    <Modal open={open} onClose={onClose} title={crop ? "Edit crop" : "Add a crop"}>
      <CropForm fieldId={fieldId} crop={crop} onCancel={onClose} onSaved={(c) => { onSaved?.(c); onClose(); }} />
    </Modal>
  );
}
