const {
  getSingleTransaction,
  getTransactions,
  createTransaction,
} = require("../controllers/transactions");
const { protect, authorize } = require("../middleware/auth");
const express = require("express");

const router = express.Router();

router.route("/").get(protect, authorize("admin", "user"), getTransactions);
router
  .route("/:id")
  .get(protect, authorize("admin", "user"), getSingleTransaction);

router.route("/").post(protect, authorize("admin", "user"), createTransaction);

module.exports = router;
