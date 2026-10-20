import { useAsync } from "../../hooks/useAsync.js";
import { pingBackend } from "../../lib/apiClient.js";
import { Alert } from "./Alert.jsx";

/** Checks once whether the backend answers at all, so "server down" is never confused with "wrong password". */
export function ConnectionBanner() {
  const { data, loading, reload } = useAsync((signal) => pingBackend(signal), []);
  if (loading || !data || data.ok) return null;
  return (
    <Alert variant="warning" title="The AgriWise server is not responding" onRetry={reload} className="mb-5">
      {data.reason}
    </Alert>
  );
}
