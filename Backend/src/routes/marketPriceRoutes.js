import express from "express";

import {
  authenticateToken,
  authorizeRole,
} from "../middleware/authMiddleware.js";

import {
  createMarketPrice,
  getMarketPrices,
  getMarketPriceById,
  updateMarketPrice,
  deleteMarketPrice,
} from "../controllers/marketPriceController.js";

const marketPriceRouter = express.Router();

marketPriceRouter.use(authenticateToken);


// Farmers and administrators can view prices
marketPriceRouter.get(
  "/",
  authorizeRole(["farmer", "admin"]),
  getMarketPrices
);

marketPriceRouter.get(
  "/:id",
  authorizeRole(["farmer", "admin"]),
  getMarketPriceById
);


// Only administrators can manage prices
marketPriceRouter.post(
  "/",
  authorizeRole(["admin"]),
  createMarketPrice
);

marketPriceRouter.put(
  "/:id",
  authorizeRole(["admin"]),
  updateMarketPrice
);

marketPriceRouter.delete(
  "/:id",
  authorizeRole(["admin"]),
  deleteMarketPrice
);

export { marketPriceRouter };