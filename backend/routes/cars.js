const express = require("express");
const { deleteCar , addCar} = require("../controllers/cars");

// const carsRouter = require("./cars");

const router = express.Router({mergeParams: true});
const { protect, authorize } = require("../middleware/auth");

// router.use("/:carProviderId/rentings", rentingsRouter);

router
  .route("/")
  .post(protect, addCar);

router
  .route("/:id")
  .delete(protect, deleteCar);

module.exports = router;
