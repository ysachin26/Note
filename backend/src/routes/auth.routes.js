const router = require('express').Router()

const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')

router.post('/user/register', authController.registerUser)
router.post('/user/login', authController.loginUser)
router.get('/user/logout',authController.logoutUser)
router.get('/user/me', authMiddleware, authController.getMe)

module.exports = router