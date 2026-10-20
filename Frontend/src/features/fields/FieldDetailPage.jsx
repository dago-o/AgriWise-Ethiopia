import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Pencil, Plus, Sprout, Trash2 } from "lucide-react";
import { Alert } from "../../components/feedback/Alert.jsx";
import { EmptyState } from "../../components/feedback/EmptyState.jsx";
import { QueryState } from "../../components/feedback/QueryState.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog.jsx";
import { DefinitionList } from "../../components/ui/DefinitionList.jsx";
import { useToast } from "../../context/useToast.js";
import { useAsync } from "../../hooks/useAsync.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { deleteField, fetchCrops, fetchField } from "../../lib/endpoints.js";
import { AREA_UNIT, entityId, formatDate, formatNumber } from "../../lib/formatters.js";
import { CropFormModal } from "../crops/CropFormModal.jsx";
import { CropStatusBadge } from "../crops/CropStatusBadge.jsx";
import { FieldFormModal } from "./FieldFormModal.jsx";

export function FieldDetailPage() {
  const { farmId, fieldId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const fieldQuery = useAsync((signal) => fetchField(fieldId, { signal }), [fieldId]);
  const cropsQuery = useAsync((signal) => fetchCrops(fieldId, { signal }), [fieldId]);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [addingCrop, setAddingCrop] = useState(false);

  useDocumentTitle(fieldQuery.data?.fieldName ?? "Field");
  const crops = cropsQuery.data;

  return (
    <QueryState query={fieldQuery} label="Loading field…">
      {(field) => {
        const farm = field.farm;
        const farmPath = `/app/farms/${farm?._id ?? farmId}`;
        return (
          <>
            <PageHeader
              back={{ to: farmPath, label: farm?.farmName ?? "Farm" }}
              title={field.fieldName}
              description={field.description || undefined}
              actions={
                <>
                  <Button variant="secondary" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" />Edit</Button>
                  <Button variant="dangerGhost" onClick={() => setDeleting(true)}><Trash2 className="h-4 w-4" />Delete</Button>
                </>
              }
            />

            <Card className="mb-8">
              <DefinitionList
                items={[
                  { label: "Area", value: `${formatNumber(field.area)} ${AREA_UNIT}` },
                  { label: "Soil type", value: field.soilType },
                  { label: "Location on the farm", value: field.location },
                  { label: "Farm", value: farm?._id ? <Link className="text-forest-700 hover:underline" to={farmPath}>{farm.farmName}</Link> : "—" },
                ]}
              />
            </Card>

            <Card className="p-0">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ivory-200 px-5 py-4">
                <div>
                  <h2 className="text-base font-semibold text-forest-900">Crops</h2>
                  <p className="text-sm text-ink-muted">Open a crop to record health, risks, costs and income.</p>
                </div>
                {crops?.length > 0 ? <Button size="sm" onClick={() => setAddingCrop(true)}><Plus className="h-4 w-4" />Add crop</Button> : null}
              </div>
              {cropsQuery.error ? (
                <div className="p-5"><Alert onRetry={cropsQuery.reload}>{cropsQuery.error.message}</Alert></div>
              ) : !crops ? (
                <p className="px-5 py-10 text-center text-sm text-ink-soft">Loading crops…</p>
              ) : crops.length === 0 ? (
                <div className="p-5">
                  <EmptyState icon={Sprout} title="Nothing planted here yet" description="Add the crop you are growing or planning to grow in this field." action={<Button onClick={() => setAddingCrop(true)}><Plus className="h-4 w-4" />Add a crop</Button>} />
                </div>
              ) : (
                <ul className="divide-y divide-ivory-200">
                  {crops.map((crop) => (
                    <li key={entityId(crop)}>
                      <Link to={`/app/crops/${entityId(crop)}`} className="group flex items-center gap-4 px-5 py-4 hover:bg-ivory-50">
                        <div className="min-w-0 flex-1">
                          <p className="flex flex-wrap items-center gap-2"><span className="font-semibold text-forest-900">{crop.cropName}</span><CropStatusBadge status={crop.status} /></p>
                          <p className="mt-0.5 text-sm text-ink-muted">Planted {formatDate(crop.plantDate)} · Harvest expected {formatDate(crop.expectedHarvestDate)}</p>
                        </div>
                        <ChevronRight className="h-[18px] w-[18px] text-ink-soft transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <FieldFormModal open={editing} onClose={() => setEditing(false)} farmId={farm?._id ?? farmId} field={field} onSaved={() => { toast.success("Field updated."); fieldQuery.reload(); }} />
            <CropFormModal open={addingCrop} onClose={() => setAddingCrop(false)} fieldId={fieldId} onSaved={() => { toast.success("Crop added."); cropsQuery.reload(); }} />
            <ConfirmDialog
              open={deleting}
              onClose={() => setDeleting(false)}
              title="Delete this field?"
              confirmLabel="Delete field"
              message={`“${field.fieldName}” will be permanently deleted. A field that still has crops cannot be deleted.`}
              onConfirm={async () => {
                const current = await fetchCrops(fieldId);
                if (current.length > 0) throw new Error(`This field still has ${current.length} crop${current.length === 1 ? "" : "s"}. Delete its crops first.`);
                await deleteField(fieldId);
                toast.success("Field deleted.");
                navigate(farmPath, { replace: true });
              }}
            />
          </>
        );
      }}
    </QueryState>
  );
}
