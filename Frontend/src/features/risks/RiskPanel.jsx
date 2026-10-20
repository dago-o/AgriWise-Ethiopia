import { useState } from "react";
import { Pencil, Plus, ShieldAlert, Trash2 } from "lucide-react";
import { EmptyState } from "../../components/feedback/EmptyState.jsx";
import { QueryState } from "../../components/feedback/QueryState.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog.jsx";
import { IconButton } from "../../components/ui/IconButton.jsx";
import { useToast } from "../../context/useToast.js";
import { useAsync } from "../../hooks/useAsync.js";
import { SEVERITY_TONE } from "../../lib/constants.js";
import { deleteCropRisk, fetchCropRisks } from "../../lib/endpoints.js";
import { formatDate, formatLabel } from "../../lib/formatters.js";
import { RiskFormModal } from "./RiskFormModal.jsx";

export function RiskPanel({ cropId }) {
  const toast = useToast();
  const query = useAsync((signal) => fetchCropRisks(cropId, { signal }), [cropId]);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const records = query.data;
  const high = records?.filter((r) => r.severity === "HIGH").length ?? 0;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-forest-900">Reported risks</h2>
          {records?.length > 0 ? <p className="mt-0.5 text-sm text-ink-muted">{records.length} reported{high > 0 ? `, ${high} high severity` : ""}</p> : null}
        </div>
        {records?.length > 0 ? <Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" />Report a risk</Button> : null}
      </div>

      <QueryState query={query} label="Loading risks…">
        {(list) =>
          list.length === 0 ? (
            <EmptyState icon={ShieldAlert} title="No risks reported" description="Note pests, disease, drought, weeds or nutrient problems when you see them, with how serious they are." action={<Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" />Report a risk</Button>} />
          ) : (
            <ul className="divide-y divide-ivory-200 overflow-hidden rounded-xl border border-ivory-200 bg-white">
              {list.map((r) => (
                <li key={r._id} className="flex items-start justify-between gap-3 px-5 py-4">
                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
                      <Badge tone={SEVERITY_TONE[r.severity]}>{formatLabel(r.severity)}</Badge>
                      <span className="font-semibold text-ink">{formatLabel(r.riskType)}</span>
                      <span aria-hidden="true">·</span>
                      <time dateTime={r.reportedAt}>{formatDate(r.reportedAt)}</time>
                    </p>
                    <p className="mt-1.5 text-ink">{r.description}</p>
                    {r.notes ? <p className="mt-1 text-sm text-ink-soft">{r.notes}</p> : null}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <IconButton label="Edit risk" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></IconButton>
                    <IconButton label="Delete risk" tone="danger" onClick={() => setDeleting(r)}><Trash2 className="h-4 w-4" /></IconButton>
                  </div>
                </li>
              ))}
            </ul>
          )
        }
      </QueryState>

      <RiskFormModal
        open={editing !== null}
        onClose={() => setEditing(null)}
        cropId={cropId}
        record={editing && editing !== "new" ? editing : null}
        onSaved={() => { toast.success(editing === "new" ? "Risk reported." : "Risk updated."); query.reload(); }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete this risk?"
        message="This record will be permanently removed."
        onConfirm={async () => { await deleteCropRisk(deleting._id); toast.success("Risk deleted."); query.reload(); }}
      />
    </div>
  );
}
