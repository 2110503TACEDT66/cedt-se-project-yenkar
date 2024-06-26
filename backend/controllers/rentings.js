const Renting = require("../models/Renting");
const Provider = require("../models/CarProvider");
const User = require("../models/User");
const Car = require("../models/Car");
const Transaction = require("../models/Transaction");
const PaymentTransactions = require("../models/PaymentTransactions");

//@desc     Get all renting
//@route    GET /api/v1/rentings
//@access   Public
exports.getRentings = async (req, res, next) => {
  let query;
  if (req.user.role == "admin") {
    if (req.params.carProviderId) {
      query = Renting.find({ user: req.user.carProviderId }).populate([
        "car",
        {
          path: "carProvider",
          select: "name address telephone price src", //  Added price field to populate
        },
        {
          path: "user",
          select: "name email", //  Added user field to populate
        },
        // {
        //   path:"car",
        //   select: "brand model price"
        // }
      ]);
    } else {
      query = Renting.find().populate([
        "car",
        {
          path: "carProvider",
          select: "name address telephone price src", //  Added price field to populate
        },
        {
          path: "user",
          select: "name email", //  Added user field to populate
        },
        // {
        //   path:"car",
        //   select: "brand model price"
        // }
      ]);
    }
  } else {
    query = Renting.find({ user: req.user.id }).populate([
      "car",
      {
        path: "carProvider",
        select: "name address telephone price src", //  Added price field to populate
      },
      {
        path: "user",
        select: "name email", //  Added user field to populate
      },
      // {
      //   path:"car",
      //   select: "brand model price"
      // }
    ]);
  }

  try {
    const renting = await query;
    res
      .status(200)
      .json({ success: true, count: renting.length, data: renting });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find renting" });
  }
};

//@desc     Get a renting
//@route    GET /api/v1/rentings/:id
//@access   Public
exports.getRenting = async (req, res, next) => {
  try {
    const renting = await Renting.findById(req.params.id).populate([
      {
        path: "carProvider",
        select: "name address telephone price", //  Added price field to populate
      },
    ]);

    if (!renting)
      return res.status(400).json({
        success: false,
        message: `No renting with the ID of ${req.params.id}`,
      });

    res.status(200).json({ success: true, data: renting });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find renting" });
  }
};

//@desc     Get near and overdue renting
//@route    GET /api/v1/rentings/nearandover
//@access   Public
exports.getOverdueRentings = async (req, res, next) => {
  let near, overdue;
  let today = new Date();
  let tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  if (req.user.role == "admin") {
    near = Renting.find({ rentTo: { $lte: tomorrow, $gte: today } });
    overdue = Renting.find({ rentTo: { $lt: today }, returned: false });
  } else {
    near = Renting.find({
      user: req.user.id,
      rentTo: { $lte: tomorrow, $gte: today },
    });
    overdue = Renting.find({
      user: req.user.id,
      rentTo: { $lt: today },
      returned: false,
    });
  }
  near.populate({
    path: "carProvider",
    select: "name address telephone price",
  });
  overdue.populate({
    path: "carProvider",
    select: "name address telephone price",
  });

  try {
    const warn = await near;
    const over = await overdue;
    res.status(200).json({ success: true, near: warn, overdue: over });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find renting" });
  }
};

