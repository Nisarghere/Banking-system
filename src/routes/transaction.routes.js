const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')

const {Router} = express

const transactionRouter = Router()

transactionRouter.post('/',authMiddleware.authMiddleware, )

module.exports = transactionRouter