const {
    getPaymentTransactions,
    createPaymentTransaction,
    getSinglePaymentTransaction,
  } = require("../controllers/PaymentTransactions");
  const { protect, authorize } = require("../middleware/auth");
  const express = require("express");
  
  const router = express.Router();
  
  router
    .route("/")
    .get(protect, authorize("admin", "user"), getPaymentTransactions);
  router
    .route("/:id")
    .get(protect, authorize("admin", "user"), getSinglePaymentTransaction);
  
  router
    .route("/")
    .post(protect, authorize("admin", "user"), createPaymentTransaction);
  
  module.exports = router;
  