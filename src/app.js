const express = require('express')
const authRouter = require('./routes/auth.routes')
const cookieParser = require('cookie-parser')
const accountRouter = require('./routes/account.route')
const transactionRouter = require('./routes/transaction.routes')
const authMiddleware = require('./middleware/auth.middleware')

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use('/api/auth', authRouter)
app.use('/api/transactions', transactionRouter)
app.use('/api/accounts', accountRouter)

module.exports = app