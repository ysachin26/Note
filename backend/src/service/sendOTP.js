//@ts-check
 

const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

/**
 * @param {string} email
 * @param {string} otp
 */
const sendOTP = async (email, otp) => {
    const emailHost = process.env.EMAIL_HOST
    const emailPort = Number(process.env.EMAIL_PORT)
    const emailUser = process.env.EMAIL_USER
    const emailPass = process.env.EMAIL_PASS

    if (!emailHost || !emailUser || !emailPass || Number.isNaN(emailPort)) {
        throw new Error('Email configuration is missing or invalid')
    }

    const transporter = nodemailer.createTransport({
        host: emailHost,
        port: emailPort,
        secure: false,
        auth: {
            user: emailUser,
            pass: emailPass
        }
    })

    const mailOptions = {
        from: 'NoteX <tocontactsy@gmail.com>',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`
    }

    await transporter.sendMail(mailOptions)
}

module.exports = sendOTP