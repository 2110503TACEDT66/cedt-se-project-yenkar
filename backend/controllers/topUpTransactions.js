const TopUpTransaction = require("../models/TopUpTransaction");

//@desc     Get all topUpTransaction
//@route    GET /api/v1/topUpTransaction
//@access   Public

exports.getTopUpTransactions = async (req, res, next) => {
  let query;

  if (req.user.role === "admin") {
    query = TopUpTransaction.find().populate({
      path: "buyerId",
      select: "name email",
    });
  } else {
    query = TopUpTransaction.find({
      buyerId: req.user.id,
    }).populate({
      path: "buyerId",
      select: "name email",
    });
  }

  try {
    const topUpTransaction = await query;
    res.status(200).json({
      success: true,
      count: topUpTransaction.length,
      data: topUpTransaction,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find topUpTransaction" });
  }
};

//@desc     Get a topUpTransaction
//@route    GET /api/v1/topUpTransaction/:id
//@access   Public

exports.getSingleTopUpTransaction = async (req, res, next) => {
  let query;

  query = TopUpTransaction.findById(req.params.id).populate({
    path: "buyerId",
    select: "name email",
  });

  try {
    const topUpTransaction = await query;
    res.status(200).json({ success: true, data: topUpTransaction });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find topUpTransaction" });
  }
};

//@desc     Create a topUpTransaction
//@route    POST /api/v1/topUpTransaction
//@access   Private

exports.createTopUpTransaction = async (req, res, next) => {
  try {
    const topUpTransaction = await TopUpTransaction.create(req.body);
    res.status(201).json({
      success: true,
      data: topUpTransaction,
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ success: false, message: "Cannot create topUpTransaction" });
  }
};
