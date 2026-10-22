import { useState } from "react";
import { Modal } from "../../components/ui/Modal.jsx";
import { FormFooter } from "../../components/ui/FormFooter.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { useSubmit } from "../../hooks/useSubmit.js";
import { createFarm, updateFarm } from "../../lib/endpoints.js";
import { AREA_UNIT } from "../../lib/formatters.js";

function FarmForm({ farm, onCancel, onSaved }) {
  const [form, setForm] = useState({
    farmName: farm?.farmName ?? "",
    location: farm?.location ?? "",
    size: farm?.size ?? "",
    description: farm?.description ?? "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const { busy, error, submit } = useSubmit(async () => {
    const body = { farmName: form.farmName.trim(), location: form.location.trim(), size: Number(form.size), description: form.description.trim() };
    const saved = farm ? await updateFarm(farm._id, body) : await createFarm(body);
    onSaved(saved);
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input label="Farm name" name="farmName" required value={form.farmName} onChange={set("farmName")} placeholder="e.g. Home farm" />
      <Input label="Location" name="location" required value={form.location} onChange={set("location")} placeholder="e.g. Adama" hint="Use the name of a nearby town or city. Weather and alerts are looked up from this name." />
      <Input label={`Size (${AREA_UNIT})`} name="size" type="number" min="0" step="any" required value={form.size} onChange={set("size")} />
      <Textarea label="Description" name="description" rows={3} value={form.description} onChange={set("description")} hint="Optional" />
      <FormFooter busy={busy} error={error} onCancel={onCancel} submitLabel={farm ? "Save changes" : "Add farm"} />
    </form>
  );
}

export function FarmFormModal({ open, onClose, farm, onSaved }) {
  return (
    <Modal open={open} onClose={onClose} title={farm ? "Edit farm" : "Add a farm"}>
      <FarmForm farm={farm} onCancel={onClose} onSaved={(f) => { onSaved?.(f); onClose(); }} />
    </Modal>
  );
}
