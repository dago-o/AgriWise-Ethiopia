import { Link } from "react-router-dom";
import { ChevronRight, Plus, Sprout, Tractor, TriangleAlert } from "lucide-react";
import { Alert } from "../../components/feedback/Alert.jsx";
import { EmptyState } from "../../components/feedback/EmptyState.jsx";
import { QueryState } from "../../components/feedback/QueryState.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { ButtonLink } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { StatRow } from "../../components/ui/StatRow.jsx";
import { useAuth } from "../../context/useAuth.js";
import { useAsync } from "../../hooks/useAsync.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { HEALTH_TONE } from "../../lib/constants.js";
import { loadFarmerSnapshot, MAX_CROPS_CHECKED } from "../../lib/farmData.js";
import { entityId, formatCurrency, formatDate, formatLabel } from "../../lib/formatters.js";
import { CropStatusBadge } from "../crops/CropStatusBadge.jsx";

export function FarmerDashboardPage() {
  useDocumentTitle("Dashboard");
  const { user } = useAuth();
  const query = useAsync((signal) => loadFarmerSnapshot(signal), []);
  const firstName = user?.name?.split(" ")[0];

  return (
    <>
      <PageHeader
        title={firstName ? `Welcome, ${firstName}` : "Dashboard"}
        description="Where your crops stand today."
        actions={query.data?.counts.farms > 0 ? <ButtonLink to="/app/farms" variant="secondary">Manage farms</ButtonLink> : null}
      />

      <QueryState query={query} label="Gathering your farm records…">
        {(data) =>
          data.counts.farms === 0 ? (
            <EmptyState icon={Tractor} title="Start by adding a farm" description="Once you add a farm, its fields, crops, weather and finances will appear here." action={<ButtonLink to="/app/farms"><Plus className="h-4 w-4" />Add your first farm</ButtonLink>} />
          ) : (
            <div className="space-y-8">
              {data.partial ? <Alert variant="warning" onRetry={query.reload}>Some records could not be loaded, so the figures below may be incomplete.</Alert> : null}

              <StatRow
                stats={[
                  { label: "Farms", value: data.counts.farms },
                  { label: "Fields", value: data.counts.fields },
                  { label: "Crops", value: data.counts.crops },
                  { label: data.totals.profit < 0 ? "Net loss" : "Net profit", value: formatCurrency(data.totals.profit), hint: "Income minus expenses, all crops", tone: data.totals.profit < 0 ? "bad" : data.totals.profit > 0 ? "good" : undefined },
                ]}
              />

              {data.counts.crops === 0 ? (
                <EmptyState icon={Sprout} title="No crops yet" description="Open a farm, then a field, and add the crop you are growing." action={<ButtonLink to="/app/farms">Go to farms</ButtonLink>} />
              ) : (
                <>
                  {data.attention.length > 0 ? (
                    <Card className="p-0">
                      <div className="border-b border-ivory-200 px-5 py-4">
                        <h2 className="text-base font-semibold text-forest-900">Needs attention</h2>
                        <p className="text-sm text-ink-muted">Crops whose latest health check is not healthy, or that have a high-severity risk.</p>
                      </div>
                      <ul className="divide-y divide-ivory-200">
                        {data.attention.map(({ crop, latestHealth, risks }) => {
                          const high = risks.filter((r) => r.severity === "HIGH").length;
                          return (
                            <li key={entityId(crop)}>
                              <Link to={`/app/crops/${entityId(crop)}`} className="group flex items-center gap-4 px-5 py-4 hover:bg-ivory-50">
                                <TriangleAlert className="h-5 w-5 shrink-0 text-harvest-500" aria-hidden="true" />
                                <div className="min-w-0 flex-1">
                                  <p className="font-semibold text-forest-900">{crop.cropName} <span className="font-normal text-ink-soft">· {crop.fieldName}, {crop.farmName}</span></p>
                                  <p className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                                    {latestHealth && latestHealth.healthStatus !== "HEALTHY" ? <Badge tone={HEALTH_TONE[latestHealth.healthStatus]}>{formatLabel(latestHealth.healthStatus)} on {formatDate(latestHealth.recordedAt)}</Badge> : null}
                                    {high > 0 ? <Badge tone="danger">{high} high risk{high === 1 ? "" : "s"}</Badge> : null}
                                  </p>
                                </div>
                                <ChevronRight className="h-[18px] w-[18px] text-ink-soft" aria-hidden="true" />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </Card>
                  ) : null}

                  <Card className="p-0">
                    <div className="border-b border-ivory-200 px-5 py-4"><h2 className="text-base font-semibold text-forest-900">Your crops</h2></div>
                    <ul className="divide-y divide-ivory-200">
                      {data.details.map(({ crop, latestHealth, summary }) => (
                        <li key={entityId(crop)}>
                          <Link to={`/app/crops/${entityId(crop)}`} className="group flex items-center gap-4 px-5 py-4 hover:bg-ivory-50">
                            <div className="min-w-0 flex-1">
                              <p className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-forest-900">{crop.cropName}</span>
                                <CropStatusBadge status={crop.status} />
                                {latestHealth ? <Badge tone={HEALTH_TONE[latestHealth.healthStatus]}>{formatLabel(latestHealth.healthStatus)}</Badge> : null}
                              </p>
                              <p className="mt-0.5 text-sm text-ink-muted">{crop.fieldName}, {crop.farmName} · harvest expected {formatDate(crop.expectedHarvestDate)}</p>
                            </div>
                            {summary ? <p className="hidden text-right text-sm text-ink-muted sm:block">{summary.profit < 0 ? "Loss" : "Profit"}<br /><span className="font-semibold text-ink">{formatCurrency(summary.profit)}</span></p> : null}
                            <ChevronRight className="h-[18px] w-[18px] text-ink-soft" aria-hidden="true" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </Card>
                  {data.truncated ? <p className="text-sm text-ink-soft">Health, risk and profit figures cover the first {MAX_CROPS_CHECKED} crops.</p> : null}
                </>
              )}
            </div>
          )
        }
      </QueryState>
    </>
  );
}
