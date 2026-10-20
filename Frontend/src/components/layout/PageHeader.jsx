import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export function PageHeader({ title, description, actions, back }) {
  return (
    <div className="mb-8">
      {back ? (
        <Link to={back.to} className="mb-3 inline-flex items-center gap-1 text-sm font-medium text-ink-soft hover:text-forest-700">
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {back.label}
        </Link>
      ) : null}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-forest-900 sm:text-3xl">{title}</h1>
          {description ? <p className="mt-1.5 max-w-2xl text-sm text-ink-muted sm:text-[0.95rem]">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}
