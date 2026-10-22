import {
  createExpenseService,
  getCropExpensesService,
  getExpenseByIdService,
  updateExpenseService,
  deleteExpenseService,
  createIncomeService,
  getCropIncomeService,
  getIncomeByIdService,
  updateIncomeService,
  deleteIncomeService,
  getCropEconomicSummaryService,
} from "../services/economicsService.js";


export const createExpense = async (req, res) => {
  try {
    const { cropId } = req.params;

    const expense = await createExpenseService(
      req.body,
      cropId,
      req.user.id
    );

    res.status(201).json({
      message: "Expense created successfully",
      expense,
    });
  } catch (error) {
    console.error("Expense creation error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};


export const getCropExpenses = async (req, res) => {
  try {
    const { cropId } = req.params;

    const expenses = await getCropExpensesService(
      cropId,
      req.user.id
    );

    res.status(200).json({
      message: "Crop expenses retrieved successfully",
      expenses,
    });
  } catch (error) {
    console.error("Expense retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};


export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await getExpenseByIdService(
      id,
      req.user.id
    );

    res.status(200).json({
      message: "Expense retrieved successfully",
      expense,
    });
  } catch (error) {
    console.error("Expense retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};


export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await updateExpenseService(
      id,
      req.body,
      req.user.id
    );

    res.status(200).json({
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    console.error("Expense update error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};


export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const expense = await deleteExpenseService(
      id,
      req.user.id
    );

    res.status(200).json({
      message: "Expense deleted successfully",
      expense,
    });
  } catch (error) {
    console.error("Expense deletion error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};


export const createIncome = async (req, res) => {
  try {
    const { cropId } = req.params;

    const income = await createIncomeService(
      req.body,
      cropId,
      req.user.id
    );

    res.status(201).json({
      message: "Income created successfully",
      income,
    });
  } catch (error) {
    console.error("Income creation error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};


export const getCropIncome = async (req, res) => {
  try {
    const { cropId } = req.params;

    const income = await getCropIncomeService(
      cropId,
      req.user.id
    );

    res.status(200).json({
      message: "Crop income retrieved successfully",
      income,
    });
  } catch (error) {
    console.error("Income retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};


export const getIncomeById = async (req, res) => {
  try {
    const { id } = req.params;

    const income = await getIncomeByIdService(
      id,
      req.user.id
    );

    res.status(200).json({
      message: "Income retrieved successfully",
      income,
    });
  } catch (error) {
    console.error("Income retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};


export const updateIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const income = await updateIncomeService(
      id,
      req.body,
      req.user.id
    );

    res.status(200).json({
      message: "Income updated successfully",
      income,
    });
  } catch (error) {
    console.error("Income update error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};


export const deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const income = await deleteIncomeService(
      id,
      req.user.id
    );

    res.status(200).json({
      message: "Income deleted successfully",
      income,
    });
  } catch (error) {
    console.error("Income deletion error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};


export const getCropEconomicSummary = async (req, res) => {
  try {
    const { cropId } = req.params;

    const summary = await getCropEconomicSummaryService(
      cropId,
      req.user.id
    );

    res.status(200).json({
      message: "Crop economic summary retrieved successfully",
      summary,
    });
  } catch (error) {
    console.error("Economic summary error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};