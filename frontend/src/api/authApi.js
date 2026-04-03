
import axiosInstance from "./axiosInstance";

const loginUser = async (email, password) => {
    return await axiosInstance.post('/auth/user/login',
        {
            email,
            password
        }
    )
}

const registerUser = async (name, email, password) => {
    return await axiosInstance.post('/auth/user/register',
        {
            name,
            email,
            password
        })
}

const verifyEmail = async (email, otp) => {
    return await axiosInstance.post('/auth/user/verify-otp', {
        email,
        otp
    })
}
const verifyResetOtp = async (email, otp) => {
    return await axiosInstance.post('/auth/user/verify-reset-otp', {
        email,
        otp
    })
}
const logoutUser = async () => {
    return await axiosInstance.get('/auth/user/logout');
}
const getMe = async () => {
    return await axiosInstance.get('/auth/user/me')
}

const forgotPassword = async (email) =>
{
    return await axiosInstance.post('/auth/user/forgot-password',
        {
            email
        }
    )
}

const resetPassword = async (email, password) =>
{
    return await axiosInstance.post('/auth/user/reset-password',
        {
            email,
            password
        }
    )
}

export { loginUser, registerUser, logoutUser, getMe, verifyEmail, verifyResetOtp, forgotPassword, resetPassword }
