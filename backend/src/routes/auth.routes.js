//@ts-check
const router = require('express').Router()

const authController = require('../controllers/auth.controller')
const authMiddleware = require('../middleware/auth.middleware')
const { registerValidationRules, validateRequest } = require('../validations/auth.validation')

router.post('/user/register', registerValidationRules, validateRequest, authController.registerUser)
router.post('/user/login', authController.loginUser)
router.get('/user/logout', authController.logoutUser)
router.get('/user/me', authMiddleware, authController.getMe)
router.post('/user/verify-otp', authController.verifyOtp)
router.post('/user/resend-register-otp', authController.resendRegisterOtp)
router.post('/user/forgot-password', authController.forgotPassword)
router.post('/user/verify-reset-otp', authController.verifyResetOtp)
router.post('/user/reset-password', authController.resetPassword)
module.exports = router