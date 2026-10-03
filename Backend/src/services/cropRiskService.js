import CropRisk from "../models/CropRisk.js";
import Crop from "../models/Crop.js";

const verifyCropOwnership = async (cropId, userId) => {
  const crop = await Crop.findById(cropId).populate({
    path: "field",
    populate: {
      path: "farm",
    },
  });

  if (
    !crop ||
    !crop.field ||
    !crop.field.farm ||
    crop.field.farm.owner.toString() !== userId.toString()
  ) {
    throw new Error("Crop not found");
  }

  return crop;
};

export const createCropRiskService = async (
  riskData,
  cropId,
  userId
) => {
  await verifyCropOwnership(cropId, userId);

  const {
    riskType,
    severity,
    description,
    reportedAt,
    notes,
  } = riskData;

  const cropRisk = await CropRisk.create({
    crop: cropId,
    riskType,
    severity,
    description,
    reportedAt,
    notes,
  });

  return cropRisk;
};

export const getCropsRiskService = async (cropId, userId) => {
  await verifyCropOwnership(cropId, userId);

  const cropRisk = await CropRisk.find({
    crop: cropId,
  }).sort({ reportedAt: -1 });

  return cropRisk;
};

export const getCropRiskByIdService = async (id, userId) => {
  const cropRisk = await CropRisk.findById(id).populate({
    path: "crop",
    populate: {
      path: "field",
      populate: {
        path: "farm",
      },
    },
  });

  if (
    !cropRisk ||
    !cropRisk.crop ||
    !cropRisk.crop.field ||
    !cropRisk.crop.field.farm ||
    cropRisk.crop.field.farm.owner.toString() !== userId.toString()
  ) {
    throw new Error("Crop risk record not found");
  }

  return cropRisk;
};

export const updateCropRiskService = async (
  id,
  riskData,
  userId
) => {
  const cropRisk = await getCropRiskByIdService(id, userId);

  const {
    riskType,
    severity,
    description,
    reportedAt,
    notes,
  } = riskData;

  cropRisk.riskType = riskType ?? cropRisk.riskType;
  cropRisk.severity = severity ?? cropRisk.severity;
  cropRisk.description = description ?? cropRisk.description;
  cropRisk.reportedAt = reportedAt ?? cropRisk.reportedAt;
  cropRisk.notes = notes ?? cropRisk.notes;

  await cropRisk.save();

  return cropRisk;
};

export const deleteCropRiskService = async (id, userId) => {
  const cropRisk = await getCropRiskByIdService(id, userId);

  await CropRisk.findByIdAndDelete(cropRisk._id);

  return cropRisk;
};