// @ts-check

const UserModel = require('../models/user.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const sendOTP = require('../service/sendOTP.js')
const generateOTP = require('../utility/generateOTP.js')
const hashingOTP = require('../utility/hashingOTP.js')
const dotenv = require('dotenv')
dotenv.config()

/**
 * @typedef {{ name: string, email: string, password: string, otp?: string }} RegisterBody
 * @typedef {{ id: string }} AuthUser
 * @typedef {import('express').Request & { user?: AuthUser }} AuthenticatedRequest
 */

/**
 * @param {import('express').Request<{}, any, RegisterBody>} req
 * @param {import('express').Response} res
 *  
 * @returns 
 */
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
                const hashedOtp = hashingOTP(otp)
                isUserAlreadyExist.otp = hashedOtp;
                isUserAlreadyExist.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
                await isUserAlreadyExist.save();
                await sendOTP(email, String(otp));
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
        const hashedOtp = hashingOTP(otp)
        //hashing password before registering a user
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await UserModel.create(
            {
                name,
                email,
                password: hashedPassword,
                otp: hashedOtp,
                otpExpire: new Date(Date.now() + 10 * 60 * 1000)
            }
        )

        await sendOTP(email, String(otp));

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

/**
 * 
 * @param {import('express').Request<{},any , RegisterBody>} req 
 * @param {import('express').Response} res 
 * @returns 
 */
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

        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) {
            return res.status(500).json({
                message: "JWT_SECRET is not configured"
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            jwtSecret
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
/**
 * @param {import('express').Request<{}, any, RegisterBody>} req
 * @param {import('express').Response} res
 * @returns 
 */
function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({
        message: "user logged out successfully"
    })
}
/**
 * @param {AuthenticatedRequest} req
 * @param {import('express').Response} res
 * @returns 
 */
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
/**
 * @param {import('express').Request<{}, any, RegisterBody>} req
 * @param {import('express').Response} res
 * @returns 
 */
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


    const hashedOtp = hashingOTP(otp)
    if (String(user.otp) !== String(hashedOtp))
        return res.status(400).json({ message: "invalid otp" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();
    return res.status(200).json({ message: "otp verified" });
}
/**
 * @param {import('express').Request<{}, any, RegisterBody>} req
 * @param {import('express').Response} res
 * @returns 
 */

async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        const validUser = await UserModel.findOne(
            {
                email
            }
        )
        if (!validUser) {
            return res.status(400).json({
                message: "User does not exist"
            })
        }

        const otp = generateOTP();
        const hashedOTP = hashingOTP(otp)
        validUser.otp = hashedOTP;
        validUser.otpExpire = new Date(Date.now() + 10 * 60 * 1000);
        validUser.resetOtpVerified = false;

        await validUser.save();

        await sendOTP(email, String(otp));

        return res.status(200).json({
            message: "OTP sent to your email"
        })
    } catch (error) {
        return res.status(400).json({
            message: `Internal Server Error ${error}`,
        })
    }


}
/**
 * @param {import('express').Request<{}, any, RegisterBody>} req
 * @param {import('express').Response} res
 * @returns 
 */
async function verifyResetOtp(req, res) {
    try {
        const { email, otp } = req.body;

        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "user not found" });
        }

        if (!user.otp || !user.otpExpire) {
            return res.status(400).json({ message: "otp not set" });
        }

        if (user.otpExpire < new Date()) {
            return res.status(400).json({ message: "otp expired" });
        }

        const hashedOtp = hashingOTP(otp)
        if (String(user.otp) !== String(hashedOtp)) {
            return res.status(400).json({ message: "invalid otp" });
        }

        user.resetOtpVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        return res.status(200).json({ message: "reset otp verified" });
    } catch (error) {
        return res.status(400).json({
            message: `Internal Server Error ${error}`,
        })
    }
}
/**
 * @param {import('express').Request<{}, any, RegisterBody>} req
 * @param {import('express').Response} res
 * @returns 
 */
const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required" })
        }

        const user = await UserModel.findOne(
            {
                email
            }
        )

        if (!user) {
            return res.status(404).json({ message: "user not found" })
        }

        if (!user.resetOtpVerified) {
            return res.status(403).json({ message: "verify reset otp first" })
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        user.password = hashedPassword;
        user.resetOtpVerified = false;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();
        return res.status(200).json({
            message: "password reset successful"
        })
    } catch (error) {
        return res.status(400).json({
            message: `Internal Server Error ${error}`,
        })
    }
}


module.exports = {
    registerUser,
    loginUser, logoutUser, verifyOtp, forgotPassword, verifyResetOtp, getMe, resetPassword
}