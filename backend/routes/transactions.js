const {
  createTransaction,
  getTransactions,
  getSingleTransaction,
} = require("../controllers/transactions");
const { protect, authorize } = require("../middleware/auth");
const express = require("express");

const router = express.Router();

router
  .route("/")
  .get(protect, getTransactions)
  .post(protect, createTransaction);

router.route("/:id").get(protect, getSingleTransaction);

router;

module.exports = router;
