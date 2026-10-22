import {
  createFieldService,
  getFieldsService,
  getFieldByIdService,
  updateFieldService,
  deleteFieldService,
} from "../services/fieldService.js";

export const createField = async (req, res) => {
  try {
    const { farmId } = req.params;

    const field = await createFieldService(
      req.body,
      farmId,
      req.user.id
    );

    res.status(201).json({
      message: "Field created successfully",
      field,
    });
  } catch (error) {
    console.error("Field creation error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getFields = async (req, res) => {
  try {
    const { farmId } = req.params;

    const fields = await getFieldsService(
      farmId,
      req.user.id
    );

    res.status(200).json({
      message: "Fields retrieved successfully",
      fields,
    });
  } catch (error) {
    console.error("Field retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getFieldById = async (req, res) => {
  try {
    const { id } = req.params;

    const field = await getFieldByIdService(
      id,
      req.user.id
    );

    res.status(200).json({
      message: "Field retrieved successfully",
      field,
    });
  } catch (error) {
    console.error("Field retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateField = async (req, res) => {
  try {
    const { id } = req.params;

    const field = await updateFieldService(
      id,
      req.body,
      req.user.id
    );

    res.status(200).json({
      message: "Field updated successfully",
      field,
    });
  } catch (error) {
    console.error("Field update error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteField = async (req, res) => {
  try {
    const { id } = req.params;

    const field = await deleteFieldService(
      id,
      req.user.id
    );

    res.status(200).json({
      message: "Field deleted successfully",
      field,
    });
  } catch (error) {
    console.error("Field deletion error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};