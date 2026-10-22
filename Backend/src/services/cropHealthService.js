import CropHealth from "../models/CropHealth.js";
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

export const createCropHealthService = async (
  healthData,
  cropId,
  userId
) => {
  await verifyCropOwnership(cropId, userId);

  const {
    healthStatus,
    growthStage,
    observation,
    recordedAt,
    notes,
  } = healthData;

  const cropHealth = await CropHealth.create({
    crop: cropId,
    healthStatus,
    growthStage,
    observation,
    recordedAt,
    notes,
  });

  return cropHealth;
};

export const getCropsHealthService = async (cropId, userId) => {
  await verifyCropOwnership(cropId, userId);

  const cropHealth = await CropHealth.find({
    crop: cropId,
  }).sort({ recordedAt: -1 });

  return cropHealth;
};

export const getCropHealthByIdService = async (id, userId) => {
  const cropHealth = await CropHealth.findById(id).populate({
    path: "crop",
    populate: {
      path: "field",
      populate: {
        path: "farm",
      },
    },
  });

  if (
    !cropHealth ||
    !cropHealth.crop ||
    !cropHealth.crop.field ||
    !cropHealth.crop.field.farm ||
    cropHealth.crop.field.farm.owner.toString() !== userId.toString()
  ) {
    throw new Error("Crop health record not found");
  }

  return cropHealth;
};

export const updateCropHealthService = async (
  id,
  healthData,
  userId
) => {
  const cropHealth = await getCropHealthByIdService(id, userId);

  const {
    healthStatus,
    growthStage,
    observation,
    recordedAt,
    notes,
  } = healthData;

  cropHealth.healthStatus = healthStatus ?? cropHealth.healthStatus;
  cropHealth.growthStage = growthStage ?? cropHealth.growthStage;
  cropHealth.observation = observation ?? cropHealth.observation;
  cropHealth.recordedAt = recordedAt ?? cropHealth.recordedAt;
  cropHealth.notes = notes ?? cropHealth.notes;

  await cropHealth.save();

  return cropHealth;
};

export const deleteCropHealthService = async (id, userId) => {
  const cropHealth = await getCropHealthByIdService(id, userId);

  await CropHealth.findByIdAndDelete(cropHealth._id);

  return cropHealth;
};