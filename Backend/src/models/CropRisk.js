import mongoose from "mongoose";

const cropRiskSchema = new mongoose.Schema(
  {
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },

    riskType: {
      type: String,
      enum: [
        "PEST",
        "DISEASE",
        "DROUGHT",
        "WEED",
        "NUTRIENT_DEFICIENCY",
        "OTHER",
      ],
      required: true,
    },

    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH"],
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    reportedAt: {
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

const CropRisk = mongoose.model("CropRisk", cropRiskSchema);

export default CropRisk;