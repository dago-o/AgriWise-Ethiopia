import {
  createCropService,
  getCropsService,
  getCropByIdService,
  updateCropService,
  deleteCropService,
} from "../services/cropService.js";

export const createCrop = async (req, res) => {
  try {
    const { fieldId } = req.params;

    const crop = await createCropService(
      req.body,
      fieldId,
      req.user.id
    );

    res.status(201).json({
      message: "Crop created successfully",
      crop,
    });
  } catch (error) {
    console.error("Crop creation error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getCrops = async (req, res) => {
  try {
    const { fieldId } = req.params;

    const crops = await getCropsService(
      fieldId,
      req.user.id
    );

    res.status(200).json({
      message: "Crops retrieved successfully",
      crops,
    });
  } catch (error) {
    console.error("Crop retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getCropById = async (req, res) => {
  try {
    const { id } = req.params;

    const crop = await getCropByIdService(
      id,
      req.user.id
    );

    res.status(200).json({
      message: "Crop retrieved successfully",
      crop,
    });
  } catch (error) {
    console.error("Crop retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateCrop = async (req, res) => {
  try {
    const { id } = req.params;

    const crop = await updateCropService(
      id,
      req.body,
      req.user.id
    );

    res.status(200).json({
      message: "Crop updated successfully",
      crop,
    });
  } catch (error) {
    console.error("Crop update error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteCrop = async (req, res) => {
  try {
    const { id } = req.params;

    const crop = await deleteCropService(
      id,
      req.user.id
    );

    res.status(200).json({
      message: "Crop deleted successfully",
      crop,
    });
  } catch (error) {
    console.error("Crop deletion error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};