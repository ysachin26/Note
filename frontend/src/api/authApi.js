// @ts-check
import axiosInstance from "./axiosInstance";
/**
 * 
 * @param {string} email
 * @param {string} password
 */



const loginUser = async (email, password) => {
    return await axiosInstance.post('/auth/user/login',
        {
            email,
            password
        }
    )
}

/**
 * @param {string} name
 * @param {string} email
 * @param {string} password
 */

const registerUser = async (name, email, password) => {
    return await axiosInstance.post('/auth/user/register',
        {
            name,
            email,
            password
        })
}
/**
 * @param {string} email
 * @param {string} otp
 */
const verifyEmail = async (email, otp) => {
    return await axiosInstance.post('/auth/user/verify-otp', {
        email,
        otp
    })
}
/**
 * @param {string} email
 * @param {string} otp
 */
const verifyResetOtp = async (email, otp) => {
    return await axiosInstance.post('/auth/user/verify-reset-otp', {
        email,
        otp
    })
}
/**
 * @param {string} email
 */
const resendRegisterOtp = async (email) => {
    return await axiosInstance.post('/auth/user/resend-register-otp', {
        email
    })
}
const logoutUser = async () => {
    return await axiosInstance.get('/auth/user/logout');
}
const getMe = async () => {
    return await axiosInstance.get('/auth/user/me')
}
/**
 * @param {string} email
 *  
 */
const forgotPassword = async (email) => {
    return await axiosInstance.post('/auth/user/forgot-password',
        {
            email
        }
    )
}
/**
 * @param {string} email
 * @param {string} password
 */
const resetPassword = async (email, password) => {
    return await axiosInstance.post('/auth/user/reset-password',
        {
            email,
            password
        }
    )
}

export { loginUser, registerUser, logoutUser, getMe, verifyEmail, verifyResetOtp, resendRegisterOtp, forgotPassword, resetPassword }
