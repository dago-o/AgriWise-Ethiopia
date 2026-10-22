import { useEffect, useState } from "react";
import { Select } from "../../components/ui/Select.jsx";
import { useAsync } from "../../hooks/useAsync.js";
import { fetchCrop, fetchCrops, fetchFarms, fetchFields } from "../../lib/endpoints.js";

/**
 * Farm → Field → Crop selector. The backend has no "list all crops" endpoint, so crops are reached
 * through their field. `cropId` is controlled by the parent (usually the ?crop= URL param); when it is
 * set on arrival the farm and field are derived from the crop itself.
 */
export function CropPicker({ cropId, onChange }) {
  const [chosen, setChosen] = useState({ farm: null, field: null });

  const current = useAsync((signal) => fetchCrop(cropId, { signal }), [cropId], { enabled: Boolean(cropId) });
  const farms = useAsync((signal) => fetchFarms({ signal }), []);

  const farmId = chosen.farm ?? current.data?.field?.farm?._id ?? (farms.data?.length === 1 ? farms.data[0]._id : "");
  const fields = useAsync((signal) => fetchFields(farmId, { signal }), [farmId], { enabled: Boolean(farmId) });

  const fieldId = chosen.field ?? current.data?.field?._id ?? (fields.data?.length === 1 ? fields.data[0]._id : "");
  const crops = useAsync((signal) => fetchCrops(fieldId, { signal }), [fieldId], { enabled: Boolean(fieldId) });

  // A single crop in the chosen field is selected for you.
  const onlyCropId = !cropId && crops.data?.length === 1 ? crops.data[0]._id : null;
  useEffect(() => {
    if (onlyCropId) onChange(onlyCropId);
  }, [onlyCropId, onChange]);

  const farmList = farms.data ?? [];
  const fieldList = farmId ? fields.data ?? [] : [];
  const cropList = fieldId ? crops.data ?? [] : [];

  return (
    <div className="grid gap-4 rounded-[var(--radius-card)] border border-ivory-200 bg-white p-5 shadow-[var(--shadow-card)] md:grid-cols-3">
      <Select
        label="Farm"
        name="pick-farm"
        value={farmId}
        disabled={farms.loading || farmList.length === 0}
        onChange={(e) => { setChosen({ farm: e.target.value, field: "" }); onChange(""); }}
        hint={!farms.loading && farmList.length === 0 ? "Add a farm first." : undefined}
      >
        <option value="">Choose a farm</option>
        {farmList.map((f) => <option key={f._id} value={f._id}>{f.farmName}</option>)}
      </Select>
      <Select
        label="Field"
        name="pick-field"
        value={fieldId}
        disabled={!farmId || fields.loading}
        onChange={(e) => { setChosen((c) => ({ ...c, field: e.target.value })); onChange(""); }}
        hint={farmId && !fields.loading && fieldList.length === 0 ? "This farm has no fields yet." : undefined}
      >
        <option value="">Choose a field</option>
        {fieldList.map((f) => <option key={f._id} value={f._id}>{f.fieldName}</option>)}
      </Select>
      <Select
        label="Crop"
        name="pick-crop"
        value={cropId || ""}
        disabled={!fieldId || crops.loading}
        onChange={(e) => onChange(e.target.value)}
        hint={fieldId && !crops.loading && cropList.length === 0 ? "This field has no crops yet." : undefined}
      >
        <option value="">Choose a crop</option>
        {cropList.map((c) => <option key={c._id} value={c._id}>{c.cropName}</option>)}
      </Select>
    </div>
  );
}
