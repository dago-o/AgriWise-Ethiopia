import Expense from "../models/Expense.js";
import Income from "../models/Income.js";
import Crop from "../models/Crop.js";


// Verify that the crop belongs to the authenticated farmer
const verifyCropOwnership = async (cropId, userId) => {
  const crop = await Crop.findById(cropId).populate({
    path: "field",
    populate: {
      path: "farm",
    },
  });

  if (
    !crop ||
    !crop.field ||
    !crop.field.farm ||
    crop.field.farm.owner.toString() !== userId.toString()
  ) {
    throw new Error("Crop not found");
  }

  return crop;
};


// ==================== EXPENSE ====================

export const createExpenseService = async (
  expenseData,
  cropId,
  userId
) => {
  await verifyCropOwnership(cropId, userId);

  const {
    category,
    amount,
    expenseDate,
    description,
  } = expenseData;

  const expense = await Expense.create({
    crop: cropId,
    category,
    amount,
    expenseDate,
    description,
  });

  return expense;
};


export const getCropExpensesService = async (
  cropId,
  userId
) => {
  await verifyCropOwnership(cropId, userId);

  const expenses = await Expense.find({
    crop: cropId,
  }).sort({ expenseDate: -1 });

  return expenses;
};


export const getExpenseByIdService = async (
  id,
  userId
) => {
  const expense = await Expense.findById(id).populate({
    path: "crop",
    populate: {
      path: "field",
      populate: {
        path: "farm",
      },
    },
  });

  if (
    !expense ||
    !expense.crop ||
    !expense.crop.field ||
    !expense.crop.field.farm ||
    expense.crop.field.farm.owner.toString() !== userId.toString()
  ) {
    throw new Error("Expense not found");
  }

  return expense;
};


export const updateExpenseService = async (
  id,
  expenseData,
  userId
) => {
  const expense = await getExpenseByIdService(id, userId);

  const {
    category,
    amount,
    expenseDate,
    description,
  } = expenseData;

  expense.category = category ?? expense.category;
  expense.amount = amount ?? expense.amount;
  expense.expenseDate = expenseDate ?? expense.expenseDate;
  expense.description = description ?? expense.description;

  await expense.save();

  return expense;
};


export const deleteExpenseService = async (
  id,
  userId
) => {
  const expense = await getExpenseByIdService(id, userId);

  await Expense.findByIdAndDelete(expense._id);

  return expense;
};


// ==================== INCOME ====================

export const createIncomeService = async (
  incomeData,
  cropId,
  userId
) => {
  await verifyCropOwnership(cropId, userId);

  const {
    amount,
    quantity,
    unit,
    incomeDate,
    description,
  } = incomeData;

  const income = await Income.create({
    crop: cropId,
    amount,
    quantity,
    unit,
    incomeDate,
    description,
  });

  return income;
};


export const getCropIncomeService = async (
  cropId,
  userId
) => {
  await verifyCropOwnership(cropId, userId);

  const income = await Income.find({
    crop: cropId,
  }).sort({ incomeDate: -1 });

  return income;
};


export const getIncomeByIdService = async (
  id,
  userId
) => {
  const income = await Income.findById(id).populate({
    path: "crop",
    populate: {
      path: "field",
      populate: {
        path: "farm",
      },
    },
  });

  if (
    !income ||
    !income.crop ||
    !income.crop.field ||
    !income.crop.field.farm ||
    income.crop.field.farm.owner.toString() !== userId.toString()
  ) {
    throw new Error("Income not found");
  }

  return income;
};


export const updateIncomeService = async (
  id,
  incomeData,
  userId
) => {
  const income = await getIncomeByIdService(id, userId);

  const {
    amount,
    quantity,
    unit,
    incomeDate,
    description,
  } = incomeData;

  income.amount = amount ?? income.amount;
  income.quantity = quantity ?? income.quantity;
  income.unit = unit ?? income.unit;
  income.incomeDate = incomeDate ?? income.incomeDate;
  income.description = description ?? income.description;

  await income.save();

  return income;
};


export const deleteIncomeService = async (
  id,
  userId
) => {
  const income = await getIncomeByIdService(id, userId);

  await Income.findByIdAndDelete(income._id);

  return income;
};


// ==================== ECONOMIC SUMMARY ====================

export const getCropEconomicSummaryService = async (
  cropId,
  userId
) => {
  await verifyCropOwnership(cropId, userId);

  const expenses = await Expense.find({
    crop: cropId,
  });

  const income = await Income.find({
    crop: cropId,
  });

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const totalIncome = income.reduce(
    (total, item) => total + item.amount,
    0
  );

  const profit = totalIncome - totalExpenses;

  return {
    totalExpenses,
    totalIncome,
    profit,
  };
};