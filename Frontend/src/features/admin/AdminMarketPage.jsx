import { useState } from "react";
import { Pencil, Plus, ShieldOff, Store, Trash2 } from "lucide-react";
import { Alert } from "../../components/feedback/Alert.jsx";
import { EmptyState } from "../../components/feedback/EmptyState.jsx";
import { LoadingScreen } from "../../components/feedback/LoadingScreen.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { Card } from "../../components/ui/Card.jsx";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog.jsx";
import { IconButton } from "../../components/ui/IconButton.jsx";
import { useToast } from "../../context/useToast.js";
import { useAsync } from "../../hooks/useAsync.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { deleteMarketPrice, fetchMarketPrices } from "../../lib/endpoints.js";
import { PriceTable } from "../market/PriceTable.jsx";
import { MarketPriceFormModal } from "./MarketPriceFormModal.jsx";

export function AdminMarketPage() {
  useDocumentTitle("Market prices");
  const toast = useToast();
  const query = useAsync((signal) => fetchMarketPrices({ signal }), []);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const prices = query.data;

  // The backend guards these routes with the role "administrator", but accounts have the role "admin".
  if (query.error?.kind === "forbidden") {
    return (
      <>
        <PageHeader title="Market prices" description="Publish reference prices that farmers can see." />
        <Card>
          <div className="flex items-start gap-4">
            <ShieldOff className="mt-1 h-[22px] w-[22px] shrink-0 text-harvest-600" />
            <div>
              <h2 className="text-lg font-semibold text-forest-900">The server is blocking this page</h2>
              <p className="mt-1 text-ink-muted">
                The market-price routes in the backend only accept the role <code className="rounded bg-ivory-100 px-1">administrator</code>, but admin accounts have the role{" "}
                <code className="rounded bg-ivory-100 px-1">admin</code>. This is a one-word backend fix, described in <code className="rounded bg-ivory-100 px-1">docs/BACKEND_NOTES.md</code>. Once it is applied, this page works with no frontend change.
              </p>
              <Button variant="secondary" size="sm" className="mt-4" onClick={query.reload}>Check again</Button>
            </div>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Market prices"
        description="Reference prices farmers can see on their Market prices page."
        actions={prices?.length > 0 ? <Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" />Add price</Button> : null}
      />

      {query.loading && !prices ? (
        <LoadingScreen label="Loading prices…" />
      ) : query.error ? (
        <Alert onRetry={query.reload}>{query.error.message}</Alert>
      ) : prices.length === 0 ? (
        <EmptyState icon={Store} title="No prices yet" description="Record what a crop sells for in a market, so farmers can compare." action={<Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" />Add the first price</Button>} />
      ) : (
        <>
          <Alert variant="info" className="mb-5">Prices are recorded one entry at a time. Add a new entry each time a price changes, to build the history farmers see in the chart.</Alert>
          <Card className="p-0">
            <PriceTable
              prices={prices}
              renderActions={(p) => (
                <div className="flex justify-end gap-1">
                  <IconButton label="Edit price" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></IconButton>
                  <IconButton label="Delete price" tone="danger" onClick={() => setDeleting(p)}><Trash2 className="h-4 w-4" /></IconButton>
                </div>
              )}
            />
          </Card>
        </>
      )}

      <MarketPriceFormModal
        open={editing !== null}
        onClose={() => setEditing(null)}
        price={editing && editing !== "new" ? editing : null}
        onSaved={() => { toast.success(editing === "new" ? "Price added." : "Price updated."); query.reload(); }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete this price?"
        message="This price entry will be permanently deleted."
        onConfirm={async () => { await deleteMarketPrice(deleting._id); toast.success("Price deleted."); query.reload(); }}
      />
    </>
  );
}
