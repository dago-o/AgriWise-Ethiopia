import express from "express";

import {
  authenticateToken,
  authorizeRole,
} from "../middleware/authMiddleware.js";

import {
  getAdminDashboard,
} from "../controllers/adminDashboardController.js";

const adminDashboardRouter = express.Router();

adminDashboardRouter.use(authenticateToken);
adminDashboardRouter.use(authorizeRole(["admin"]));

adminDashboardRouter.get("/", getAdminDashboard);

export { adminDashboardRouter };