import mongoose from "mongoose";

const incomeSchema = new mongoose.Schema(
  {
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      min: 0,
    },

    unit: {
      type: String,
      trim: true,
    },

    incomeDate: {
      type: Date,
      default: Date.now,
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

const Income = mongoose.model("Income", incomeSchema);

export default Income;