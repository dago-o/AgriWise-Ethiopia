import { useState } from "react";
import { Modal } from "../../components/ui/Modal.jsx";
import { FormFooter } from "../../components/ui/FormFooter.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { useSubmit } from "../../hooks/useSubmit.js";
import { RISK_TYPES, SEVERITIES, toOptions } from "../../lib/constants.js";
import { createCropRisk, updateCropRisk } from "../../lib/endpoints.js";
import { toDateInput, todayInput } from "../../lib/formatters.js";

const typeOptions = toOptions(RISK_TYPES);
const severityOptions = toOptions(SEVERITIES);

function RiskForm({ cropId, record, onCancel, onSaved }) {
  const [form, setForm] = useState({
    riskType: record?.riskType ?? "PEST",
    severity: record?.severity ?? "LOW",
    description: record?.description ?? "",
    reportedAt: record ? toDateInput(record.reportedAt) : todayInput(),
    notes: record?.notes ?? "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const { busy, error, submit } = useSubmit(async () => {
    const body = { riskType: form.riskType, severity: form.severity, description: form.description.trim(), reportedAt: form.reportedAt || undefined, notes: form.notes.trim() };
    const saved = record ? await updateCropRisk(record._id, body) : await createCropRisk(cropId, body);
    onSaved(saved);
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Type of risk" name="riskType" value={form.riskType} onChange={set("riskType")}>
          {typeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
        <Select label="Severity" name="severity" value={form.severity} onChange={set("severity")}>
          {severityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
      </div>
      <Textarea label="What is happening?" name="description" required rows={3} value={form.description} onChange={set("description")} placeholder="e.g. Armyworm damage on about a tenth of the plants." />
      <Input label="Date noticed" name="reportedAt" type="date" required value={form.reportedAt} onChange={set("reportedAt")} />
      <Textarea label="Notes" name="notes" rows={2} value={form.notes} onChange={set("notes")} hint="Optional" />
      <FormFooter busy={busy} error={error} onCancel={onCancel} submitLabel={record ? "Save changes" : "Report risk"} />
    </form>
  );
}

export function RiskFormModal({ open, onClose, cropId, record, onSaved }) {
  return (
    <Modal open={open} onClose={onClose} title={record ? "Edit risk" : "Report a risk"}>
      <RiskForm cropId={cropId} record={record} onCancel={onClose} onSaved={(r) => { onSaved?.(r); onClose(); }} />
    </Modal>
  );
}
