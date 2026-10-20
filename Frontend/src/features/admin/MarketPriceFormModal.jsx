import { useState } from "react";
import { Modal } from "../../components/ui/Modal.jsx";
import { FormFooter } from "../../components/ui/FormFooter.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { useSubmit } from "../../hooks/useSubmit.js";
import { createMarketPrice, updateMarketPrice } from "../../lib/endpoints.js";
import { CURRENCY, toDateInput, todayInput } from "../../lib/formatters.js";

function PriceForm({ price, onCancel, onSaved }) {
  const [form, setForm] = useState({
    cropName: price?.cropName ?? "",
    marketName: price?.marketName ?? "",
    location: price?.location ?? "",
    price: price?.price ?? "",
    unit: price?.unit ?? "",
    recordedAt: price ? toDateInput(price.recordedAt) : todayInput(),
    notes: price?.notes ?? "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const { busy, error, submit } = useSubmit(async () => {
    const body = {
      cropName: form.cropName.trim(),
      marketName: form.marketName.trim(),
      location: form.location.trim(),
      price: Number(form.price),
      unit: form.unit.trim(),
      recordedAt: form.recordedAt || undefined,
      notes: form.notes.trim(),
    };
    const saved = price ? await updateMarketPrice(price._id, body) : await createMarketPrice(body);
    onSaved(saved);
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Crop" name="cropName" required value={form.cropName} onChange={set("cropName")} placeholder="e.g. Teff" />
        <Input label="Market" name="marketName" required value={form.marketName} onChange={set("marketName")} placeholder="e.g. Adama central market" />
      </div>
      <Input label="Location" name="location" required value={form.location} onChange={set("location")} placeholder="e.g. Adama" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Input label={`Price (${CURRENCY})`} name="price" type="number" min="0" step="any" required value={form.price} onChange={set("price")} />
        <Input label="Per unit" name="unit" required value={form.unit} onChange={set("unit")} placeholder="e.g. quintal" />
        <Input label="Date recorded" name="recordedAt" type="date" required value={form.recordedAt} onChange={set("recordedAt")} />
      </div>
      <Textarea label="Notes" name="notes" rows={2} value={form.notes} onChange={set("notes")} hint="Optional" />
      <FormFooter busy={busy} error={error} onCancel={onCancel} submitLabel={price ? "Save changes" : "Add price"} />
    </form>
  );
}

export function MarketPriceFormModal({ open, onClose, price, onSaved }) {
  return (
    <Modal open={open} onClose={onClose} title={price ? "Edit price" : "Add a market price"}>
      <PriceForm price={price} onCancel={onClose} onSaved={(p) => { onSaved?.(p); onClose(); }} />
    </Modal>
  );
}
