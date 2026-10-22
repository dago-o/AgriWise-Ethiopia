import MarketPrice from "../models/MarketPrice.js";


// ==================== CREATE ====================

export const createMarketPriceService = async (
  marketPriceData
) => {
  const {
    cropName,
    marketName,
    location,
    price,
    unit,
    recordedAt,
    notes,
  } = marketPriceData;

  const marketPrice = await MarketPrice.create({
    cropName,
    marketName,
    location,
    price,
    unit,
    recordedAt,
    notes,
  });

  return marketPrice;
};


// ==================== GET ALL ====================

export const getMarketPricesService = async () => {
  const marketPrices = await MarketPrice.find().sort({
    recordedAt: -1,
  });

  return marketPrices;
};


// ==================== GET BY ID ====================

export const getMarketPriceByIdService = async (
  id
) => {
  const marketPrice = await MarketPrice.findById(id);

  if (!marketPrice) {
    throw new Error("Market price not found");
  }

  return marketPrice;
};


// ==================== UPDATE ====================

export const updateMarketPriceService = async (
  id,
  marketPriceData
) => {
  const marketPrice = await MarketPrice.findById(id);

  if (!marketPrice) {
    throw new Error("Market price not found");
  }

  const {
    cropName,
    marketName,
    location,
    price,
    unit,
    recordedAt,
    notes,
  } = marketPriceData;

  marketPrice.cropName =
    cropName ?? marketPrice.cropName;

  marketPrice.marketName =
    marketName ?? marketPrice.marketName;

  marketPrice.location =
    location ?? marketPrice.location;

  marketPrice.price =
    price ?? marketPrice.price;

  marketPrice.unit =
    unit ?? marketPrice.unit;

  marketPrice.recordedAt =
    recordedAt ?? marketPrice.recordedAt;

  marketPrice.notes =
    notes ?? marketPrice.notes;

  await marketPrice.save();

  return marketPrice;
};


// ==================== DELETE ====================

export const deleteMarketPriceService = async (
  id
) => {
  const marketPrice = await MarketPrice.findById(id);

  if (!marketPrice) {
    throw new Error("Market price not found");
  }

  await MarketPrice.findByIdAndDelete(id);

  return marketPrice;
};