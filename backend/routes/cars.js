const express = require("express");

const { deleteCar, getCars ,getSingleCar} = require("../controllers/cars");
// const carsRouter = require("./cars");

const router = express.Router({mergeParams: true});
const { protect, authorize } = require("../middleware/auth");

// router.use("/:carProviderId/rentings", rentingsRouter);

router
  .route("/")
  .get(getCars)

router
  .route("/:id")
  .get(getSingleCar)
  .delete(protect, deleteCar);

module.exports = router;
