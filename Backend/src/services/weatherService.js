import Farm from "../models/Farm.js";

const OPEN_METEO_GEOCODING_URL =
  "https://geocoding-api.open-meteo.com/v1/search";

const OPEN_METEO_WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast";


// Find the farmer's farm and verify ownership
const getFarmLocation = async (farmId, userId) => {
  const farm = await Farm.findOne({
    _id: farmId,
    owner: userId,
  });

  if (!farm) {
    throw new Error("Farm not found");
  }

  if (!farm.location) {
    throw new Error("Farm location is not available");
  }

  return farm.location;
};


// Convert farm location into latitude and longitude
const getCoordinates = async (location) => {
  const response = await fetch(
    `${OPEN_METEO_GEOCODING_URL}?name=${encodeURIComponent(
      location
    )}&count=1&language=en&format=json`
  );

  if (!response.ok) {
    throw new Error("Unable to find farm location");
  }

  const data = await response.json();

  if (!data.results || data.results.length === 0) {
    throw new Error("Farm location could not be found");
  }

  const { latitude, longitude, name, country } = data.results[0];

  return {
    latitude,
    longitude,
    locationName: name,
    country,
  };
};


// Current weather
export const getWeatherByFarmService = async (farmId, userId) => {
  const location = await getFarmLocation(farmId, userId);

  const coordinates = await getCoordinates(location);

  const response = await fetch(
    `${OPEN_METEO_WEATHER_URL}?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m`
  );

  if (!response.ok) {
    throw new Error("Unable to retrieve current weather");
  }

  const data = await response.json();

  return {
    location: coordinates.locationName,
    country: coordinates.country,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    currentWeather: data.current,
    units: data.current_units,
  };
};


// Weather forecast
export const getForecastByFarmService = async (farmId, userId) => {
  const location = await getFarmLocation(farmId, userId);

  const coordinates = await getCoordinates(location);

  const response = await fetch(
    `${OPEN_METEO_WEATHER_URL}?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,precipitation_probability_max,wind_speed_10m_max&forecast_days=5`
  );

  if (!response.ok) {
    throw new Error("Unable to retrieve weather forecast");
  }

  const data = await response.json();

  return {
    location: coordinates.locationName,
    country: coordinates.country,
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    forecast: data.daily,
    units: data.daily_units,
  };
};


// Agricultural weather alerts
export const getWeatherAlertsByFarmService = async (farmId, userId) => {
  const location = await getFarmLocation(farmId, userId);

  const coordinates = await getCoordinates(location);

  const response = await fetch(
    `${OPEN_METEO_WEATHER_URL}?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&current=temperature_2m,precipitation,rain,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&forecast_days=5`
  );

  if (!response.ok) {
    throw new Error("Unable to retrieve weather data for alerts");
  }

  const data = await response.json();

  const alerts = [];

  // High temperature alert
  if (data.current.temperature_2m >= 35) {
    alerts.push({
      type: "HIGH_TEMPERATURE",
      severity: "HIGH",
      message:
        "High temperature detected. Crops may experience heat stress. Check soil moisture and irrigation needs.",
    });
  }

  // Low temperature alert
  if (data.current.temperature_2m <= 5) {
    alerts.push({
      type: "LOW_TEMPERATURE",
      severity: "HIGH",
      message:
        "Low temperature detected. Sensitive crops may be affected by cold conditions.",
    });
  }

  // Strong wind alert
  if (data.current.wind_speed_10m >= 40) {
    alerts.push({
      type: "STRONG_WIND",
      severity: "HIGH",
      message:
        "Strong wind detected. Check crops and farm structures for possible damage.",
    });
  }

  // Heavy rain alert
  if (data.current.rain >= 10) {
    alerts.push({
      type: "HEAVY_RAIN",
      severity: "HIGH",
      message:
        "Heavy rain is currently occurring. Check drainage and avoid unnecessary field operations.",
    });
  }

  // Rain expected alert
  const maxRainProbability = Math.max(
    ...data.daily.precipitation_probability_max
  );

  if (maxRainProbability >= 70) {
    alerts.push({
      type: "RAIN_EXPECTED",
      severity: "MEDIUM",
      message:
        "High probability of rain is expected in the forecast period. Consider delaying irrigation and field activities when appropriate.",
    });
  }

  return {
    location: coordinates.locationName,
    country: coordinates.country,
    alerts,
  };
};