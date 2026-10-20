import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Pencil, Plus, Tractor, Trash2 } from "lucide-react";
import { EmptyState } from "../../components/feedback/EmptyState.jsx";
import { QueryState } from "../../components/feedback/QueryState.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog.jsx";
import { IconButton } from "../../components/ui/IconButton.jsx";
import { useToast } from "../../context/useToast.js";
import { useAsync } from "../../hooks/useAsync.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { deleteFarm, fetchFarms, fetchFields } from "../../lib/endpoints.js";
import { AREA_UNIT, entityId, formatNumber } from "../../lib/formatters.js";
import { FarmFormModal } from "./FarmFormModal.jsx";

export function FarmsPage() {
  useDocumentTitle("Farms & crops");
  const toast = useToast();
  const query = useAsync((signal) => fetchFarms({ signal }), []);
  const [editing, setEditing] = useState(null); // farm | "new" | null
  const [deleting, setDeleting] = useState(null);
  const farms = query.data;

  return (
    <>
      <PageHeader
        title="Farms & crops"
        description="Your land, from farm to field to crop. Open a farm to manage its fields."
        actions={farms?.length > 0 ? <Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" />Add farm</Button> : null}
      />

      <QueryState query={query} label="Loading your farms…">
        {(list) =>
          list.length === 0 ? (
            <EmptyState icon={Tractor} title="Add your first farm" description="A farm is the starting point. You will add fields and crops to it next." action={<Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" />Add farm</Button>} />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-ivory-200 bg-white shadow-[var(--shadow-card)]">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-ivory-200 bg-forest-50/60 text-ink-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Size ({AREA_UNIT})</th>
                    <th className="px-4 py-3 text-right font-medium"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ivory-100">
                  {list.map((farm) => (
                    <tr key={entityId(farm)}>
                      <td className="px-4 py-3.5">
                        <Link to={`/app/farms/${entityId(farm)}`} className="font-semibold text-forest-900 hover:underline">{farm.farmName}</Link>
                        {farm.description ? <p className="line-clamp-1 text-xs text-ink-soft">{farm.description}</p> : null}
                      </td>
                      <td className="px-4 py-3.5"><span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-ink-soft" aria-hidden="true" />{farm.location}</span></td>
                      <td className="px-4 py-3.5">{formatNumber(farm.size)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex justify-end gap-1">
                          <IconButton label={`Edit ${farm.farmName}`} onClick={() => setEditing(farm)}><Pencil className="h-4 w-4" /></IconButton>
                          <IconButton label={`Delete ${farm.farmName}`} tone="danger" onClick={() => setDeleting(farm)}><Trash2 className="h-4 w-4" /></IconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </QueryState>

      <FarmFormModal
        open={editing !== null}
        onClose={() => setEditing(null)}
        farm={editing && editing !== "new" ? editing : null}
        onSaved={() => { toast.success(editing === "new" ? "Farm added." : "Farm updated."); query.reload(); }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete this farm?"
        confirmLabel="Delete farm"
        message={deleting ? `“${deleting.farmName}” will be permanently deleted. A farm that still has fields cannot be deleted.` : ""}
        onConfirm={async () => {
          const fields = await fetchFields(entityId(deleting));
          if (fields.length > 0) throw new Error(`This farm still has ${fields.length} field${fields.length === 1 ? "" : "s"}. Delete its fields first, so no records are left without a farm.`);
          await deleteFarm(entityId(deleting));
          toast.success("Farm deleted.");
          query.reload();
        }}
      />
    </>
  );
}
