import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Bot, Coins, HeartPulse, Pencil, ShieldAlert, Trash2 } from "lucide-react";
import { QueryState } from "../../components/feedback/QueryState.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { Button, ButtonLink } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog.jsx";
import { DefinitionList } from "../../components/ui/DefinitionList.jsx";
import { Tabs } from "../../components/ui/Tabs.jsx";
import { useToast } from "../../context/useToast.js";
import { useAsync } from "../../hooks/useAsync.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { fetchCrop } from "../../lib/endpoints.js";
import { deleteCropWithRecords } from "../../lib/farmData.js";
import { formatDate } from "../../lib/formatters.js";
import { FinancePanel } from "../economics/FinancePanel.jsx";
import { HealthPanel } from "../health/HealthPanel.jsx";
import { RiskPanel } from "../risks/RiskPanel.jsx";
import { CropFormModal } from "./CropFormModal.jsx";
import { CropStatusBadge } from "./CropStatusBadge.jsx";

const tabs = [
  { id: "health", label: "Health", icon: HeartPulse },
  { id: "risks", label: "Risks", icon: ShieldAlert },
  { id: "finances", label: "Finances", icon: Coins },
];

export function CropDetailPage() {
  const { cropId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const tab = tabs.some((t) => t.id === params.get("tab")) ? params.get("tab") : "health";
  const query = useAsync((signal) => fetchCrop(cropId, { signal }), [cropId]);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useDocumentTitle(query.data?.cropName ?? "Crop");

  return (
    <QueryState query={query} label="Loading crop…">
      {(crop) => {
        const field = crop.field;
        const farm = field?.farm;
        const fieldPath = field?._id ? `/app/farms/${farm?._id}/fields/${field._id}` : "/app/farms";
        return (
          <>
            <PageHeader
              back={{ to: field?._id ? fieldPath : "/app/farms", label: field?.fieldName ?? "Farms" }}
              title={<span className="flex flex-wrap items-center gap-3">{crop.cropName}<CropStatusBadge status={crop.status} /></span>}
              description={crop.notes || undefined}
              actions={
                <>
                  <ButtonLink to={`/app/ai?crop=${crop._id}`} variant="secondary"><Bot className="h-4 w-4" />Ask the assistant</ButtonLink>
                  <Button variant="secondary" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" />Edit</Button>
                  <Button variant="dangerGhost" onClick={() => setDeleting(true)}><Trash2 className="h-4 w-4" />Delete</Button>
                </>
              }
            />

            <Card className="mb-8">
              <DefinitionList
                items={[
                  { label: "Planted", value: formatDate(crop.plantDate) },
                  { label: "Expected harvest", value: formatDate(crop.expectedHarvestDate) },
                  { label: "Field", value: field?._id ? <Link className="text-forest-700 hover:underline" to={fieldPath}>{field.fieldName}</Link> : "—" },
                  { label: "Farm", value: farm?._id ? <Link className="text-forest-700 hover:underline" to={`/app/farms/${farm._id}`}>{farm.farmName}</Link> : "—" },
                ]}
              />
            </Card>

            <Tabs tabs={tabs} value={tab} onChange={(id) => setParams({ tab: id }, { replace: true })} label="Crop records" />
            <div className="pt-6" role="tabpanel">
              {tab === "health" ? <HealthPanel cropId={cropId} /> : null}
              {tab === "risks" ? <RiskPanel cropId={cropId} /> : null}
              {tab === "finances" ? <FinancePanel cropId={cropId} /> : null}
            </div>

            <CropFormModal open={editing} onClose={() => setEditing(false)} fieldId={field?._id} crop={crop} onSaved={() => { toast.success("Crop updated."); query.reload(); }} />
            <ConfirmDialog
              open={deleting}
              onClose={() => setDeleting(false)}
              title="Delete this crop?"
              confirmLabel="Delete crop and records"
              message={`“${crop.cropName}” and all of its health checks, risks, expenses and income will be permanently deleted.`}
              onConfirm={async () => {
                await deleteCropWithRecords(cropId);
                toast.success("Crop deleted.");
                navigate(fieldPath, { replace: true });
              }}
            />
          </>
        );
      }}
    </QueryState>
  );
}
