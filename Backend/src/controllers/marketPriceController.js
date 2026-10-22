import {
  createMarketPriceService,
  getMarketPricesService,
  getMarketPriceByIdService,
  updateMarketPriceService,
  deleteMarketPriceService,
} from "../services/marketPriceService.js";


export const createMarketPrice = async (req, res) => {
  try {
    const marketPrice = await createMarketPriceService(
      req.body
    );

    res.status(201).json({
      message: "Market price created successfully",
      marketPrice,
    });
  } catch (error) {
    console.error("Market price creation error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};


export const getMarketPrices = async (req, res) => {
  try {
    const marketPrices = await getMarketPricesService();

    res.status(200).json({
      message: "Market prices retrieved successfully",
      marketPrices,
    });
  } catch (error) {
    console.error("Market price retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};


export const getMarketPriceById = async (req, res) => {
  try {
    const { id } = req.params;

    const marketPrice = await getMarketPriceByIdService(id);

    res.status(200).json({
      message: "Market price retrieved successfully",
      marketPrice,
    });
  } catch (error) {
    console.error("Market price retrieval error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};


export const updateMarketPrice = async (req, res) => {
  try {
    const { id } = req.params;

    const marketPrice = await updateMarketPriceService(
      id,
      req.body
    );

    res.status(200).json({
      message: "Market price updated successfully",
      marketPrice,
    });
  } catch (error) {
    console.error("Market price update error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};


export const deleteMarketPrice = async (req, res) => {
  try {
    const { id } = req.params;

    const marketPrice = await deleteMarketPriceService(id);

    res.status(200).json({
      message: "Market price deleted successfully",
      marketPrice,
    });
  } catch (error) {
    console.error("Market price deletion error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};