import express from "express";
import {
  authenticateToken,
  authorizeRole,
} from "../middleware/authMiddleware.js";

import {
  createCropRisk,
  getCropsRisk,
  getCropRiskById,
  updateCropRisk,
  deleteCropRisk,
} from "../controllers/riskController.js";

const riskRouter = express.Router();

riskRouter.use(authenticateToken);
riskRouter.use(authorizeRole(["farmer"]));

riskRouter.post("/crop/:cropId/risks", createCropRisk);
riskRouter.get("/crop/:cropId/risks", getCropsRisk);

riskRouter.get("/:id", getCropRiskById);
riskRouter.put("/:id", updateCropRisk);
riskRouter.delete("/:id", deleteCropRisk);

 export { riskRouter };