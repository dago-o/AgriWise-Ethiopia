import { useMemo, useState } from "react";
import { Store } from "lucide-react";
import { EmptyState } from "../../components/feedback/EmptyState.jsx";
import { QueryState } from "../../components/feedback/QueryState.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { SimpleLineChart } from "../../components/ui/SimpleLineChart.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { fetchMarketPrices } from "../../lib/endpoints.js";
import { PriceTable } from "./PriceTable.jsx";

function Prices({ prices }) {
  const [crop, setCrop] = useState("");
  const [market, setMarket] = useState("");

  const crops = useMemo(() => [...new Set(prices.map((p) => p.cropName))].sort(), [prices]);
  const markets = useMemo(() => [...new Set(prices.map((p) => p.marketName))].sort(), [prices]);
  const filtered = useMemo(() => prices.filter((p) => (!crop || p.cropName === crop) && (!market || p.marketName === market)), [prices, crop, market]);

  // Trend: only for one crop and only for prices in the same unit (never mix quintal and kg).
  const unit = filtered[0]?.unit;
  const trend = crop ? filtered.filter((p) => p.unit === unit) : [];
  const points = trend.map((p) => ({ date: new Date(p.recordedAt).toISOString().slice(0, 10), series: p.marketName, value: p.price }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:max-w-xl sm:grid-cols-2">
        <Select label="Crop" name="crop" value={crop} onChange={(e) => setCrop(e.target.value)}>
          <option value="">All crops</option>
          {crops.map((c) => <option key={c} value={c}>{c}</option>)}
        </Select>
        <Select label="Market" name="market" value={market} onChange={(e) => setMarket(e.target.value)}>
          <option value="">All markets</option>
          {markets.map((m) => <option key={m} value={m}>{m}</option>)}
        </Select>
      </div>

      {crop && points.length >= 2 ? (
        <Card>
          <h2 className="text-base font-semibold text-forest-900">{crop}: recorded prices over time</h2>
          <p className="mb-4 text-sm text-ink-muted">Each point is a price an administrator recorded (per {unit}).</p>
          <SimpleLineChart points={points} unit={unit} />
        </Card>
      ) : null}

      <Card className="p-0">
        {filtered.length === 0 ? <p className="px-5 py-10 text-center text-sm text-ink-soft">No prices match these filters.</p> : <PriceTable prices={filtered} />}
      </Card>
    </div>
  );
}

export function MarketPricesPage() {
  useDocumentTitle("Market prices");
  const query = useAsync((signal) => fetchMarketPrices({ signal }), []);

  return (
    <>
      <PageHeader title="Market prices" description="Reference prices published by AgriWise administrators, newest first." />
      <QueryState query={query} label="Loading prices…">
        {(prices) =>
          prices.length === 0 ? (
            <EmptyState icon={Store} title="No prices published yet" description="Administrators have not added any market prices. Check back later." />
          ) : (
            <Prices prices={prices} />
          )
        }
      </QueryState>
    </>
  );
}
