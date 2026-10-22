import { useState } from "react";
import { Modal } from "../../components/ui/Modal.jsx";
import { FormFooter } from "../../components/ui/FormFooter.jsx";
import { Checkbox } from "../../components/ui/Checkbox.jsx";
import { Input } from "../../components/ui/Input.jsx";
import { Select } from "../../components/ui/Select.jsx";
import { Textarea } from "../../components/ui/Textarea.jsx";
import { useSubmit } from "../../hooks/useSubmit.js";
import { RESOURCE_CATEGORIES, RESOURCE_TYPES, toOptions } from "../../lib/constants.js";
import { createResource, updateResource } from "../../lib/endpoints.js";

const types = toOptions(RESOURCE_TYPES);
const categories = toOptions(RESOURCE_CATEGORIES);

function ResourceForm({ resource, onCancel, onSaved }) {
  const [form, setForm] = useState({
    title: resource?.title ?? "",
    description: resource?.description ?? "",
    resourceType: resource?.resourceType ?? "ARTICLE",
    category: resource?.category ?? "GENERAL",
    cropName: resource?.cropName ?? "GENERAL",
    content: resource?.content ?? "",
    videoUrl: resource?.videoUrl ?? "",
    imageUrl: resource?.imageUrl ?? "",
    source: resource?.source ?? "",
    published: resource?.published ?? true,
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const { busy, error, submit } = useSubmit(async () => {
    const body = {
      title: form.title.trim(),
      description: form.description.trim(),
      resourceType: form.resourceType,
      category: form.category,
      cropName: form.cropName.trim() || "GENERAL",
      content: form.content.trim(),
      videoUrl: form.videoUrl.trim(),
      imageUrl: form.imageUrl.trim(),
      source: form.source.trim(),
      published: form.published,
    };
    const saved = resource ? await updateResource(resource._id, body) : await createResource(body);
    onSaved(saved);
  });

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input label="Title" name="title" required value={form.title} onChange={set("title")} />
      <Textarea label="Short description" name="description" required rows={2} value={form.description} onChange={set("description")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select label="Format" name="resourceType" value={form.resourceType} onChange={set("resourceType")}>
          {types.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
        <Select label="Topic" name="category" value={form.category} onChange={set("category")}>
          {categories.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </Select>
      </div>
      <Input label="Crop" name="cropName" value={form.cropName} onChange={set("cropName")} hint="Use GENERAL if it applies to all crops." />
      <Textarea label="Content" name="content" rows={7} value={form.content} onChange={set("content")} hint="Optional. Shown as plain text." />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Video link" name="videoUrl" type="url" value={form.videoUrl} onChange={set("videoUrl")} hint="Optional" />
        <Input label="Image link" name="imageUrl" type="url" value={form.imageUrl} onChange={set("imageUrl")} hint="Optional" />
      </div>
      <Input label="Source" name="source" value={form.source} onChange={set("source")} hint="Optional: author, organisation or link" />
      <Checkbox label="Published" hint="Farmers only see published resources." checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />
      <FormFooter busy={busy} error={error} onCancel={onCancel} submitLabel={resource ? "Save changes" : "Add resource"} />
    </form>
  );
}

export function ResourceFormModal({ open, onClose, resource, onSaved }) {
  return (
    <Modal open={open} onClose={onClose} title={resource ? "Edit resource" : "Add a resource"} size="lg">
      <ResourceForm resource={resource} onCancel={onClose} onSaved={(r) => { onSaved?.(r); onClose(); }} />
    </Modal>
  );
}
