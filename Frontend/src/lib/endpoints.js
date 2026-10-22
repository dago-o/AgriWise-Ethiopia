import { apiDelete, apiGet, apiPost, apiPut, unwrapEntity, unwrapList } from "./apiClient.js";
import { parseLoginResponse, parseRegisterResponse } from "./authSession.js";

// Every function takes an optional last argument `opts` ({ signal }) so requests can be cancelled.
// Routes and response keys are taken from Backend/src/routes and controllers (see docs/API_CONTRACT.md).

/* ---------- auth ---------- */
const normalizeEmail = (email) => String(email).trim().toLowerCase();

export async function login(credentials, opts) {
  const data = await apiPost("/auth/login", { email: normalizeEmail(credentials.email), password: credentials.password }, { ...opts, auth: false });
  return parseLoginResponse(data);
}

export async function register(payload, opts) {
  const data = await apiPost(
    "/auth/register",
    { name: String(payload.name).trim(), email: normalizeEmail(payload.email), password: payload.password },
    { ...opts, auth: false },
  );
  return parseRegisterResponse(data);
}

/* ---------- farms ---------- */
export async function fetchFarms(opts) {
  return unwrapList(await apiGet("/farm", opts), ["farms"]);
}
export async function fetchFarm(id, opts) {
  return unwrapEntity(await apiGet(`/farm/${id}`, opts), "farm");
}
export async function createFarm(body, opts) {
  return unwrapEntity(await apiPost("/farm", body, opts), "farm");
}
export async function updateFarm(id, body, opts) {
  return unwrapEntity(await apiPut(`/farm/${id}`, body, opts), "farm");
}
export async function deleteFarm(id, opts) {
  return apiDelete(`/farm/${id}`, opts);
}

/* ---------- fields ---------- */
export async function fetchFields(farmId, opts) {
  return unwrapList(await apiGet(`/field/farm/${farmId}/fields`, opts), ["fields"]);
}
/** `farm` comes back populated (an object). */
export async function fetchField(id, opts) {
  return unwrapEntity(await apiGet(`/field/${id}`, opts), "field");
}
export async function createField(farmId, body, opts) {
  return unwrapEntity(await apiPost(`/field/farm/${farmId}/fields`, body, opts), "field");
}
export async function updateField(id, body, opts) {
  return unwrapEntity(await apiPut(`/field/${id}`, body, opts), "field");
}
export async function deleteField(id, opts) {
  return apiDelete(`/field/${id}`, opts);
}

/* ---------- crops ---------- */
export async function fetchCrops(fieldId, opts) {
  return unwrapList(await apiGet(`/crop/field/${fieldId}/crops`, opts), ["crops"]);
}
/** `field` comes back populated, and `field.farm` too. */
export async function fetchCrop(id, opts) {
  return unwrapEntity(await apiGet(`/crop/${id}`, opts), "crop");
}
export async function createCrop(fieldId, body, opts) {
  return unwrapEntity(await apiPost(`/crop/field/${fieldId}/crops`, body, opts), "crop");
}
export async function updateCrop(id, body, opts) {
  return unwrapEntity(await apiPut(`/crop/${id}`, body, opts), "crop");
}
export async function deleteCrop(id, opts) {
  return apiDelete(`/crop/${id}`, opts);
}

/* ---------- crop health (newest first) ---------- */
export async function fetchCropHealthRecords(cropId, opts) {
  return unwrapList(await apiGet(`/crop-health/crop/${cropId}/health`, opts), ["cropHealth"]);
}
export async function createCropHealth(cropId, body, opts) {
  return unwrapEntity(await apiPost(`/crop-health/crop/${cropId}/health`, body, opts), "cropHealth");
}
export async function updateCropHealth(id, body, opts) {
  return unwrapEntity(await apiPut(`/crop-health/${id}`, body, opts), "cropHealth");
}
export async function deleteCropHealth(id, opts) {
  return apiDelete(`/crop-health/${id}`, opts);
}

/* ---------- crop risks ---------- */
export async function fetchCropRisks(cropId, opts) {
  return unwrapList(await apiGet(`/crop-risk/crop/${cropId}/risks`, opts), ["cropRisk"]);
}
export async function createCropRisk(cropId, body, opts) {
  return unwrapEntity(await apiPost(`/crop-risk/crop/${cropId}/risks`, body, opts), "cropRisk");
}
export async function updateCropRisk(id, body, opts) {
  return unwrapEntity(await apiPut(`/crop-risk/${id}`, body, opts), "cropRisk");
}
export async function deleteCropRisk(id, opts) {
  return apiDelete(`/crop-risk/${id}`, opts);
}

/* ---------- weather (the backend geocodes the farm's free-text location) ---------- */
const WEATHER_OPTS = { timeoutMs: 30000 };
export async function fetchWeather(farmId, opts) {
  return unwrapEntity(await apiGet(`/weather/farm/${farmId}`, { ...WEATHER_OPTS, ...opts }), "weatherDetail");
}
export async function fetchForecast(farmId, opts) {
  return unwrapEntity(await apiGet(`/weather/farm/${farmId}/forecast`, { ...WEATHER_OPTS, ...opts }), "forecastDetail");
}
export async function fetchWeatherAlerts(farmId, opts) {
  return unwrapEntity(await apiGet(`/weather/farm/${farmId}/alerts`, { ...WEATHER_OPTS, ...opts }), "alertsDetail");
}

/* ---------- economics ---------- */
export async function fetchExpenses(cropId, opts) {
  return unwrapList(await apiGet(`/economics/crop/${cropId}/expenses`, opts), ["expenses"]);
}
export async function createExpense(cropId, body, opts) {
  return unwrapEntity(await apiPost(`/economics/crop/${cropId}/expenses`, body, opts), "expense");
}
export async function updateExpense(id, body, opts) {
  return unwrapEntity(await apiPut(`/economics/expenses/${id}`, body, opts), "expense");
}
export async function deleteExpense(id, opts) {
  return apiDelete(`/economics/expenses/${id}`, opts);
}
export async function fetchIncome(cropId, opts) {
  return unwrapList(await apiGet(`/economics/crop/${cropId}/income`, opts), ["income"]);
}
export async function createIncome(cropId, body, opts) {
  return unwrapEntity(await apiPost(`/economics/crop/${cropId}/income`, body, opts), "income");
}
export async function updateIncome(id, body, opts) {
  return unwrapEntity(await apiPut(`/economics/income/${id}`, body, opts), "income");
}
export async function deleteIncome(id, opts) {
  return apiDelete(`/economics/income/${id}`, opts);
}
/** { totalExpenses, totalIncome, profit } */
export async function fetchEconomicSummary(cropId, opts) {
  return unwrapEntity(await apiGet(`/economics/crop/${cropId}/summary`, opts), "summary");
}

/* ---------- market prices (GET: farmer; write: see docs/BACKEND_NOTES.md about the role name) ---------- */
export async function fetchMarketPrices(opts) {
  return unwrapList(await apiGet("/market-prices", opts), ["marketPrices"]);
}
export async function createMarketPrice(body, opts) {
  return unwrapEntity(await apiPost("/market-prices", body, opts), "marketPrice");
}
export async function updateMarketPrice(id, body, opts) {
  return unwrapEntity(await apiPut(`/market-prices/${id}`, body, opts), "marketPrice");
}
export async function deleteMarketPrice(id, opts) {
  return apiDelete(`/market-prices/${id}`, opts);
}

/* ---------- learning resources (farmers only receive published items) ---------- */
export async function fetchResources(filters = {}, opts) {
  const qs = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => v && qs.set(k, v));
  const query = qs.toString();
  return unwrapList(await apiGet(`/resources${query ? `?${query}` : ""}`, opts), ["resources"]);
}
export async function fetchResource(id, opts) {
  return unwrapEntity(await apiGet(`/resources/${id}`, opts), "resource");
}
export async function createResource(body, opts) {
  return unwrapEntity(await apiPost("/resources", body, opts), "resource");
}
export async function updateResource(id, body, opts) {
  return unwrapEntity(await apiPut(`/resources/${id}`, body, opts), "resource");
}
export async function deleteResource(id, opts) {
  return apiDelete(`/resources/${id}`, opts);
}

/* ---------- admin + AI ---------- */
export async function fetchAdminDashboard(opts) {
  return unwrapEntity(await apiGet("/admin/dashboard", opts), "dashboard");
}
export async function askAi(cropId, question, opts) {
  return unwrapEntity(await apiPost("/ai/ask", { cropId, question }, { timeoutMs: 90000, ...opts }), "result");
}
