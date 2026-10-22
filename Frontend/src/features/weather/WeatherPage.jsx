import { Link, useSearchParams } from "react-router-dom";
import { CloudSun, Droplets, Thermometer, Tractor, Wind } from "lucide-react";
import { Alert } from "../../components/feedback/Alert.jsx";
import { EmptyState } from "../../components/feedback/EmptyState.jsx";
import { LoadingScreen } from "../../components/feedback/LoadingScreen.jsx";
import { QueryState } from "../../components/feedback/QueryState.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { Badge } from "../../components/ui/Badge.jsx";
import { ButtonLink } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { SEVERITY_TONE } from "../../lib/constants.js";
import { fetchFarms, fetchForecast, fetchWeather, fetchWeatherAlerts } from "../../lib/endpoints.js";
import { formatLabel, formatWeekday } from "../../lib/formatters.js";
import { describeWeather } from "./weatherCodes.js";

const num = (v) => (typeof v === "number" ? Math.round(v * 10) / 10 : "—");

function Section({ title, description, query, padded = true, children }) {
  return (
    <Card className={padded ? "" : "p-0"}>
      <div className={padded ? "mb-4" : "border-b border-ivory-200 px-5 py-4"}>
        <h2 className="text-base font-semibold text-forest-900">{title}</h2>
        {description ? <p className="text-sm text-ink-muted">{description}</p> : null}
      </div>
      <QueryState query={query} label="Fetching weather…">{children}</QueryState>
    </Card>
  );
}

