import { Spinner } from "../ui/Spinner.jsx";

export function LoadingScreen({ label = "Loading…" }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-ink-muted">
      <Spinner className="h-8 w-8" label={label} />
      <p className="text-sm" aria-hidden="true">{label}</p>
    </div>
  );
}
