const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
        index: true
    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
        index: true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING", "COMPLETED", "FAILED", "REVERSED"],
            message:"Status should be either PENDING, COMPLETED, FAILED or REVERSED"
        },
        default:"PENDING"

    },
    amount:{
        type:Number,
        required:true,
        min:[0, "Amount should be greater than or equal to 0"]
    },
    ideompotencyKey:{
        type:String,
        required:true,
        index:true,
        unique:true
    }
})

const transactionModel = mongoose.model("transaction", transactionSchema )

module.exports = transactionModel