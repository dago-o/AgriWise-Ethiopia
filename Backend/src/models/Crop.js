import mongoose from "mongoose";

const cropSchema = new mongoose.Schema(
  {
    cropName: {
      type: String,
      required: true,
      trim: true,
    },

    field: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
      required: true,
    },

    plantDate: {
      type: Date,
      required: true,
    },

    expectedHarvestDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["PLANNED", "PLANTED", "GROWING", "HARVESTED"],
      default: "PLANNED",
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

const Crop = mongoose.model("Crop", cropSchema);

export default Crop;