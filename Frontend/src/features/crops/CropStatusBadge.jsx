import { Badge } from "../../components/ui/Badge.jsx";
import { CROP_STATUS_TONE } from "../../lib/constants.js";
import { formatLabel } from "../../lib/formatters.js";

export function CropStatusBadge({ status }) {
  return <Badge tone={CROP_STATUS_TONE[status] ?? "neutral"}>{formatLabel(status)}</Badge>;
}
