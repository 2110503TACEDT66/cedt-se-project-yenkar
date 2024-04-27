const TopUpTransaction = require("../models/PaymentTransactions");

//@desc     Get all topUpTransaction
//@route    GET /api/v1/topUpTransaction
//@access   Public

exports.getPaymentTransactions = async (req, res, next) => {
  let query;

  if (req.user.role === "admin") {
    query = PaymentTransaction.find().populate({
      path: "buyerId",
      select: "name email",
    });
  } else {
    query = PaymentTransaction.find({
      buyerId: req.user.id,
    }).populate([
      {
        path: "buyerId",
        select: "name",
      },
      {
        path: "sellerId",
        select: "name",
      },
      {
        path: "rentingId",
      },
    ]);
  }

  try {
    const paymentTransaction = await query;
    res.status(200).json({
      success: true,
      count: paymentTransaction.length,
      data: paymentTransaction,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find paymentTransaction" });
  }
};

//@desc     Get a topUpTransaction
//@route    GET /api/v1/topUpTransaction/:id
//@access   Public

exports.getSinglePaymentTransaction = async (req, res, next) => {
  let query;

  query = PaymentTransaction.findById(req.params.id).populate({
    path: "buyerId",
    select: "name email",
  });

  try {
    const paymentTransaction = await query;
    res.status(200).json({ success: true, data: paymentTransaction });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find paymentTransaction" });
  }
};

//@desc     Create a topUpTransaction
//@route    POST /api/v1/topUpTransaction
//@access   Private

exports.createPaymentTransaction = async (req, res, next) => {
  try {
    const paymentTransaction = await PaymentTransaction.create(req.body);
    res.status(201).json({
      success: true,
      data: paymentTransaction,
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ success: false, message: "Cannot create paymentTransaction" });
  }
};
