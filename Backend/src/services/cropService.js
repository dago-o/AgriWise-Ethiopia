import Crop from "../models/Crop.js";
import Field from "../models/Field.js";

export const createCropService = async (
  cropData,
  fieldId,
  userId
) => {
  const {
    cropName,
    plantDate,
    expectedHarvestDate,
    status,
    notes,
  } = cropData;

  const field = await Field.findById(fieldId).populate("farm");

  if (!field || field.farm.owner.toString() !== userId.toString()) {
    throw new Error("Field not found");
  }

  const crop = await Crop.create({
    cropName,
    field: fieldId,
    plantDate,
    expectedHarvestDate,
    status,
    notes,
  });

  return crop;
};

export const getCropsService = async (fieldId, userId) => {
  const field = await Field.findById(fieldId).populate("farm");

  if (!field || field.farm.owner.toString() !== userId.toString()) {
    throw new Error("Field not found");
  }

  const crops = await Crop.find({
    field: fieldId,
  }).sort({ createdAt: -1 });

  return crops;
};

export const getCropByIdService = async (id, userId) => {
  const crop = await Crop.findById(id).populate({
    path: "field",
    populate: {
      path: "farm",
    },
  });

  if (
    !crop ||
    crop.field.farm.owner.toString() !== userId.toString()
  ) {
    throw new Error("Crop not found");
  }

  return crop;
};

export const updateCropService = async (
  id,
  cropData,
  userId
) => {
  const crop = await Crop.findById(id).populate({
    path: "field",
    populate: {
      path: "farm",
    },
  });

  if (
    !crop ||
    crop.field.farm.owner.toString() !== userId.toString()
  ) {
    throw new Error("Crop not found");
  }

  const updatedCrop = await Crop.findByIdAndUpdate(
    id,
    cropData,
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedCrop;
};

export const deleteCropService = async (id, userId) => {
  const crop = await Crop.findById(id).populate({
    path: "field",
    populate: {
      path: "farm",
    },
  });

  if (
    !crop ||
    crop.field.farm.owner.toString() !== userId.toString()
  ) {
    throw new Error("Crop not found");
  }

  const deletedCrop = await Crop.findByIdAndDelete(id);

  return deletedCrop;
};