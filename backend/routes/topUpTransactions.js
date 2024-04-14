const {
  getTopUpTransactions,
  createTopUpTransaction,
  getSingleTopUpTransaction,
} = require("../controllers/topUpTransactions");
const { protect, authorize } = require("../middleware/auth");
const express = require("express");

const router = express.Router();

router
  .route("/")
  .get(protect, authorize("admin", "user"), getTopUpTransactions);
router
  .route("/:id")
  .get(protect, authorize("admin", "user"), getSingleTopUpTransaction);

router
  .route("/")
  .post(protect, authorize("admin", "user"), createTopUpTransaction);

module.exports = router;
