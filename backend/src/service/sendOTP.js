const nodemailer = require('nodemailer')
const dotenv = require('dotenv')
dotenv.config()

const sendOTP = async (email, otp) => {

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: 'NoteX <tocontactsy@gmail.com>',
        to: email,
        subject: 'OTP Verification',
        text: `Your OTP is ${otp}. It will expire in 10 minutes.`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOTP