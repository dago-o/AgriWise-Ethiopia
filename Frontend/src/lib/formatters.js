export const CURRENCY = "ETB";
export const AREA_UNIT = "ha";

const dateFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });
const dateTimeFmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const weekdayFmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });
const numFmt = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });

function toDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export const formatDate = (v) => (toDate(v) ? dateFmt.format(toDate(v)) : "—");
export const formatDateTime = (v) => (toDate(v) ? dateTimeFmt.format(toDate(v)) : "—");
export const formatWeekday = (v) => (toDate(v) ? weekdayFmt.format(toDate(v)) : "—");
export const formatNumber = (v) => (typeof v === "number" && !Number.isNaN(v) ? numFmt.format(v) : "—");

export function formatCurrency(amount, currency = CURRENCY) {
  const n = Number(amount);
  if (amount === null || amount === undefined || Number.isNaN(n)) return "—";
  return `${currency} ${numFmt.format(n)}`;
}

export function formatLabel(enumValue) {
  if (!enumValue) return "";
  return String(enumValue).replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

export function entityId(doc) {
  return doc?._id ?? doc?.id ?? "";
}

/** "2026-03-14T00:00:00.000Z" -> "2026-03-14" for <input type="date"> */
export function toDateInput(value) {
  const d = toDate(value);
  return d ? d.toISOString().slice(0, 10) : "";
}

export function todayInput() {
  return new Date().toISOString().slice(0, 10);
}
