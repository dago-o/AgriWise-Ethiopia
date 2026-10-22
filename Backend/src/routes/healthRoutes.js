import express from "express";
import {
  authenticateToken,
  authorizeRole,
} from "../middleware/authMiddleware.js";

import {
  createCropHealth,
  getCropsHealth,
  getCropHealthById,
  updateCropHealth,
  deleteCropHealth,
} from "../controllers/healthController.js";

const healthRouter = express.Router();

healthRouter.use(authenticateToken);
healthRouter.use(authorizeRole(["farmer"]));

healthRouter.post("/crop/:cropId/health", createCropHealth);
healthRouter.get("/crop/:cropId/health", getCropsHealth);

healthRouter.get("/:id", getCropHealthById);
healthRouter.put("/:id", updateCropHealth);
healthRouter.delete("/:id", deleteCropHealth);

export { healthRouter };