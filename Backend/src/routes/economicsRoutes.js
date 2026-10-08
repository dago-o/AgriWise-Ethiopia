import express from "express";

import {
  authenticateToken,
  authorizeRole,
} from "../middleware/authMiddleware.js";

import {
  createExpense,
  getCropExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
  createIncome,
  getCropIncome,
  getIncomeById,
  updateIncome,
  deleteIncome,
  getCropEconomicSummary,
} from "../controllers/economicsController.js";

const economicsRouter = express.Router();

economicsRouter.use(authenticateToken);
economicsRouter.use(authorizeRole(["farmer"]));

economicsRouter.post(
  "/crop/:cropId/expenses",
  createExpense
);

economicsRouter.get(
  "/crop/:cropId/expenses",
  getCropExpenses
);

economicsRouter.get(
  "/expenses/:id",
  getExpenseById
);

economicsRouter.put(
  "/expenses/:id",
  updateExpense
);

economicsRouter.delete(
  "/expenses/:id",
  deleteExpense
);


economicsRouter.post(
  "/crop/:cropId/income",
  createIncome
);

economicsRouter.get(
  "/crop/:cropId/income",
  getCropIncome
);

economicsRouter.get(
  "/income/:id",
  getIncomeById
);

economicsRouter.put(
  "/income/:id",
  updateIncome
);

economicsRouter.delete(
  "/income/:id",
  deleteIncome
);


economicsRouter.get(
  "/crop/:cropId/summary",
  getCropEconomicSummary
);

export { economicsRouter };