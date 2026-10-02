import Field from "../models/Field.js";
import Farm from "../models/Farm.js";

export const createFieldService = async (fieldData, farmId, userId) => {
  const { fieldName, location, area, soilType, description } = fieldData;

  const farm = await Farm.findOne({
    _id: farmId,
    owner: userId,
  });

  if (!farm) {
    throw new Error("Farm not found");
  }

  const field = await Field.create({
    fieldName,
    farm: farmId,
    location,
    area,
    soilType,
    description,
  });

  return field;
};

export const getFieldsService = async (farmId, userId) => {
  const farm = await Farm.findOne({
    _id: farmId,
    owner: userId,
  });

  if (!farm) {
    throw new Error("Farm not found");
  }

  const fields = await Field.find({
    farm: farmId,
  }).sort({ createdAt: -1 });

  return fields;
};

export const getFieldByIdService = async (id, userId) => {
  const field = await Field.findById(id).populate("farm");

  if (!field || field.farm.owner.toString() !== userId.toString()) {
    throw new Error("Field not found");
  }

  return field;
};

export const updateFieldService = async (id, fieldData, userId) => {
  const field = await Field.findById(id).populate("farm");

  if (!field || field.farm.owner.toString() !== userId.toString()) {
    throw new Error("Field not found");
  }

  const updatedField = await Field.findByIdAndUpdate(
    id,
    fieldData,
    {
      new: true,
      runValidators: true,
    }
  );

  return updatedField;
};

export const deleteFieldService = async (id, userId) => {
  const field = await Field.findById(id).populate("farm");

  if (!field || field.farm.owner.toString() !== userId.toString()) {
    throw new Error("Field not found");
  }

  const deletedField = await Field.findByIdAndDelete(id);

  return deletedField;
};