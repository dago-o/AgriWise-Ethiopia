import {
  getAdminDashboardService,
} from "../services/adminDashboardService.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const dashboard = await getAdminDashboardService();

    res.status(200).json({
      message: "Admin dashboard data retrieved successfully",
      dashboard,
    });
  } catch (error) {
    console.error("Admin dashboard error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};