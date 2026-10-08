import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
      required: true,
    },

    category: {
      type: String,
      enum: [
        "SEED",
        "FERTILIZER",
        "PESTICIDE",
        "LABOR",
        "IRRIGATION",
        "TRANSPORT",
        "EQUIPMENT",
        "OTHER",
      ],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    expenseDate: {
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

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;