import { useState } from "react";
import { Modal } from "../../components/ui/Modal.jsx";
import { FormFooter } from "../../components/ui/FormFooter.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { useSubmit } from "../../hooks/useSubmit.js";
import { EXPENSE_CATEGORIES, toOptions } from "../../lib/constants.js";
import { createExpense, updateExpense } from "../../lib/endpoints.js";
import { CURRENCY, toDateInput, todayInput } from "../../lib/formatters.js";

const categoryOptions = toOptions(EXPENSE_CATEGORIES);

function ExpenseForm({ cropId, record, onCancel, onSaved }) {
  const [form, setForm] = useState({
    category: record?.category ?? "SEED",
    amount: record?.amount ?? "",
    expenseDate: record ? toDateInput(record.expenseDate) : todayInput(),
    description: record?.description ?? "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const { busy, error, submit } = useSubmit(async () => {
    const body = { category: form.category, amount: Number(form.amount), expenseDate: form.expenseDate || undefined, description: form.description.trim() };
    const saved = record ? await updateExpense(record._id, body) : await createExpense(cropId, body);
    onSaved(saved);
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <Select label="Category" name="category" value={form.category} onChange={set("category")}>
        {categoryOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </Select>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={`Amount (${CURRENCY})`} name="amount" type="number" min="0" step="any" required value={form.amount} onChange={set("amount")} />
        <Input label="Date" name="expenseDate" type="date" required value={form.expenseDate} onChange={set("expenseDate")} />
      </div>
      <Input label="Description" name="description" value={form.description} onChange={set("description")} hint="Optional" placeholder="e.g. 3 quintals of DAP" />
      <FormFooter busy={busy} error={error} onCancel={onCancel} submitLabel={record ? "Save changes" : "Add expense"} />
    </form>
  );
}

export function ExpenseFormModal({ open, onClose, cropId, record, onSaved }) {
  return (
    <Modal open={open} onClose={onClose} title={record ? "Edit expense" : "Add an expense"} size="sm">
      <ExpenseForm cropId={cropId} record={record} onCancel={onClose} onSaved={(r) => { onSaved?.(r); onClose(); }} />
    </Modal>
  );
}
