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
  authorizeRole(["farmer", "administrator"]),
  getMarketPrices
);

marketPriceRouter.get(
  "/:id",
  authorizeRole(["farmer", "administrator"]),
  getMarketPriceById
);


// Only administrators can manage prices
marketPriceRouter.post(
  "/",
  authorizeRole(["administrator"]),
  createMarketPrice
);

marketPriceRouter.put(
  "/:id",
  authorizeRole(["administrator"]),
  updateMarketPrice
);

marketPriceRouter.delete(
  "/:id",
  authorizeRole(["administrator"]),
  deleteMarketPrice
);

export { marketPriceRouter };