export function WeatherPage() {
  useDocumentTitle("Weather");
  const [params, setParams] = useSearchParams();
  const farms = useAsync((signal) => fetchFarms({ signal }), []);
  const farmId = params.get("farm") || farms.data?.[0]?._id || "";
  const farm = farms.data?.find((f) => f._id === farmId);
  const enabled = Boolean(farmId);

  const current = useAsync((signal) => fetchWeather(farmId, { signal }), [farmId], { enabled });
  const forecast = useAsync((signal) => fetchForecast(farmId, { signal }), [farmId], { enabled });
  const alerts = useAsync((signal) => fetchWeatherAlerts(farmId, { signal }), [farmId], { enabled });

  const locationProblem = [current, forecast, alerts].some((q) => q.error && /location/i.test(q.error.message));

  return (
    <>
      <PageHeader title="Weather" description="Conditions, forecast and alerts for the area around your farm." />

      {farms.loading && !farms.data ? (
        <LoadingScreen label="Loading your farms…" />
      ) : farms.error ? (
        <Alert onRetry={farms.reload}>{farms.error.message}</Alert>
      ) : farms.data.length === 0 ? (
        <EmptyState icon={Tractor} title="Add a farm to see its weather" description="Weather is looked up from your farm’s location." action={<ButtonLink to="/app/farms">Go to farms</ButtonLink>} />
      ) : (
        <div className="space-y-6">
          <div className="max-w-sm">
            <Select label="Farm" name="farm" value={farmId} onChange={(e) => setParams({ farm: e.target.value }, { replace: true })}>
              {farms.data.map((f) => <option key={f._id} value={f._id}>{f.farmName} ({f.location})</option>)}
            </Select>
          </div>

          {locationProblem ? (
            <Alert variant="warning" title="The weather service could not find this farm’s location">
              Weather is looked up by the farm’s location name{farm ? <> (“{farm.location}”)</> : null}. Edit the farm and use the name of a nearby town or city.{" "}
              {farm ? <Link to={`/app/farms/${farm._id}`} className="font-semibold underline">Open farm</Link> : null}
            </Alert>
          ) : null}

          <Section title="Right now" description={current.data ? `${current.data.location}, ${current.data.country}` : undefined} query={current}>
            {(d) => {
              const c = d.currentWeather;
              const u = d.units ?? {};
              const w = describeWeather(c.weather_code);
              return (
                <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
                  <div className="flex items-center gap-4">
                    <span className="grid h-16 w-16 place-items-center rounded-2xl bg-harvest-50 text-harvest-600"><w.Icon className="h-9 w-9" aria-hidden="true" /></span>
                    <div>
                      <p className="font-display text-5xl font-bold leading-none text-forest-900">{num(c.temperature_2m)}{u.temperature_2m}</p>
                      <p className="mt-1 text-ink-muted">{w.label}</p>
                    </div>
                  </div>
                  <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
                    <div><dt className="flex items-center gap-1.5 text-ink-muted"><Thermometer className="h-3.5 w-3.5" />Feels like</dt><dd className="font-semibold">{num(c.apparent_temperature)}{u.apparent_temperature}</dd></div>
                    <div><dt className="flex items-center gap-1.5 text-ink-muted"><Droplets className="h-3.5 w-3.5" />Humidity</dt><dd className="font-semibold">{num(c.relative_humidity_2m)}{u.relative_humidity_2m}</dd></div>
                    <div><dt className="flex items-center gap-1.5 text-ink-muted"><Wind className="h-3.5 w-3.5" />Wind</dt><dd className="font-semibold">{num(c.wind_speed_10m)} {u.wind_speed_10m}</dd></div>
                    <div><dt className="flex items-center gap-1.5 text-ink-muted"><CloudSun className="h-3.5 w-3.5" />Rain now</dt><dd className="font-semibold">{num(c.rain)} {u.rain}</dd></div>
                  </dl>
                </div>
              );
            }}
          </Section>

          <Section title="Alerts" description="Checked against heat, cold, wind, heavy rain and rain expected in the next five days." query={alerts}>
            {(d) =>
              d.alerts.length === 0 ? (
                <p className="text-sm text-ink-muted">No weather alerts for this farm right now.</p>
              ) : (
                <ul className="space-y-3">
                  {d.alerts.map((a) => (
                    <li key={a.type} className="flex items-start gap-3 rounded-xl bg-ivory-50 p-4">
                      <Badge tone={SEVERITY_TONE[a.severity]}>{formatLabel(a.severity)}</Badge>
                      <div>
                        <p className="font-semibold text-ink">{formatLabel(a.type)}</p>
                        <p className="text-sm text-ink-muted">{a.message}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            }
          </Section>

          <Section title="Five-day forecast" query={forecast} padded={false}>
            {(d) => {
              const f = d.forecast;
              const u = d.units ?? {};
              return (
                <ul className="grid divide-y divide-ivory-200 sm:grid-cols-5 sm:divide-x sm:divide-y-0">
                  {f.time.map((day, i) => {
                    const w = describeWeather(f.weather_code[i]);
                    return (
                      <li key={day} className="flex items-center gap-4 px-5 py-4 sm:block sm:py-5 sm:text-center">
                        <p className="w-24 text-sm font-semibold text-ink sm:w-auto">{formatWeekday(day)}</p>
                        <w.Icon className="h-[26px] w-[26px] text-harvest-600 sm:mx-auto sm:my-3" aria-hidden="true" />
                        <div className="flex-1 sm:flex-none">
                          <p className="font-display text-lg font-bold">{num(f.temperature_2m_max[i])}° <span className="font-normal text-ink-soft">/ {num(f.temperature_2m_min[i])}{u.temperature_2m_min}</span></p>
                          <p className="text-sm text-ink-muted">{w.label}</p>
                          <p className="mt-1 text-xs text-ink-soft">Rain chance {num(f.precipitation_probability_max[i])}{u.precipitation_probability_max}</p>
                          <p className="text-xs text-ink-soft">{num(f.precipitation_sum[i])} {u.precipitation_sum} · wind {num(f.wind_speed_10m_max[i])} {u.wind_speed_10m_max}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              );
            }}
          </Section>
        </div>
      )}
    </>
  );
}
