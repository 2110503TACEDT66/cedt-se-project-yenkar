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
      $or: [{ "origin.id": req.user.id }, { "designation.id": req.user.id }],
    });
  }

  try {
    let transactions = await query;
    console.log(transactions);
    if (transactions && transactions.origin) {
      transactions = await Transaction.populate(transactions, {
        path: "origin.id",
        model: transactions.origin.model,
        select: "name email",
      });
    }
    if (transactions && transactions.designation) {
      transactions = await Transaction.populate(transactions, {
        path: "designation.id",
        model: transactions.designation.model,
        select: "name email",
      });
    }
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
      path: "designation.id",
      model: transaction.designation.model,
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
