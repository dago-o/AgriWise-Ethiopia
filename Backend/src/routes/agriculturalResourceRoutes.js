import express from "express";
import {
  authenticateToken,
  authorizeRole,
} from "../middleware/authMiddleware.js";

import {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
} from "../controllers/agriculturalResourceController.js";

const agriculturalResourceRouter = express.Router();

agriculturalResourceRouter.use(authenticateToken);

agriculturalResourceRouter.get(
  "/",
  authorizeRole(["farmer", "admin"]),
  getResources
);

agriculturalResourceRouter.get(
  "/:id",
  authorizeRole(["farmer", "admin"]),
  getResourceById
);

agriculturalResourceRouter.post(
  "/",
  authorizeRole(["admin"]),
  createResource
);

agriculturalResourceRouter.put(
  "/:id",
  authorizeRole(["admin"]),
  updateResource
);

agriculturalResourceRouter.delete(
  "/:id",
  authorizeRole(["admin"]),
  deleteResource
);

export { agriculturalResourceRouter };