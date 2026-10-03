import {
  createCropHealthService,
  getCropsHealthService,
  getCropHealthByIdService,
  updateCropHealthService,
  deleteCropHealthService,
} from "../services/cropHealthService.js";

export const createCropHealth = async (req, res) => {
  try {
    const { cropId } = req.params;

    const cropHealth = await createCropHealthService(
      req.body,
      cropId,
      req.user.id
    );

    res.status(201).json({
      message: "Crop health record created successfully",
      cropHealth,
    });
  } catch (error) {
    console.error("Crop health creation error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getCropsHealth = async (req, res) => {
  try {
    const { cropId } = req.params;

    const cropHealth = await getCropsHealthService(
      cropId,
      req.user.id
    );

    res.status(200).json({
      message: "Crop health records retrieved successfully",
      cropHealth,
    });
  } catch (error) {
    console.error("Crop health retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getCropHealthById = async (req, res) => {
  try {
    const { id } = req.params;

    const cropHealth = await getCropHealthByIdService(
      id,
      req.user.id
    );

    res.status(200).json({
      message: "Crop health record retrieved successfully",
      cropHealth,
    });
  } catch (error) {
    console.error("Crop health retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateCropHealth = async (req, res) => {
  try {
    const { id } = req.params;

    const cropHealth = await updateCropHealthService(
      id,
      req.body,
      req.user.id
    );

    res.status(200).json({
      message: "Crop health record updated successfully",
      cropHealth,
    });
  } catch (error) {
    console.error("Crop health update error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteCropHealth = async (req, res) => {
  try {
    const { id } = req.params;

    const cropHealth = await deleteCropHealthService(
      id,
      req.user.id
    );

    res.status(200).json({
      message: "Crop health record deleted successfully",
      cropHealth,
    });
  } catch (error) {
    console.error("Crop health deletion error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};