import { formatDate, formatNumber } from "../../lib/formatters.js";

export function PriceTable({ prices, renderActions }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b border-ivory-200 bg-forest-50/60 text-ink-muted">
          <tr>
            <th className="px-5 py-3 font-medium">Crop</th>
            <th className="px-5 py-3 font-medium">Market</th>
            <th className="px-5 py-3 text-right font-medium">Price</th>
            <th className="px-5 py-3 font-medium">Recorded</th>
            {renderActions ? <th className="px-5 py-3"><span className="sr-only">Actions</span></th> : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-ivory-100">
          {prices.map((p) => (
            <tr key={p._id} className="align-top">
              <td className="px-5 py-3.5 font-semibold text-forest-900">{p.cropName}</td>
              <td className="px-5 py-3.5">{p.marketName}<span className="block text-xs text-ink-soft">{p.location}</span></td>
              <td className="px-5 py-3.5 text-right font-semibold tabular-nums">{formatNumber(p.price)} <span className="font-normal text-ink-soft">/ {p.unit}</span></td>
              <td className="px-5 py-3.5 text-ink-muted">{formatDate(p.recordedAt)}{p.notes ? <span className="block text-xs text-ink-soft">{p.notes}</span> : null}</td>
              {renderActions ? <td className="px-5 py-3.5">{renderActions(p)}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
