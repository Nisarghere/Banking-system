const express = require('express')
const { registerUser, loginUser, logoutuser } = require('../controllers/auth.controller')

const router = express.Router()


router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutuser)

module.exports = router