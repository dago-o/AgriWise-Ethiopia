import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, CloudSun, Sun } from "lucide-react";

// WMO weather interpretation codes, as returned by Open-Meteo (`weather_code`).
const table = [
  [[0], "Clear sky", Sun],
  [[1, 2], "Partly cloudy", CloudSun],
  [[3], "Overcast", Cloud],
  [[45, 48], "Fog", CloudFog],
  [[51, 53, 55, 56, 57], "Drizzle", CloudDrizzle],
  [[61, 63, 65, 66, 67, 80, 81, 82], "Rain", CloudRain],
  [[71, 73, 75, 77, 85, 86], "Snow", CloudSnow],
  [[95, 96, 99], "Thunderstorm", CloudLightning],
];

export function describeWeather(code) {
  const hit = table.find(([codes]) => codes.includes(code));
  return hit ? { label: hit[1], Icon: hit[2] } : { label: "Unknown conditions", Icon: Cloud };
}
