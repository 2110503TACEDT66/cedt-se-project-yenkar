const express = require("express");
const { deleteCar } = require("../controllers/cars");

// const carsRouter = require("./cars");

const router = express.Router({mergeParams: true});
const { protect, authorize } = require("../middleware/auth");

// router.use("/:carProviderId/rentings", rentingsRouter);


router
  .route("/:id")
  .delete(protect, deleteCar);

module.exports = router;
