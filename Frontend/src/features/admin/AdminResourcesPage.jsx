import { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { EmptyState } from "../../components/feedback/EmptyState.jsx";
import { QueryState } from "../../components/feedback/QueryState.jsx";
import { PageHeader } from "../../components/layout/PageHeader.jsx";
import { Button } from "../../components/ui/Button.jsx";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog.jsx";
import { IconButton } from "../../components/ui/IconButton.jsx";
import { useToast } from "../../context/useToast.js";
import { useAsync } from "../../hooks/useAsync.js";
import { useDocumentTitle } from "../../hooks/useDocumentTitle.js";
import { deleteResource, fetchResources } from "../../lib/endpoints.js";
import { entityId } from "../../lib/formatters.js";
import { ResourceMeta } from "../resources/ResourceMeta.jsx";
import { ResourceFormModal } from "./ResourceFormModal.jsx";

export function AdminResourcesPage() {
  useDocumentTitle("Resources");
  const toast = useToast();
  const query = useAsync((signal) => fetchResources({}, { signal }), []);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  return (
    <>
      <PageHeader
        title="Learning resources"
        description="Everything you publish here is visible to farmers. Drafts are only visible to administrators."
        actions={query.data?.length > 0 ? <Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" />Add resource</Button> : null}
      />

      <QueryState query={query} label="Loading resources…">
        {(resources) =>
          resources.length === 0 ? (
            <EmptyState icon={BookOpen} title="No resources yet" description="Publish guides, articles or videos for farmers to read." action={<Button onClick={() => setEditing("new")}><Plus className="h-4 w-4" />Add the first resource</Button>} />
          ) : (
            <ul className="divide-y divide-ivory-200 overflow-hidden rounded-xl border border-ivory-200 bg-white shadow-[var(--shadow-card)]">
              {resources.map((r) => (
                <li key={entityId(r)} className="flex items-start gap-3 px-5 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-forest-900">{r.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-sm text-ink-muted">{r.description}</p>
                    <div className="mt-2"><ResourceMeta resource={r} /></div>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Link to={`/admin/resources/${entityId(r)}`} aria-label="View resource" title="View resource" className="grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-ivory-100 hover:text-ink"><Eye className="h-4 w-4" /></Link>
                    <IconButton label="Edit resource" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></IconButton>
                    <IconButton label="Delete resource" tone="danger" onClick={() => setDeleting(r)}><Trash2 className="h-4 w-4" /></IconButton>
                  </div>
                </li>
              ))}
            </ul>
          )
        }
      </QueryState>

      <ResourceFormModal
        open={editing !== null}
        onClose={() => setEditing(null)}
        resource={editing && editing !== "new" ? editing : null}
        onSaved={() => { toast.success(editing === "new" ? "Resource added." : "Resource updated."); query.reload(); }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Delete this resource?"
        message={deleting ? `“${deleting.title}” will be permanently deleted.` : ""}
        onConfirm={async () => { await deleteResource(entityId(deleting)); toast.success("Resource deleted."); query.reload(); }}
      />
    </>
  );
}
