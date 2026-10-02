import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.js";
import {
  createFarm,
  getFarms,
  getFarmById,
  updateFarm,
  deleteFarm,
} from "../controllers/farmController.js";

const farmRouter = express.Router();
farmRouter.use(authenticateToken);
farmRouter.use(authorizeRole(['farmer']));

farmRouter.post("/", createFarm);
farmRouter.get("/", getFarms);
farmRouter.get("/:id", getFarmById);
farmRouter.put("/:id", updateFarm);
farmRouter.delete("/:id", deleteFarm);

export{farmRouter};