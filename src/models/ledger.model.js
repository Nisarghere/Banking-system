const mongoose = require("mongoose")

const ledgerSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: true,
        index: true,
        immutable:true
    },
    amount:{
        type:Number,
        required:true,
        immutable:true,

    },
    transaction:{
        type:  mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required:true,
        index:true,
        immutable:true

    },
    type:{
        type:String,
        enum:{
            values:["CREDIT", "DEBIT"],
            message:"Type should be either CREDIT or DEBIT"
        },
        required:true,
        immutable:true
    }
})


function preventLedgerModification(){
    throw new Error("Ledger entries cannot be modified or deleted")
}

ledgerSchema.pre("updateOne", preventLedgerModification)
ledgerSchema.pre("deleteOne", preventLedgerModification)
ledgerSchema.pre("findOneAndUpdate", preventLedgerModification)
ledgerSchema.pre("remove", preventLedgerModification)
ledgerSchema.pre("deleteMany", preventLedgerModification)
ledgerSchema.pre("findOneAndDelete", preventLedgerModification)
ledgerSchema.pre("findOneAndRemove", preventLedgerModification)
ledgerSchema.pre("updateMany", preventLedgerModification)
 

const ledgerModel = mongoose.model("ledger", ledgerSchema)

module.exports = ledgerModel