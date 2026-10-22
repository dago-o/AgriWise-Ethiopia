import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.js";
import {
  createCrop,
  getCrops,
  getCropById,
  updateCrop,
  deleteCrop,
} from "../controllers/cropController.js";

const cropRouter = express.Router();
cropRouter.use(authenticateToken);
cropRouter.use(authorizeRole(['farmer']));

cropRouter.post("/field/:fieldId/crops", createCrop);
cropRouter.get("/field/:fieldId/crops", getCrops);

cropRouter.get("/:id", getCropById);
cropRouter.put("/:id", updateCrop);
cropRouter.delete("/:id", deleteCrop);

export {cropRouter};