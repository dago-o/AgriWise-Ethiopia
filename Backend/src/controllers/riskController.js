import {
  createCropRiskService,
  getCropsRiskService,
  getCropRiskByIdService,
  updateCropRiskService,
  deleteCropRiskService,
} from "../services/cropRiskService.js";

export const createCropRisk = async (req, res) => {
  try {
    const { cropId } = req.params;

    const cropRisk = await createCropRiskService(
      req.body,
      cropId,
      req.user.id
    );

    res.status(201).json({
      message: "Crop risk record created successfully",
      cropRisk,
    });
  } catch (error) {
    console.error("Crop risk creation error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getCropsRisk = async (req, res) => {
  try {
    const { cropId } = req.params;

    const cropRisk = await getCropsRiskService(
      cropId,
      req.user.id
    );

    res.status(200).json({
      message: "Crop risk records retrieved successfully",
      cropRisk,
    });
  } catch (error) {
    console.error("Crop risk retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getCropRiskById = async (req, res) => {
  try {
    const { id } = req.params;

    const cropRisk = await getCropRiskByIdService(
      id,
      req.user.id
    );

    res.status(200).json({
      message: "Crop risk record retrieved successfully",
      cropRisk,
    });
  } catch (error) {
    console.error("Crop risk retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateCropRisk = async (req, res) => {
  try {
    const { id } = req.params;

    const cropRisk = await updateCropRiskService(
      id,
      req.body,
      req.user.id
    );

    res.status(200).json({
      message: "Crop risk record updated successfully",
      cropRisk,
    });
  } catch (error) {
    console.error("Crop risk update error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteCropRisk = async (req, res) => {
  try {
    const { id } = req.params;

    const cropRisk = await deleteCropRiskService(
      id,
      req.user.id
    );

    res.status(200).json({
      message: "Crop risk record deleted successfully",
      cropRisk,
    });
  } catch (error) {
    console.error("Crop risk deletion error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};