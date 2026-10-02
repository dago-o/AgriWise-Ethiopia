import Farm from "../models/Farm.js";

export const createFarmService = async (farmData, userId) => {
  const { farmName, location, size, description } = farmData;

  const farm = await Farm.create({
    farmName,
    owner: userId,
    location,
    size,
    description,
  });

  return farm;
};

export const getFarmsService = async (userId) => {
  const farms = await Farm.find({ owner: userId }).sort({ createdAt: -1 });

  return farms;
};

export const getFarmByIdService = async (id, userId) => {
  const farm = await Farm.findOne({
    _id: id,
    owner: userId,
  });

  if (!farm) {
    throw new Error("Farm not found");
  }

  return farm;
};

export const updateFarmService = async (id, farmData, userId) => {
  const farm = await Farm.findOneAndUpdate(
    {
      _id: id,
      owner: userId,
    },
    farmData,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!farm) {
    throw new Error("Farm not found");
  }

  return farm;
};

export const deleteFarmService = async (id, userId) => {
  const farm = await Farm.findOneAndDelete({
    _id: id,
    owner: userId,
  });

  if (!farm) {
    throw new Error("Farm not found");
  }

  return farm;
};