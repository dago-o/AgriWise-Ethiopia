import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight } from "lucide-react";
import { EmptyState } from "../../components/feedback/EmptyState.jsx";
import { QueryState } from "../../components/feedback/QueryState.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { RESOURCE_CATEGORIES, RESOURCE_TYPES, toOptions } from "../../lib/constants.js";
import { fetchResources } from "../../lib/endpoints.js";
import { entityId } from "../../lib/formatters.js";
import { ResourceMeta, ResourceTypeIcon } from "./ResourceMeta.jsx";

const categories = toOptions(RESOURCE_CATEGORIES);
const types = toOptions(RESOURCE_TYPES);

export function ResourcesPage() {
  useDocumentTitle("Learning resources");
  const [category, setCategory] = useState("");
  const [resourceType, setResourceType] = useState("");
  const query = useAsync((signal) => fetchResources({ category, resourceType }, { signal }), [category, resourceType]);
  const filtered = Boolean(category || resourceType);

  return (
    <>
      <PageHeader title="Learning resources" description="Guides, articles and videos published by AgriWise administrators." />

      <div className="mb-6 grid gap-4 sm:max-w-xl sm:grid-cols-2">
        <Select label="Topic" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All topics</option>
          {categories.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
        <Select label="Format" name="resourceType" value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
          <option value="">All formats</option>
          {types.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
      </div>

      <QueryState query={query} label="Loading resources…">
        {(resources) =>
          resources.length === 0 ? (
            <EmptyState icon={BookOpen} title={filtered ? "Nothing matches these filters" : "No resources published yet"} description={filtered ? "Try a different topic or format." : "Administrators have not published any learning resources yet."} />
          ) : (
            <ul className="divide-y divide-ivory-200 overflow-hidden rounded-xl border border-ivory-200 bg-white shadow-[var(--shadow-card)]">
              {resources.map((r) => (
                <li key={entityId(r)}>
                  <Link to={`/app/resources/${entityId(r)}`} className="group flex items-start gap-4 px-5 py-4 hover:bg-ivory-50 sm:px-6 sm:py-5">
                    <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-forest-50 text-forest-700"><ResourceTypeIcon type={r.resourceType} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-lg font-semibold text-forest-900">{r.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-sm text-ink-muted">{r.description}</p>
                      <div className="mt-2"><ResourceMeta resource={r} /></div>
                    </div>
                    <ChevronRight className="mt-3 h-[18px] w-[18px] shrink-0 text-ink-soft transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )
        }
      </QueryState>
    </>
  );
}
