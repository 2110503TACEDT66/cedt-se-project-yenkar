const mongoose = require("mongoose");

const PaymentTransactionSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  stripeId: {
    type: String,
    required: true,
    unique: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  plan: {
    type: String,
  },
  credits: {
    type: Number,
  },
  buyerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  sellerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("PaymentTransaction", PaymentTransactionSchema);
