const transactionModel = require('../models/transaction.model')
const ledgerModel = require('../models/ledger.model')
const accountModel = require('../models/account.model')
const emailservice = require('../services/email.service')

async function createTransaction(req, res){
    const {fromAccount, toAccount, amount, ideompotencyKey} = req.body 
    
    if (!fromAccount || !toAccount || !amount || !ideompotencyKey){
        return res.status(400).json({
            message:"All fields are required",
        })
    }

    const fromUserAccount = await accountModel.findOne({
        _id:fromAccount
    })

    const toUserAccount = await accountModel.findOne({
        _id:toAccount
    })

    if (!fromUserAccount || !toUserAccount){
        return res.status(404).json({
            message:"Account not found",
        })
    }

    const isTransactionExist = await transactionModel.findOne({
        ideompotencyKey:ideompotencyKey
    })

    if (isTransactionExist){
        if (isTransactionExist.status === "COMPLETED"){
            return res.status(200).json({
                message:"Transaction already completed",
                transaction:isTransactionExist
            })
        }
        if (isTransactionExist.status === "PENDING"){
            return res.status(200).json({
                message:"Transaction is still pending",
                transaction:isTransactionExist
            })
        }
        if (isTransactionExist.status === "FAILED"){
            return res.status(200).json({
                message:"Transaction failed",
                transaction:isTransactionExist
            })
        }
        if (isTransactionExist.status === "REVERSED"){
            return res.status(200).json({
                message:"Transaction already reversed, please retry",
                transaction:isTransactionExist
            })
        }
    }

    if (fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            message:"Both accounts must be ACTIVE to perform transaction", 
        })
    }


    const balance = await fromUserAccount.getBalance()

    if (balance < amount){
        return res.status(400).json({
            message:"Insufficient balance",
        })
    }
}