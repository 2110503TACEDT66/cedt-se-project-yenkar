const express = require("express");
<<<<<<< HEAD
const { deleteCar, getCars ,getSingleCar} = require("../controllers/cars");
=======
const { deleteCar , addCar} = require("../controllers/cars");
>>>>>>> 9f3dec89ed384ce630b3b62a6cc2332de6b0bd0a

// const carsRouter = require("./cars");

const router = express.Router({mergeParams: true});
const { protect, authorize } = require("../middleware/auth");

// router.use("/:carProviderId/rentings", rentingsRouter);

router
  .route("/")
<<<<<<< HEAD
  .get(getCars);
=======
  .post(protect, addCar);
>>>>>>> 9f3dec89ed384ce630b3b62a6cc2332de6b0bd0a

router
  .route("/:id")
  .get(getSingleCar)
  .delete(protect, deleteCar);

module.exports = router;
