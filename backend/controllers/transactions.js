const Transaction = require("../models/Transaction");

//@desc     Get all transactions
//@route    GET /api/v1/transactions
//@access   Public

exports.getTransactions = async (req, res, next) => {
  let query;

  console.log("GETTING TRANSACTIONS");
  console.log(req.user);

  if (req.user.role === "admin") {
    query = Transaction.find();
  } else {
    query = Transaction.find({
      $or: [{ userId: req.user.id }, { carProviderId: req.user.id }],
    })
      .populate({
        path: "userId",
        select: "name email",
      })
      .populate({
        path: "carProviderId",
        select: "name email",
      })
      .sort({ createdAt: -1 });
  }

  try {
    let transactions = await query;
    console.log(transactions);
    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find transactions" });
  }
};

//@desc     Get a transaction
//@route    GET /api/v1/transactions/:id
//@access   Public

exports.getSingleTransaction = async (req, res, next) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    transaction = await Transaction.populate(transaction, {
      path: "origin.id",
      model: transaction.origin.model,
      select: "name email",
    });
    transaction = await Transaction.populate(transaction, {
      path: "destination.id",
      model: transaction.destination.model,
      select: "name email",
    });
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
exports.createTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.create(req.body);
    res.status(201).json({ success: true, data: transaction });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create transaction" });
  }
};
