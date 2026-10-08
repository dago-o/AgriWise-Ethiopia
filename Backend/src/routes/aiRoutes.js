import express from "express";

import {
  authenticateToken,
  authorizeRole,
} from "../middleware/authMiddleware.js";

import {
  askAgricultureAI,
} from "../controllers/aiController.js";

const aiRouter = express.Router();

aiRouter.use(authenticateToken);
aiRouter.use(authorizeRole(["farmer"]));

aiRouter.post("/ask", askAgricultureAI);

export { aiRouter };