const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");
const accountModel = require("../models/account.model");
const emailservice = require("../services/email.service");
const mongoose = require("mongoose");

async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
    user: req.user._id,
  });

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    return res.status(404).json({
      message: "Account not found",
    });
  }

  const isTransactionExist = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionExist) {
    if (isTransactionExist.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction already completed",
        transaction: isTransactionExist,
      });
    }
    if (isTransactionExist.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is still pending",
        transaction: isTransactionExist,
      });
    }
    if (isTransactionExist.status === "FAILED") {
      return res.status(200).json({
        message: "Transaction failed",
        transaction: isTransactionExist,
      });
    }
    if (isTransactionExist.status === "REVERSED") {
      return res.status(200).json({
        message: "Transaction already reversed, please retry",
        transaction: isTransactionExist,
      });
    }
  }

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message: "Both accounts must be ACTIVE to perform transaction",
    });
  }

  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      message: "Insufficient balance",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = await transactionModel.create(
    {
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    },
    { session },
  );

  const debitLedgerEntry = await ledgerModel.create(
    {
      account: fromAccount,
      amount,
      transaction: transaction._id,
      type: "DEBIT",
    },
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    {
      account: toAccount,
      amount,
      transaction: transaction._id,
      type: "CREDIT",
    },
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  await emailservice.sendTransactionEmail(
    req.user.email,
    req.user.name,
    amount,
    toAccount,
  );

  return res.status(201).json({
    message: "Transaction completed successfully",
    transaction: transaction,
  });
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const toUserAccount = await accountModel.findById(toAccount);

  if (!toUserAccount) {
    return res.status(404).json({
      message: "Account not found",
    });
  }

  const fromUserAccount = await accountModel.findOne({
     user: req.user._id,
  });

  if (!fromUserAccount) {
    return res.status(404).json({
      message: "System account not found",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = new transactionModel(
    {
      fromAccount: fromUserAccount._id,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    },
    
  );

  const debitLedgerEntry = await ledgerModel.create(
 [   {
      account: fromUserAccount._id,
      amount,
      transaction: transaction._id,
      type: "DEBIT",
    }],
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    [{
      account: toAccount,
      amount,
      transaction: transaction._id,
      type: "CREDIT",
    }],
    { session },
  );

  transaction.status = "COMPLETED";
  await transaction.save({ session });

  await session.commitTransaction();
  session.endSession();

  return res.status(201).json({
    message: "Initial funds transaction completed successfully",
    transaction: transaction,
  });
}

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
};
