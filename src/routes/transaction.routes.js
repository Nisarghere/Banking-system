const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const { createTransaction, createInitialFundsTransaction } = require('../controllers/transaction.controller')
const {Router} = express

const transactionRouter = Router()

transactionRouter.post('/',authMiddleware.authMiddleware,createTransaction)

transactionRouter.post('/systems/initial-funds', authMiddleware.systemUserMiddleware,createInitialFundsTransaction )

module.exports = transactionRouter