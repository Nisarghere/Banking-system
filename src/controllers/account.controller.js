const accountModel = require("../models/account.model");

async function accountController(req, res){

    const user = req.user

    const account = await accountModel.create({

        user: user._id
    })

    res.status(201).json({
        account
    })
}

async function getUsersController(req, res){
    const accounts = await accountModel.find({user:req.user._id})

    res.status(200).json({
        accounts
    })
}

module.exports = {accountController, getUsersController}