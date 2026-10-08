import mongoose from "mongoose";

const agriculturalResourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    resourceType: {
      type: String,
      enum: ["ARTICLE", "GUIDE", "VIDEO", "OTHER"],
      required: true,
    },

    category: {
      type: String,
      enum: [
        "CROP_PRODUCTION",
        "PEST_MANAGEMENT",
        "DISEASE_MANAGEMENT",
        "SOIL_MANAGEMENT",
        "IRRIGATION",
        "FERTILIZER",
        "WEATHER",
        "HARVESTING",
        "POST_HARVEST",
        "MARKET",
        "GENERAL",
      ],
      required: true,
    },

    cropName: {
      type: String,
      trim: true,
      default: "GENERAL",
    },

    content: {
      type: String,
      trim: true,
    },

    videoUrl: {
      type: String,
      trim: true,
    },

    imageUrl: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      trim: true,
    },

    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const AgriculturalResource = mongoose.model(
  "AgriculturalResource",
  agriculturalResourceSchema
);

export default AgriculturalResource;