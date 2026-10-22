import { createFarmService,
         getFarmsService,
         getFarmByIdService,
         updateFarmService,
         deleteFarmService,
} from "../services/farmService.js";

export const createFarm = async (req, res) => {
  try {
    const farm = await createFarmService(req.body, req.user.id);

    res.status(201).json({
      message: "Farm created successfully",
      farm,
    });
  } catch (error) {
    console.error("Farm creation error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getFarms = async (req, res) => {
  try {
    const farms = await getFarmsService(req.user.id);

    res.status(200).json({
      message: "Farms retrieved successfully",
      farms,
    });
  } catch (error) {
    console.error("Farm retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getFarmById = async (req, res) => {
  try {
    const { id } = req.params;

    const farm = await getFarmByIdService(id, req.user.id);

    res.status(200).json({
      message: "Farm retrieved successfully",
      farm,
    });
  } catch (error) {
    console.error("Farm retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateFarm = async (req, res) => {
  try {
    const { id } = req.params;

    const farm = await updateFarmService(id, req.body, req.user.id);

    res.status(200).json({
      message: "Farm updated successfully",
      farm,
    });
  } catch (error) {
    console.error("Farm update error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteFarm = async (req, res) => {
  try {
    const { id } = req.params;

    const farm = await deleteFarmService(id, req.user.id);

    res.status(200).json({
      message: "Farm deleted successfully",
      farm,
    });
  } catch (error) {
    console.error("Farm deletion error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};