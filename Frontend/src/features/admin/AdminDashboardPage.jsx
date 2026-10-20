import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { QueryState } from "../../components/feedback/QueryState.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { SimpleBarChart } from "../../components/ui/SimpleBarChart.jsx";
import { StatRow } from "../../components/ui/StatRow.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { fetchAdminDashboard } from "../../lib/endpoints.js";
import { formatCurrency, formatLabel, formatNumber } from "../../lib/formatters.js";

const toRows = (obj) => Object.entries(obj).map(([key, value]) => ({ label: formatLabel(key), value }));

function ChartCard({ title, description, rows, color, format, emptyText = "Nothing recorded yet." }) {
  const total = rows.reduce((n, r) => n + r.value, 0);
  return (
    <Card>
      <h2 className="text-base font-semibold text-forest-900">{title}</h2>
      {description ? <p className="text-sm text-ink-muted">{description}</p> : null}
      <div className="mt-4">
        {total === 0 ? <p className="py-6 text-center text-sm text-ink-soft">{emptyText}</p> : <SimpleBarChart items={rows} color={color} format={format} />}
      </div>
    </Card>
  );
}

export function AdminDashboardPage() {
  useDocumentTitle("Admin overview");
  const query = useAsync((signal) => fetchAdminDashboard({ signal }), []);

  return (
    <>
      <PageHeader title="Platform summary" description="Current totals across all farmers. These are live aggregates, not a history over time." />
      <QueryState query={query} label="Loading platform summary…">
        {({ summary, cropHealth, cropRisks, cropDistribution, economics, resources }) => (
          <div className="space-y-8">
            <StatRow
              stats={[
                { label: "Farmers", value: formatNumber(summary.totalFarmers) },
                { label: "Farms", value: formatNumber(summary.totalFarms) },
                { label: "Fields", value: formatNumber(summary.totalFields) },
                { label: "Crops", value: formatNumber(summary.totalCrops) },
                { label: "Resources", value: formatNumber(summary.totalResources) },
              ]}
            />
            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard title="Crop health records" description="All health records, grouped by status." rows={toRows(cropHealth)} color="bg-emerald-600" />
              <ChartCard title="Reported risks" description="All risk reports, grouped by type." rows={toRows(cropRisks)} color="bg-harvest-500" />
              <ChartCard
                title="Crops grown"
                description={cropDistribution.length > 10 ? "The ten most common crops." : "Number of crop records per crop name."}
                rows={cropDistribution.slice(0, 10).map((c) => ({ label: c.cropName, value: c.count }))}
                color="bg-forest-600"
              />
              <Card>
                <h2 className="text-base font-semibold text-forest-900">Farmer finances</h2>
                <p className="text-sm text-ink-muted">Totals across all recorded expenses and income.</p>
                <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                  <div><dt className="text-ink-muted">Income</dt><dd className="font-display text-lg font-bold">{formatCurrency(economics.totalIncome)}</dd></div>
                  <div><dt className="text-ink-muted">Expenses</dt><dd className="font-display text-lg font-bold">{formatCurrency(economics.totalExpenses)}</dd></div>
                  <div><dt className="text-ink-muted">{economics.totalProfit < 0 ? "Net loss" : "Net profit"}</dt><dd className={`font-display text-lg font-bold ${economics.totalProfit < 0 ? "text-red-700" : "text-emerald-700"}`}>{formatCurrency(economics.totalProfit)}</dd></div>
                </dl>
                {economics.totalIncome > 0 || economics.totalExpenses > 0 ? (
                  <div className="mt-5">
                    <SimpleBarChart items={[{ label: "Income", value: economics.totalIncome }, { label: "Expenses", value: economics.totalExpenses }]} format={formatCurrency} color="bg-harvest-500" />
                  </div>
                ) : <p className="mt-5 py-4 text-center text-sm text-ink-soft">No income or expenses recorded yet.</p>}
              </Card>
              <ChartCard title="Resources by topic" description={`${resources.total} resource${resources.total === 1 ? "" : "s"} in total, including drafts.`} rows={resources.byCategory.map((r) => ({ label: formatLabel(r.category), value: r.count }))} color="bg-forest-600" />
              <ChartCard title="Resources by format" rows={resources.byType.map((r) => ({ label: formatLabel(r.resourceType), value: r.count }))} color="bg-forest-500" />
            </div>
          </div>
        )}
      </QueryState>
    </>
  );
}
