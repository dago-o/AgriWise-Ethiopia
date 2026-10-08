import { User } from '../models/User.js';
import Farm from "../models/Farm.js";
import Field from "../models/Field.js";
import Crop from "../models/Crop.js";
import CropHealth from "../models/CropHealth.js";
import CropRisk from "../models/CropRisk.js";
import Expense from "../models/Expense.js";
import Income from "../models/Income.js";
import AgriculturalResource from "../models/AgriculturalResource.js";

export const getAdminDashboardService = async () => {
  // Summary counts
  const [
    totalFarmers,
    totalFarms,
    totalFields,
    totalCrops,
    totalResources,
  ] = await Promise.all([
    User.countDocuments({ role: "farmer" }),
    Farm.countDocuments(),
    Field.countDocuments(),
    Crop.countDocuments(),
    AgriculturalResource.countDocuments(),
  ]);

  // Crop health distribution
  const cropHealthData = await CropHealth.aggregate([
    {
      $group: {
        _id: "$healthStatus",
        count: { $sum: 1 },
      },
    },
  ]);

  const cropHealth = {
    HEALTHY: 0,
    WARNING: 0,
    CRITICAL: 0,
  };

  cropHealthData.forEach((item) => {
    cropHealth[item._id] = item.count;
  });

  // Crop risk distribution
  const cropRiskData = await CropRisk.aggregate([
    {
      $group: {
        _id: "$riskType",
        count: { $sum: 1 },
      },
    },
  ]);

  const cropRisks = {
    PEST: 0,
    DISEASE: 0,
    DROUGHT: 0,
    WEED: 0,
    NUTRIENT_DEFICIENCY: 0,
    OTHER: 0,
  };

  cropRiskData.forEach((item) => {
    cropRisks[item._id] = item.count;
  });

  // Crop distribution
  const cropDistribution = await Crop.aggregate([
    {
      $group: {
        _id: "$cropName",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        cropName: "$_id",
        count: 1,
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);

  // Economic totals
  const expenseResult = await Expense.aggregate([
    {
      $group: {
        _id: null,
        totalExpenses: { $sum: "$amount" },
      },
    },
  ]);

  const incomeResult = await Income.aggregate([
    {
      $group: {
        _id: null,
        totalIncome: { $sum: "$amount" },
      },
    },
  ]);

  const totalExpenses = expenseResult[0]?.totalExpenses || 0;
  const totalIncome = incomeResult[0]?.totalIncome || 0;
  const totalProfit = totalIncome - totalExpenses;

  // Resource distribution by category
  const resourceCategoryData = await AgriculturalResource.aggregate([
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        count: 1,
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);

  // Resource distribution by type
  const resourceTypeData = await AgriculturalResource.aggregate([
    {
      $group: {
        _id: "$resourceType",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        resourceType: "$_id",
        count: 1,
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]);

  return {
    summary: {
      totalFarmers,
      totalFarms,
      totalFields,
      totalCrops,
      totalResources,
    },

    cropHealth,

    cropRisks,

    cropDistribution,

    economics: {
      totalExpenses,
      totalIncome,
      totalProfit,
    },

    resources: {
      total: totalResources,
      byCategory: resourceCategoryData,
      byType: resourceTypeData,
    },
  };
};