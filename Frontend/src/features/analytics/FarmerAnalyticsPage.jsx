import { BarChart3 } from "lucide-react";
import { Alert } from "../../components/feedback/Alert.jsx";
import { EmptyState } from "../../components/feedback/EmptyState.jsx";
import { QueryState } from "../../components/feedback/QueryState.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { ButtonLink } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { SimpleBarChart } from "../../components/ui/SimpleBarChart.jsx";
import { StatRow } from "../../components/ui/StatRow.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { CROP_STATUSES, GROWTH_STAGES, HEALTH_STATUSES, RISK_TYPES, SEVERITIES } from "../../lib/constants.js";
import { loadFarmerSnapshot, MAX_CROPS_CHECKED } from "../../lib/farmData.js";
import { formatCurrency, formatLabel } from "../../lib/formatters.js";

const count = (items, values, pick) => values.map((v) => ({ label: formatLabel(v), value: items.filter((i) => pick(i) === v).length }));

function ChartCard({ title, description, children, empty }) {
  return (
    <Card>
      <h2 className="text-base font-semibold text-forest-900">{title}</h2>
      {description ? <p className="mb-4 text-sm text-ink-muted">{description}</p> : <div className="mb-4" />}
      {empty ? <p className="py-6 text-center text-sm text-ink-soft">{empty}</p> : children}
    </Card>
  );
}

function Analytics({ data }) {
  const crops = data.details.map((d) => d.crop);
  const withHealth = data.details.filter((d) => d.latestHealth);
  const allRisks = data.details.flatMap((d) => d.risks);

  const statusRows = count(crops, CROP_STATUSES, (c) => c.status);
  const healthRows = count(withHealth, HEALTH_STATUSES, (d) => d.latestHealth.healthStatus);
  const stageRows = count(withHealth, GROWTH_STAGES, (d) => d.latestHealth.growthStage);
  const riskTypeRows = count(allRisks, RISK_TYPES, (r) => r.riskType).filter((r) => r.value > 0);
  const severityRows = count(allRisks, SEVERITIES, (r) => r.severity);
  const incomeRows = data.details.filter((d) => d.summary && d.summary.totalIncome > 0).map((d) => ({ label: `${d.crop.cropName} (${d.crop.fieldName})`, value: d.summary.totalIncome }));
  const expenseRows = data.details.filter((d) => d.summary && d.summary.totalExpenses > 0).map((d) => ({ label: `${d.crop.cropName} (${d.crop.fieldName})`, value: d.summary.totalExpenses }));
  const profitRows = data.details.filter((d) => d.summary && (d.summary.totalIncome > 0 || d.summary.totalExpenses > 0)).map((d) => ({ label: `${d.crop.cropName} (${d.crop.fieldName})`, value: d.summary.profit }));

  return (
    <div className="space-y-8">
      {data.partial ? <Alert variant="warning">Some records could not be loaded, so these figures may be incomplete.</Alert> : null}
      <StatRow
        stats={[
          { label: "Crops", value: data.counts.crops },
          { label: "Total income", value: formatCurrency(data.totals.income) },
          { label: "Total expenses", value: formatCurrency(data.totals.expenses) },
          { label: data.totals.profit < 0 ? "Net loss" : "Net profit", value: formatCurrency(data.totals.profit), tone: data.totals.profit < 0 ? "bad" : data.totals.profit > 0 ? "good" : undefined },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Crops by status" description="Where each crop is in its season.">
          <SimpleBarChart items={statusRows} />
        </ChartCard>
        <ChartCard title="Latest health, per crop" description="Based on each crop’s most recent health check." empty={withHealth.length === 0 ? "No health checks recorded yet." : null}>
          <SimpleBarChart items={healthRows} color="bg-emerald-600" />
        </ChartCard>
        <ChartCard title="Growth stages" description="From each crop’s most recent health check." empty={withHealth.length === 0 ? "No health checks recorded yet." : null}>
          <SimpleBarChart items={stageRows} color="bg-forest-500" />
        </ChartCard>
        <ChartCard title="Reported risks by type" description={`${allRisks.length} risk${allRisks.length === 1 ? "" : "s"} across your crops.`} empty={allRisks.length === 0 ? "No risks reported." : null}>
          <SimpleBarChart items={riskTypeRows} color="bg-harvest-500" />
          <p className="mb-2 mt-6 text-sm font-semibold text-forest-900">By severity</p>
          <SimpleBarChart items={severityRows} color="bg-harvest-600" />
        </ChartCard>
        <ChartCard title="Income per crop" empty={incomeRows.length === 0 ? "No income recorded yet." : null}>
          <SimpleBarChart items={incomeRows} format={formatCurrency} color="bg-emerald-600" />
        </ChartCard>
        <ChartCard title="Expenses per crop" empty={expenseRows.length === 0 ? "No expenses recorded yet." : null}>
          <SimpleBarChart items={expenseRows} format={formatCurrency} color="bg-harvest-500" />
        </ChartCard>
      </div>

      {profitRows.length > 0 ? (
        <Card>
          <h2 className="text-base font-semibold text-forest-900">Profit or loss per crop</h2>
          <ul className="mt-4 divide-y divide-ivory-200 text-sm">
            {profitRows.map((r) => (
              <li key={r.label} className="flex justify-between gap-4 py-2.5">
                <span className="text-ink-muted">{r.label}</span>
                <span className={`font-semibold ${r.value < 0 ? "text-red-700" : "text-emerald-700"}`}>{formatCurrency(r.value)}</span>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      {data.truncated ? <p className="text-sm text-ink-soft">These figures cover the first {MAX_CROPS_CHECKED} crops.</p> : null}
    </div>
  );
}

export function FarmerAnalyticsPage() {
  useDocumentTitle("Analytics");
  const query = useAsync((signal) => loadFarmerSnapshot(signal), []);
  return (
    <>
      <PageHeader title="Analytics" description="A summary of your own records across all farms, calculated from the data you have entered." />
      <QueryState query={query} label="Calculating…">
        {(data) =>
          data.counts.crops === 0 ? (
            <EmptyState icon={BarChart3} title="Nothing to analyse yet" description="Add crops and record their health, risks and finances, and the summaries appear here." action={<ButtonLink to="/app/farms">Go to farms</ButtonLink>} />
          ) : (
            <Analytics data={data} />
          )
        }
      </QueryState>
    </>
  );
}
