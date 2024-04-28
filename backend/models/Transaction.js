const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  origin: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    model: {
      type: String,
      required: true,
      enum: ["User", "CarProvider"], // Only allow these two values
    },
  },

  designation: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    model: {
      type: String,
      required: true,
      enum: ["User", "CarProvider"], // Only allow these two values
    },
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
