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
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  carProviderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CarProvider",
  },

  direction: {
    type: String,
    required: true,
    enum: ["userToCarProvider", "carProviderToUser", "userTopUp"],
  },

  type: {
    type: String,
    required: true,
    enum: ["topUp", "payment", "refund"],
  },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
