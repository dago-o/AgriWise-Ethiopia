import express from "express";
import { authenticateToken, authorizeRole } from "../middleware/authMiddleware.js";
import {
  createField,
  getFields,
  getFieldById,
  updateField,
  deleteField,
} from "../controllers/fieldController.js";

const fieldRouter = express.Router();
fieldRouter.use(authenticateToken);
fieldRouter.use(authorizeRole(['farmer']));

fieldRouter.post("/farm/:farmId/fields", createField);
fieldRouter.get("/farm/:farmId/fields", getFields);

fieldRouter.get("/:id", getFieldById);
fieldRouter.put("/:id", updateField);
fieldRouter.delete("/:id", deleteField);

export {fieldRouter};