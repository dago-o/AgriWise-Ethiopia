import { useState } from "react";
import { useParams } from "react-router-dom";
import { ExternalLink, PlayCircle } from "lucide-react";
import { QueryState } from "../../components/feedback/QueryState.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { useAuth } from "../../context/useAuth.js";
import { useAsync } from "../../hooks/useAsync.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { fetchResource } from "../../lib/endpoints.js";
import { formatDate } from "../../lib/formatters.js";
import { ResourceMeta } from "./ResourceMeta.jsx";

function safeUrl(value) {
  try {
    const u = new URL(value);
    return u.protocol === "http:" || u.protocol === "https:" ? u.href : null;
  } catch {
    return null;
  }
}

export function ResourceDetailPage() {
  const { resourceId } = useParams();
  const { isAdmin } = useAuth();
  const query = useAsync((signal) => fetchResource(resourceId, { signal }), [resourceId]);
  const [imageFailed, setImageFailed] = useState(false);
  useDocumentTitle(query.data?.title ?? "Resource");
  const back = isAdmin ? { to: "/admin/resources", label: "Manage resources" } : { to: "/app/resources", label: "All resources" };

  return (
    <QueryState query={query} label="Loading resource…">
      {(resource) => {
        const video = resource.videoUrl ? safeUrl(resource.videoUrl) : null;
        const image = resource.imageUrl && !imageFailed ? safeUrl(resource.imageUrl) : null;
        const source = resource.source ? safeUrl(resource.source) : null;
        return (
          <article className="mx-auto max-w-3xl">
            <PageHeader back={back} title={resource.title} description={resource.description} />
            <div className="mb-6"><ResourceMeta resource={resource} /></div>

            {image ? <img src={image} alt="" onError={() => setImageFailed(true)} referrerPolicy="no-referrer" className="mb-6 max-h-96 w-full rounded-2xl object-cover ring-1 ring-ivory-200" /> : null}

            {video ? (
              <a href={video} target="_blank" rel="noopener noreferrer" className="mb-6 inline-flex items-center gap-2 rounded-lg bg-forest-700 px-4 py-2 text-sm font-medium text-white hover:bg-forest-800">
                <PlayCircle className="h-4 w-4" />Watch the video<ExternalLink className="h-3.5 w-3.5" />
              </a>
            ) : null}

            {resource.content ? (
              <Card><div className="whitespace-pre-wrap text-[1.02rem] leading-relaxed">{resource.content}</div></Card>
            ) : !video ? (
              <p className="text-sm text-ink-soft">This resource has no body text.</p>
            ) : null}

            <p className="mt-6 text-sm text-ink-soft">
              Added {formatDate(resource.createdAt)}
              {resource.source ? <> · Source: {source ? <a className="text-forest-700 underline" href={source} target="_blank" rel="noopener noreferrer">{resource.source}</a> : resource.source}</> : null}
            </p>
          </article>
        );
      }}
    </QueryState>
  );
}
