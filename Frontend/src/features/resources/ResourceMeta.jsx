import { BookOpen, FileText, PlayCircle } from "lucide-react";
import { Badge } from "../../components/ui/Badge.jsx";
import { formatLabel } from "../../lib/formatters.js";

const icons = { ARTICLE: FileText, GUIDE: BookOpen, VIDEO: PlayCircle, OTHER: FileText };

export function ResourceTypeIcon({ type, className = "h-5 w-5" }) {
  const Icon = icons[type] ?? FileText;
  return <Icon className={className} aria-hidden="true" />;
}

export function ResourceMeta({ resource }) {
  return (
    <span className="flex flex-wrap items-center gap-2">
      <Badge>{formatLabel(resource.resourceType)}</Badge>
      <Badge tone="neutral">{formatLabel(resource.category)}</Badge>
      {resource.cropName && resource.cropName !== "GENERAL" ? <Badge tone="success">{resource.cropName}</Badge> : null}
      {resource.published === false ? <Badge tone="warning">Draft</Badge> : null}
    </span>
  );
}
