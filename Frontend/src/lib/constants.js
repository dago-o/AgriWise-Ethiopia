// Mirrors the Mongoose enums in Backend/src/models. Keep in sync with the backend.
export const CROP_STATUSES = ["PLANNED", "PLANTED", "GROWING", "HARVESTED"];
export const HEALTH_STATUSES = ["HEALTHY", "WARNING", "CRITICAL"];
export const GROWTH_STAGES = ["SEEDLING", "VEGETATIVE", "FLOWERING", "FRUITING", "MATURITY"];
export const RISK_TYPES = ["PEST", "DISEASE", "DROUGHT", "WEED", "NUTRIENT_DEFICIENCY", "OTHER"];
export const SEVERITIES = ["LOW", "MEDIUM", "HIGH"];
export const EXPENSE_CATEGORIES = [
  "SEED", "FERTILIZER", "PESTICIDE", "LABOR", "IRRIGATION", "TRANSPORT", "EQUIPMENT", "OTHER",
];
export const RESOURCE_TYPES = ["ARTICLE", "GUIDE", "VIDEO", "OTHER"];
export const RESOURCE_CATEGORIES = [
  "CROP_PRODUCTION", "PEST_MANAGEMENT", "DISEASE_MANAGEMENT", "SOIL_MANAGEMENT",
  "IRRIGATION", "FERTILIZER", "WEATHER", "HARVESTING", "POST_HARVEST", "MARKET", "GENERAL",
];

// Badge tones (see components/ui/Badge.jsx)
export const HEALTH_TONE = { HEALTHY: "success", WARNING: "warning", CRITICAL: "danger" };
export const SEVERITY_TONE = { LOW: "success", MEDIUM: "warning", HIGH: "danger" };
export const CROP_STATUS_TONE = { PLANNED: "neutral", PLANTED: "default", GROWING: "success", HARVESTED: "warning" };

export const toOptions = (values) => values.map((value) => ({ value, label: value.replace(/_/g, " ").toLowerCase().replace(/^\w/, (c) => c.toUpperCase()) }));
