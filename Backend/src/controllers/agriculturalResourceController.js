import {
  createResourceService,
  getResourcesService,
  getResourceByIdService,
  updateResourceService,
  deleteResourceService,
} from "../services/agriculturalResourceService.js";

export const createResource = async (req, res) => {
  try {
    const resource = await createResourceService(req.body);

    res.status(201).json({
      message: "Agricultural resource created successfully",
      resource,
    });
  } catch (error) {
    console.error("Resource creation error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getResources = async (req, res) => {
  try {
    const resources = await getResourcesService(
      req.user.role,
      req.query
    );

    res.status(200).json({
      message: "Agricultural resources retrieved successfully",
      resources,
    });
  } catch (error) {
    console.error("Resource retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await getResourceByIdService(
      id,
      req.user.role
    );

    res.status(200).json({
      message: "Agricultural resource retrieved successfully",
      resource,
    });
  } catch (error) {
    console.error("Resource retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await updateResourceService(
      id,
      req.body
    );

    res.status(200).json({
      message: "Agricultural resource updated successfully",
      resource,
    });
  } catch (error) {
    console.error("Resource update error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;

    const resource = await deleteResourceService(id);

    res.status(200).json({
      message: "Agricultural resource deleted successfully",
      resource,
    });
  } catch (error) {
    console.error("Resource deletion error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};