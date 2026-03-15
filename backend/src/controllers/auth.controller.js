const UserModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const sendOTP = require('../service/sendOTP.js')
const generateOTP = require('../utility/generateOTP.js')
const dotenv = require('dotenv')
dotenv.config()


async function registerUser(req, res) {

    try {
        const { name, email, password } = req.body;

        const isUserAlreadyExist = await UserModel.findOne(
            {
                email
            }
        )

        //checking if user already exists in database
        if (isUserAlreadyExist) {
            // If account exists but email not verified, resend OTP instead of blocking
            if (!isUserAlreadyExist.isVerified) {
                const otp = generateOTP();
                isUserAlreadyExist.otp = otp;
                isUserAlreadyExist.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
                await isUserAlreadyExist.save();
                await sendOTP(email, otp);
                return res.status(200).json({
                    message: "Account exists but not verified. A new OTP has been sent to your email."
                })
            }
            return res.status(400).json({
                message: "user already exists"
            })
        }

        //otp generation
        const otp = generateOTP();
        //hashing password before registering a user
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await UserModel.create(
            {
                name,
                email,
                password: hashedPassword,
                otp: otp,
                otpExpire: new Date(Date.now() + 10 * 60 * 1000)
            }
        )

        await sendOTP(email, otp);

        // No cookie here — user must verify OTP before getting a session
        res.status(201).json(
            {
                message: "user created successfully please verify your otp",
            }
        )
    } catch (error) {
        res.status(400).json(
            {
                message: `Internal Server Error ${error}`,

            })
    }

}

async function loginUser(req, res) {

    try {
        const { email, password } = req.body;


        const user = await UserModel.findOne(
            {
                email
            }
        )

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        if (!user.isVerified) {
            console.log("verify your email to login")
            return res.status(403).json({
                message: "Please verify email first"

            });

        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            }, process.env.JWT_SECRET
        )

        res.cookie("token", token)
        res.status(200).json({
            message: "user logged in successfully",
            user:
            {
                _id: user._id,
                email: user.email,
                name: user.name
            }
        })
    }
    catch (error) {
        res.status(400).json(
            {
                message: `Internal Server Error ${error}`,

            })
    }
}

function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "user logged out successfully"
    })
}

async function getMe(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "login first" })
        }

        const user = await UserModel.findById(req.user.id).select('_id email name')
        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        return res.status(200).json({ user })
    } catch (error) {
        return res.status(400).json({ message: `Internal Server Error ${error}` })
    }
}

async function verifyOtp(req, res) {

    const { email, otp } = req.body;

    const user = await UserModel.findOne(
        {
            email
        }
    )
    if (!user) return res.status(404).json({ message: "user not found" });

    if (!user.otp || !user.otpExpire) {
        return res.status(400).json({ message: "otp not set" });
    }

    if (user.otpExpire < new Date())
        return res.status(400).json({ message: "otp expired" });


    if (String(user.otp) !== String(otp))
        return res.status(400).json({ message: "invalid otp" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    return res.status(200).json({ message: "otp verified" });
}

module.exports = {
    registerUser,
    loginUser, logoutUser, verifyOtp,
    getMe
}