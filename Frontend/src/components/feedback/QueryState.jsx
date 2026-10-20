import { Alert } from "./Alert.jsx";
import { LoadingScreen } from "./LoadingScreen.jsx";

/** Standard loading / error handling for a useAsync() result. Renders children(data) when ready. */
export function QueryState({ query, label, errorTitle = "We could not load this", children }) {
  if (query.loading && query.data === null) return <LoadingScreen label={label} />;
  if (query.error) {
    const hint =
      query.error.kind === "network" || query.error.kind === "unreachable"
        ? "Cannot reach the server"
        : query.error.kind === "forbidden"
          ? "You do not have access"
          : errorTitle;
    return (
      <Alert title={hint} onRetry={query.reload}>
        {query.error.message}
      </Alert>
    );
  }
  if (query.data === null) return null;
  return children(query.data);
}
