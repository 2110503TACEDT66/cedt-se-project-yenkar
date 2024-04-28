const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    nullable: true,
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
      enum: ["User", "CarProvider"],
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
      enum: ["User", "CarProvider"],
    },
  },

  type: {
    type: String,
    required: true,
    enum: ["topUp", "payment", "refund"],
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
