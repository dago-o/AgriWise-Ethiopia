import mongoose from "mongoose";

const cropHealthSchema = new mongoose.Schema(
  {
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },

    healthStatus: {
      type: String,
      enum: ["HEALTHY", "WARNING", "CRITICAL"],
      required: true,
    },

    growthStage: {
      type: String,
      enum: [
        "SEEDLING",
        "VEGETATIVE",
        "FLOWERING",
        "FRUITING",
        "MATURITY",
      ],
      required: true,
    },

    observation: {
      type: String,
      required: true,
      trim: true,
    },

    recordedAt: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const CropHealth = mongoose.model("CropHealth", cropHealthSchema);

export default CropHealth;