import { useState } from "react";
import { Modal } from "../../components/ui/Modal.jsx";
import { FormFooter } from "../../components/ui/FormFooter.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { useSubmit } from "../../hooks/useSubmit.js";
import { createIncome, updateIncome } from "../../lib/endpoints.js";
import { CURRENCY, toDateInput, todayInput } from "../../lib/formatters.js";

function IncomeForm({ cropId, record, onCancel, onSaved }) {
  const [form, setForm] = useState({
    amount: record?.amount ?? "",
    quantity: record?.quantity ?? "",
    unit: record?.unit ?? "",
    incomeDate: record ? toDateInput(record.incomeDate) : todayInput(),
    description: record?.description ?? "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const { busy, error, submit } = useSubmit(async () => {
    const body = {
      amount: Number(form.amount),
      quantity: form.quantity === "" ? undefined : Number(form.quantity),
      unit: form.unit.trim(),
      incomeDate: form.incomeDate || undefined,
      description: form.description.trim(),
    };
    const saved = record ? await updateIncome(record._id, body) : await createIncome(cropId, body);
    onSaved(saved);
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={`Amount received (${CURRENCY})`} name="amount" type="number" min="0" step="any" required value={form.amount} onChange={set("amount")} />
        <Input label="Date" name="incomeDate" type="date" required value={form.incomeDate} onChange={set("incomeDate")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Quantity sold" name="quantity" type="number" min="0" step="any" value={form.quantity} onChange={set("quantity")} hint="Optional" />
        <Input label="Unit" name="unit" value={form.unit} onChange={set("unit")} hint="Optional, e.g. quintal" />
      </div>
      <Input label="Description" name="description" value={form.description} onChange={set("description")} hint="Optional" placeholder="e.g. Sold at Adama market" />
      <FormFooter busy={busy} error={error} onCancel={onCancel} submitLabel={record ? "Save changes" : "Add income"} />
    </form>
  );
}

export function IncomeFormModal({ open, onClose, cropId, record, onSaved }) {
  return (
    <Modal open={open} onClose={onClose} title={record ? "Edit income" : "Add income"} size="sm">
      <IncomeForm cropId={cropId} record={record} onCancel={onClose} onSaved={(r) => { onSaved?.(r); onClose(); }} />
    </Modal>
  );
}
