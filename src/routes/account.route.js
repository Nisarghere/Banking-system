const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const { accountController, getUsersController } = require('../controllers/account.controller')


const router = express.Router()

router.post('/', authMiddleware.authMiddleware,accountController )

router.get('/', authMiddleware.authMiddleware, getUsersController)

module.exports = router