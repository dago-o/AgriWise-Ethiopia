import {
  deleteCrop, deleteCropHealth, deleteCropRisk, deleteExpense, deleteIncome,
  fetchCrops, fetchCropHealthRecords, fetchCropRisks, fetchEconomicSummary,
  fetchExpenses, fetchFarms, fetchFields, fetchIncome,
} from "./endpoints.js";

export const MAX_CROPS_CHECKED = 40;

const settle = async (promise, fallback) => {
  try {
    return { value: await promise, failed: false };
  } catch (err) {
    if (err?.kind === "auth") throw err; // let the session guard handle it
    return { value: fallback, failed: true };
  }
};

/**
 * The backend has no "my dashboard" endpoint, so a farmer snapshot is composed from the same
 * endpoints the rest of the app uses: farms -> fields -> crops -> latest health, risks and profit.
 * Used by the dashboard and the analytics page.
 */
export async function loadFarmerSnapshot(signal) {
  const opts = { signal };
  const farms = await fetchFarms(opts);
  let partial = false;

  const fieldResults = await Promise.all(farms.map((f) => settle(fetchFields(f._id, opts), [])));
  const fields = fieldResults.flatMap((r, i) => r.value.map((field) => ({ ...field, farmName: farms[i].farmName })));
  partial ||= fieldResults.some((r) => r.failed);

  const cropResults = await Promise.all(fields.map((f) => settle(fetchCrops(f._id, opts), [])));
  const crops = cropResults.flatMap((r, i) => r.value.map((crop) => ({ ...crop, fieldName: fields[i].fieldName, farmName: fields[i].farmName })));
  partial ||= cropResults.some((r) => r.failed);

  const details = await Promise.all(
    crops.slice(0, MAX_CROPS_CHECKED).map(async (crop) => {
      const [health, risks, summary] = await Promise.all([
        settle(fetchCropHealthRecords(crop._id, opts), []),
        settle(fetchCropRisks(crop._id, opts), []),
        settle(fetchEconomicSummary(crop._id, opts), null),
      ]);
      partial ||= health.failed || risks.failed || summary.failed;
      return { crop, latestHealth: health.value[0] ?? null, risks: risks.value, summary: summary.value };
    }),
  );

  const totals = details.reduce(
    (acc, d) => (d.summary ? { income: acc.income + d.summary.totalIncome, expenses: acc.expenses + d.summary.totalExpenses } : acc),
    { income: 0, expenses: 0 },
  );

  return {
    counts: { farms: farms.length, fields: fields.length, crops: crops.length },
    farms,
    details,
    attention: details.filter((d) => (d.latestHealth && d.latestHealth.healthStatus !== "HEALTHY") || d.risks.some((r) => r.severity === "HIGH")),
    totals: { ...totals, profit: totals.income - totals.expenses },
    truncated: crops.length > MAX_CROPS_CHECKED,
    partial,
  };
}

/**
 * The backend deletes only the crop document, so its health, risk, expense and income records
 * would be left behind (and still counted in admin analytics). Remove them first, then the crop.
 */
export async function deleteCropWithRecords(cropId) {
  const [health, risks, expenses, income] = await Promise.all([
    fetchCropHealthRecords(cropId),
    fetchCropRisks(cropId),
    fetchExpenses(cropId),
    fetchIncome(cropId),
  ]);
  await Promise.all([
    ...health.map((r) => deleteCropHealth(r._id)),
    ...risks.map((r) => deleteCropRisk(r._id)),
    ...expenses.map((r) => deleteExpense(r._id)),
    ...income.map((r) => deleteIncome(r._id)),
  ]);
  await deleteCrop(cropId);
}
