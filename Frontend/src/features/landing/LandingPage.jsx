import { ArrowRight, BookOpen, Bot, CloudSun, Coins, HeartPulse, Store, Tractor } from "lucide-react";
import { PublicHeader } from "../../components/layout/PublicHeader.jsx";
import { PublicFooter } from "../../components/layout/PublicFooter.jsx";
import { TerraceArt } from "../../components/layout/TerraceArt.jsx";
import { ButtonLink } from "../../components/ui/Button.jsx";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";

const features = [
  { icon: Tractor, title: "Farms, fields and crops", text: "Record each farm, divide it into fields, and follow every crop from planned to harvested." },
  { icon: HeartPulse, title: "Crop health and risks", text: "Log health status and growth stage as you walk the field, and note pests, disease, drought or weeds with a severity." },
  { icon: CloudSun, title: "Weather for your farm", text: "Current conditions, a five-day forecast and alerts for heat, cold, wind and rain, based on where your farm is." },
  { icon: Coins, title: "Costs, income and profit", text: "Add expenses and sales to each crop and see what the season has earned so far." },
  { icon: Store, title: "Market prices", text: "Look up reference prices by crop and market, and see how they have moved over time." },
  { icon: BookOpen, title: "Learning resources", text: "Articles, guides and videos on crop production, pests, soil, irrigation, harvesting and more." },
  { icon: Bot, title: "An assistant that reads your records", text: "Ask about a specific crop. Answers use that crop’s health records, risks, weather, costs and prices, and say so when something is missing." },
];

const steps = [
  { title: "Set up your land", text: "Add a farm, divide it into fields, and register what is planted in each one." },
  { title: "Keep records through the season", text: "Log health checks, risks, expenses and income as they happen." },
  { title: "Check conditions, then decide", text: "Review the weather and prices, read a guide, or ask the assistant about a crop." },
];

export function LandingPage() {
  useDocumentTitle();
  return (
    <div className="min-h-dvh bg-ivory-50">
      <section className="relative isolate overflow-hidden bg-forest-950">
        <TerraceArt className="absolute inset-0 -z-10 h-full w-full" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-forest-950/80 via-forest-950/25 to-transparent" aria-hidden="true" />
        <PublicHeader overlay />
        <div className="mx-auto flex min-h-[620px] max-w-6xl flex-col justify-center px-4 pb-24 pt-36 sm:px-6 lg:min-h-[700px]">
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.03] text-white sm:text-6xl lg:text-7xl">Know your fields. Plan every season.</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-forest-100">
            AgriWise-Ethiopia keeps your farms, crops, weather, costs and market prices in one place, and gives you an assistant that has read your own records.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink to="/register" variant="accent" size="lg">
              Create a farmer account
              <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink to="/login" variant="onDark" size="lg">Sign in</ButtonLink>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl scroll-mt-6 px-4 py-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[2fr_3fr]">
          <div className="lg:sticky lg:top-12 lg:self-start">
            <h2 className="text-3xl font-bold text-forest-900 sm:text-4xl">Everything a season asks of you, in one place</h2>
            <p className="mt-4 max-w-md text-ink-muted">Built around how farming actually runs: land first, then the crops on it, then the records, weather and money that follow.</p>
          </div>
          <ul className="divide-y divide-ivory-200 border-y border-ivory-200">
            {features.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-5 py-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-700">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-forest-900">{title}</h3>
                  <p className="mt-1 max-w-xl text-ink-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-6 bg-forest-50 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-forest-900 sm:text-4xl">How it works</h2>
          <ol className="mt-10 grid gap-10 md:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="border-t-2 border-forest-700 pt-5">
                <span className="text-sm font-semibold text-forest-600">Step {i + 1}</span>
                <h3 className="mt-2 text-xl font-semibold text-forest-900">{s.title}</h3>
                <p className="mt-2 text-ink-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-12 max-w-2xl text-ink-muted">
            <strong className="text-forest-900">For administrators.</strong> A separate console is used to publish learning resources and to review summaries across the platform.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="rounded-3xl bg-forest-900 px-8 py-14 sm:px-14">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Start with one farm.</h2>
            <p className="mt-3 text-forest-100">Create an account, add your first farm, and the rest of AgriWise builds on it.</p>
            <ButtonLink to="/register" variant="accent" size="lg" className="mt-7">
              Create a farmer account
              <ArrowRight className="h-[18px] w-[18px]" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
