const { Schema, model } = require('mongoose');

const UserSchema = new Schema
    (
        {
            name: {
                type: String,
                required: true,
                maxlength: 50
            },
            email: {
                type: String,
                required: true,
                unique: true,
                maxlength: 50
            },
            password: {
                type: String,
                required: true,
            },
            otp:
            {
                type: String,
            },
            otpExpire: {
                type: Date,
            },
            resetOtpVerified: {
                type: Boolean,
                default: false,
            },
            isVerified:
            {
                type: Boolean,
                default: false,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            }
        },
        {
            timestamps: true
        }
    )

const UserModel = model("user", UserSchema)
module.exports = UserModel;