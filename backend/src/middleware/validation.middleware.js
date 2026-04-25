const { body, validationResult } = require('express-validator')

const registerValidationRules = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('name is required')
        .isLength({ min: 2, max: 50 })
        .withMessage('name must be between 2 and 50 characters'),

    body('email')
        .trim()
        .notEmpty()
        .withMessage('email is required')
        .isEmail()
        .withMessage('invalid email format')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 characters long')
        .matches(/[A-Z]/)
        .withMessage('password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('password must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('password must contain at least one number')
        .matches(/[^A-Za-z0-9]/)
        .withMessage('password must contain at least one special character'),

    // body('confirmPassword')
    //     .notEmpty()
    //     .withMessage('confirm password is required')
    //     .custom((value, { req }) => value === req.body.password)
    //     .withMessage('password and confirm password do not match'),
]

const validateRequest = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: [
      "Must be at least 8 characters long.",
      "Must contain at least one uppercase letter.",
      "Must contain at least one number."
    ],
  "success": false,
  "type": "ValidationError",
  "errors": {
   
  }
} )
    }
    next()
}

module.exports = {
    registerValidationRules,
    validateRequest,
}