//@desc     Make a Renting
//@route    POST /api/v1/carproviders/:carProviderId/rentings
//@access   Private
exports.addRenting = async (req, res, next) => {
  try {
    req.body.carProvider = req.params.carProviderId;
    console.log(req.body.carProvider);

    const carProvider = await Provider.findById(req.params.carProviderId);
    console.log(carProvider);
    if (!carProvider)
      return res.status(400).json({
        success: false,
        message: `No car provider with the ID of ${req.params.id}`,
      });
    console.log(req.user.id);

    // console.log(req);

    // req.body.user = req.user.id;
    const { rentDate, rentTo, returned, carModel } = req.body;
    console.log(req.body);
    console.log(rentDate, rentTo, returned, carModel);

    /**************************** Check if rentDate is before rentTo ************************** */

    const rentDateInt = Date.parse(rentDate);
    const rentToInt = Date.parse(rentTo);
  
    if(rentDateInt > rentToInt) {
      return res.status(400).json({
        success: false,
        message: "Rent date must be before return date.",
      });
    }
  
    /***************************************************************** */

    const existedRenting = await Renting.find({ user: req.user.id });
    console.log(existedRenting);
    // const {rentDate, user} = req.body;

    /**************************** Deducted user's balance ************************** */
    const user = await User.findById(req.user.id);
    console.log(user);

    const car = await Car.find({
      carProvider: req.params.carProviderId,
      model: carModel,
    });
    console.log(car);
    if (car.length == 0) {
      return res.status(400).json({
        success: false,
        message: "The provider doesn't have this car",
      });
    }

    const isBalanceEnough = await user.checkBalance(car[0].price);
    console.log(car[0].price);
    console.log(isBalanceEnough);

    //if user is adding renting to other user
    if (req.body.user != req.user.id && req.user.role !== "admin") {
      console.log(req.body.user);
      console.log(req.user.id);
      return res.status(401).json({
        success: false,
        message: `user ${req.user.id} is not authorized to add ${req.body.user} renting`,
      });
    }

    if (!isBalanceEnough && req.user.role != "admin") {
      return res
        .status(400)
        .json({ success: false, message: `Your balance is not enough!` });
    }

    /***************************************************************** */

    //renting limit
    if (existedRenting.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `user ${req.user.id} has already made 3 rents`,
      });
    }

    const renting = await Renting.create({
      //rentDate, rentTo, user, carProvider, returned createAt, carModel
      rentDate: rentDate,
      rentTo: rentTo,
      user: req.body.user,
      carProvider: req.body.carProvider,
      returned: returned,
      car: car[0],
    });

    // const newBalance = user.setBalance(user.balance - carProvider.price);
    if (req.user.role != "admin") {
      await user.updateOne({ $inc: { balance: -car[0].price } });
      await carProvider.updateOne({ $inc: { balance: car[0].price } });
      await Transaction.create({
        amount: car[0].price,
        userId: req.user.id,
        carProviderId: req.params.carProviderId,
        type: "payment",
        stripeId: null,
        direction: "userToCarProvider",
      });
    }

    res.status(200).json({ success: true, data: renting });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Renting has not been made" });
  }
};

//@desc     Edit Renting
//@route    PUT /api/v1/rentings/:id
//@access   Private
exports.updateRenting = async (req, res, next) => {
  try {
    let renting = await Renting.findById(req.params.id);
    if (!renting) {
      return res.status(404).json({
        success: false,
        message: `No renting with id of ${req.params.id}`,
      });
    }

    if (renting.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `user ${req.user.id} is not authorized to change this renting`,
      });
    }

    const { rentDate, rentTo } = req.body;

    /**************************** Check if rentDate is before rentTo ************************** */

    const rentDateInt = Date.parse(rentDate);
    const rentToInt = Date.parse(rentTo);

    if(rentDateInt > rentToInt) {
      return res.status(400).json({
        success: false,
        message: "Rent date must be before return date.",
      });
    }

    /***************************************************************** */

    const today = new Date();
    let before = new Date();
    before.setDate(today.getDate() + 1);
    //not allow to edit one day before renting start
    if (renting.rentDate <= before && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message:
          "User are not allowed to edit renting information after a day before the renting, please contact customer service if the change is necessary",
      });
    }

    renting = await Renting.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: renting });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Cannot update renting information" });
  }
};

//@desc     Delete a Renting
//@route    DELETE /api/v1/rentings/:id
//@access   Private
exports.deleteRenting = async (req, res, next) => {
  // Please Refund user's balance if User delete their renting
  try {
    console.log("trying to delete" + req.params.id);
    const renting = await Renting.findById(req.params.id);
    console.log(renting);

    if (!renting)
      return res.status(404).json({
        success: false,
        message: `No renting with id of ${req.params.id}`,
      });

    //Make sure user is the renting owner
    console.log(renting.user);
    console.log(req.user.id);
    if (renting.user.toString() !== req.user.id && req.user.role !== "admin") {
      console.log("not authorized to delete renting");
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorize to delete this renting`,
      });
    }

    const today = new Date();
    console.log(today);
    let before = new Date();
    before.setDate(today.getDate() - 1);
    console.log(before);
    if (renting.rentDate <= before && req.user.role !== "admin") {
      console.log("not allowed to delete renting");
      return res.status(403).json({
        success: false,
        message:
          "User is not allowed to cancel renting within one day before the renting start date. Please contact customer service if the cancellation is necessary.",
      });
    }

    const user = await User.findById(renting.user);
    const carProvider = await Provider.findById(renting.carProvider);
    const car = await Car.findById(renting.car);
    console.log("gtttttttttttttt");
    console.log(car);
    if (car) {
      await user.updateOne({ $inc: { balance: car.price } });
      await carProvider.updateOne({ $inc: { balance: -car.price } });
      await Transaction.create({
        amount: car.price,
        userId: renting.user,
        carProviderId: renting.carProvider,
        type: "refund",
        stripeId: null,
        direction: "carProviderToUser",
      });
    }
    await renting.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Renting deletion is not completed" });
  }
};
