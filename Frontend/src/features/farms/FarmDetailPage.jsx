import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, CloudSun, MapPin, Pencil, Plus, Sprout, Trash2 } from "lucide-react";
import { Alert } from "../../components/feedback/Alert.jsx";
import { EmptyState } from "../../components/feedback/EmptyState.jsx";
import { QueryState } from "../../components/feedback/QueryState.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { Button, ButtonLink } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog.jsx";
import { DefinitionList } from "../../components/ui/DefinitionList.jsx";
import { useToast } from "../../context/useToast.js";
import { useAsync } from "../../hooks/useAsync.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { deleteFarm, fetchFarm, fetchFields } from "../../lib/endpoints.js";
import { AREA_UNIT, entityId, formatNumber } from "../../lib/formatters.js";
import { FieldFormModal } from "../fields/FieldFormModal.jsx";
import { FarmFormModal } from "./FarmFormModal.jsx";

export function FarmDetailPage() {
  const { farmId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const farmQuery = useAsync((signal) => fetchFarm(farmId, { signal }), [farmId]);
  const fieldsQuery = useAsync((signal) => fetchFields(farmId, { signal }), [farmId]);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [addingField, setAddingField] = useState(false);

  const farm = farmQuery.data;
  const fields = fieldsQuery.data;
  useDocumentTitle(farm?.farmName ?? "Farm");

  return (
    <QueryState query={farmQuery} label="Loading farm…">
      {(f) => (
        <>
          <PageHeader
            back={{ to: "/app/farms", label: "All farms" }}
            title={f.farmName}
            description={f.description || undefined}
            actions={
              <>
                <ButtonLink to={`/app/weather?farm=${farmId}`} variant="secondary"><CloudSun className="h-4 w-4" />Weather</ButtonLink>
                <Button variant="secondary" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" />Edit</Button>
                <Button variant="dangerGhost" onClick={() => setDeleting(true)}><Trash2 className="h-4 w-4" />Delete</Button>
              </>
            }
          />

          <Card className="mb-8">
            <DefinitionList
              items={[
                { label: "Location", value: <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" aria-hidden="true" />{f.location}</span> },
                { label: "Size", value: `${formatNumber(f.size)} ${AREA_UNIT}` },
              ]}
            />
          </Card>

          <Card className="p-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ivory-200 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-forest-900">Fields</h2>
                <p className="text-sm text-ink-muted">Open a field to manage the crops growing in it.</p>
              </div>
              {fields?.length > 0 ? <Button size="sm" onClick={() => setAddingField(true)}><Plus className="h-4 w-4" />Add field</Button> : null}
            </div>
            {fieldsQuery.error ? (
              <div className="p-5"><Alert onRetry={fieldsQuery.reload}>{fieldsQuery.error.message}</Alert></div>
            ) : !fields ? (
              <p className="px-5 py-10 text-center text-sm text-ink-soft">Loading fields…</p>
            ) : fields.length === 0 ? (
              <div className="p-5">
                <EmptyState icon={Sprout} title="No fields yet" description="Split the farm into fields (plots) so each crop can be tracked where it grows." action={<Button onClick={() => setAddingField(true)}><Plus className="h-4 w-4" />Add a field</Button>} />
              </div>
            ) : (
              <ul className="divide-y divide-ivory-200">
                {fields.map((field) => (
                  <li key={entityId(field)}>
                    <Link to={`/app/farms/${farmId}/fields/${entityId(field)}`} className="group flex items-center gap-4 px-5 py-4 hover:bg-ivory-50">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-forest-900">{field.fieldName}</p>
                        <p className="text-sm text-ink-muted">{formatNumber(field.area)} {AREA_UNIT} · {field.soilType} · {field.location}</p>
                      </div>
                      <ChevronRight className="h-[18px] w-[18px] text-ink-soft transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <FarmFormModal open={editing} onClose={() => setEditing(false)} farm={farm} onSaved={() => { toast.success("Farm updated."); farmQuery.reload(); }} />
          <FieldFormModal open={addingField} onClose={() => setAddingField(false)} farmId={farmId} onSaved={() => { toast.success("Field added."); fieldsQuery.reload(); }} />
          <ConfirmDialog
            open={deleting}
            onClose={() => setDeleting(false)}
            title="Delete this farm?"
            confirmLabel="Delete farm"
            message={`“${f.farmName}” will be permanently deleted. A farm that still has fields cannot be deleted.`}
            onConfirm={async () => {
              const current = await fetchFields(farmId);
              if (current.length > 0) throw new Error(`This farm still has ${current.length} field${current.length === 1 ? "" : "s"}. Delete its fields first, so no records are left without a farm.`);
              await deleteFarm(farmId);
              toast.success("Farm deleted.");
              navigate("/app/farms", { replace: true });
            }}
          />
        </>
      )}
    </QueryState>
  );
}
