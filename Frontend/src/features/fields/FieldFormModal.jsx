import { useState } from "react";
import { Modal } from "../../components/ui/Modal.jsx";
import { FormFooter } from "../../components/ui/FormFooter.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { useSubmit } from "../../hooks/useSubmit.js";
import { createField, updateField } from "../../lib/endpoints.js";
import { AREA_UNIT } from "../../lib/formatters.js";

function FieldForm({ farmId, field, onCancel, onSaved }) {
  const [form, setForm] = useState({
    fieldName: field?.fieldName ?? "",
    location: field?.location ?? "",
    area: field?.area ?? "",
    soilType: field?.soilType ?? "",
    description: field?.description ?? "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const { busy, error, submit } = useSubmit(async () => {
    const body = { fieldName: form.fieldName.trim(), location: form.location.trim(), area: Number(form.area), soilType: form.soilType.trim(), description: form.description.trim() };
    const saved = field ? await updateField(field._id, body) : await createField(farmId, body);
    onSaved(saved);
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input label="Field name" name="fieldName" required value={form.fieldName} onChange={set("fieldName")} placeholder="e.g. North plot" />
      <Input label="Location on the farm" name="location" required value={form.location} onChange={set("location")} placeholder="e.g. Near the river" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={`Area (${AREA_UNIT})`} name="area" type="number" min="0" step="any" required value={form.area} onChange={set("area")} />
        <Input label="Soil type" name="soilType" required value={form.soilType} onChange={set("soilType")} placeholder="e.g. Clay loam" />
      </div>
      <Textarea label="Description" name="description" rows={3} value={form.description} onChange={set("description")} hint="Optional" />
      <FormFooter busy={busy} error={error} onCancel={onCancel} submitLabel={field ? "Save changes" : "Add field"} />
    </form>
  );
}

export function FieldFormModal({ open, onClose, farmId, field, onSaved }) {
  return (
    <Modal open={open} onClose={onClose} title={field ? "Edit field" : "Add a field"}>
      <FieldForm farmId={farmId} field={field} onCancel={onClose} onSaved={(f) => { onSaved?.(f); onClose(); }} />
    </Modal>
  );
}
