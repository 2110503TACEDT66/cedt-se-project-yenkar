const mongoose = require("mongoose");

const PaymentTransactionSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  buyerId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  sellerId: {
    type: mongoose.Schema.ObjectId,
    ref: "CarProvider",
  },
  rentingId: {
    type: mongoose.Schema.ObjectId,
    ref: "Renting",
  },
});

module.exports = mongoose.model("PaymentTransaction", PaymentTransactionSchema);
