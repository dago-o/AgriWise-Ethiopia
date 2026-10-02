import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema(
  {
    fieldName: {
      type: String,
      required: true,
      trim: true,
    },

    farm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farm",
      required: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    area: {
      type: Number,
      required: true,
      min: 0,
    },

    soilType: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Field = mongoose.model("Field", fieldSchema);

export default Field;