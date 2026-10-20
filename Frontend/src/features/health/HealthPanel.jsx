import { useState } from "react";
import { HeartPulse, Pencil, Plus, Trash2 } from "lucide-react";
import { EmptyState } from "../../components/feedback/EmptyState.jsx";
import { QueryState } from "../../components/feedback/QueryState.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog.jsx";
import { IconButton } from "../../components/ui/IconButton.jsx";
import { useToast } from "../../context/useToast.js";
import { useAsync } from "../../hooks/useAsync.js";
import { HEALTH_TONE } from "../../lib/constants.js";
import { deleteCropHealth, fetchCropHealthRecords } from "../../lib/endpoints.js";
import { formatDate, formatLabel } from "../../lib/formatters.js";
import { HealthFormModal } from "./HealthFormModal.jsx";

const dot = { HEALTHY: "bg-emerald-500", WARNING: "bg-harvest-400", CRITICAL: "bg-red-500" };

export function HealthPanel({ cropId }) {
  const toast = useToast();
  const query = useAsync((signal) => fetchCropHealthRecords(cropId, { signal }), [cropId]);
  const [editing, setEditing] = useState(null); // record | "new" | null
  const [deleting, setDeleting] = useState(null);
  const latest = query.data?.[0];

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-forest-900">Health history</h2>
          {latest ? (
            <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
              Latest check, {formatDate(latest.recordedAt)}:
              <Badge tone={HEALTH_TONE[latest.healthStatus]}>{formatLabel(latest.healthStatus)}</Badge>
              <span>{formatLabel(latest.growthStage)} stage</span>
            </p>
          ) : null}
        </div>
        {query.data?.length > 0 ? <Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" />Record a check</Button> : null}
      </div>

      <QueryState query={query} label="Loading health records…">
        {(records) =>
          records.length === 0 ? (
            <EmptyState icon={HeartPulse} title="No health checks recorded" description="Note how the crop looks and which growth stage it is in. Over time this shows how it is doing." action={<Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" />Record the first check</Button>} />
          ) : (
            <ol className="relative space-y-6 border-l-2 border-ivory-200 pl-6">
              {records.map((r) => (
                <li key={r._id} className="relative">
                  <span className={`absolute -left-[33px] top-1.5 h-4 w-4 rounded-full ring-4 ring-ivory-50 ${dot[r.healthStatus] ?? "bg-ink-soft"}`} aria-hidden="true" />
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex flex-wrap items-center gap-2 text-sm text-ink-muted">
                        <Badge tone={HEALTH_TONE[r.healthStatus]}>{formatLabel(r.healthStatus)}</Badge>
                        <span>{formatLabel(r.growthStage)} stage</span>
                        <span aria-hidden="true">·</span>
                        <time dateTime={r.recordedAt}>{formatDate(r.recordedAt)}</time>
                      </p>
                      <p className="mt-1.5 text-ink">{r.observation}</p>
                      {r.notes ? <p className="mt-1 text-sm text-ink-soft">{r.notes}</p> : null}
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <IconButton label="Edit record" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></IconButton>
                      <IconButton label="Delete record" tone="danger" onClick={() => setDeleting(r)}><Trash2 className="h-4 w-4" /></IconButton>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )
        }
      </QueryState>

      <HealthFormModal
        open={editing !== null}
        onClose={() => setEditing(null)}
        cropId={cropId}
        record={editing && editing !== "new" ? editing : null}
        onSaved={() => { toast.success(editing === "new" ? "Health check recorded." : "Record updated."); query.reload(); }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete this health record?"
        message="This record will be permanently removed."
        onConfirm={async () => { await deleteCropHealth(deleting._id); toast.success("Record deleted."); query.reload(); }}
      />
    </div>
  );
}
