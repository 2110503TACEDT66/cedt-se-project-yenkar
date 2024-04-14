const Transaction = require("../models/Transaction");

//@desc     Get all transactions
//@route    GET /api/v1/transactions
//@access   Public

exports.getTransactions = async (req, res, next) => {
  let query;

  if (req.user.role === "admin") {
    query = Transaction.find().populate({
      path: "buyer",
      select: "name email",
    });
  } else {
    query = Transaction.find({
      buyer: req.user.id,
    }).populate({
      path: "buyer",
      select: "name email",
    });
  }

  try {
    const transactions = await query;
    res
      .status(200)
      .json({ success: true, count: transactions.length, data: transactions });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find transaction" });
  }
};

//@desc     Get a transaction
//@route    GET /api/v1/transactions/:id
//@access   Public

exports.getSingleTransaction = async (req, res, next) => {
  let query;

  query = Transaction.findById(req.params.id).populate({
    path: "buyer",
    select: "name email",
  });

  try {
    const transaction = await query;
    res.status(200).json({ success: true, data: transaction });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find transaction" });
  }
};

//@desc     Create a transaction
//@route    POST /api/v1/transactions
//@access   Private

exports.createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .json({ success: false, message: "Cannot create transaction" });
  }
};
