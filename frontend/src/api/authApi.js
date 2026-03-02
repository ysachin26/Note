
import axiosInstance from "./axiosInstance";

const loginUser = async (email, password) => {
 return await  axiosInstance.post('/auth/user/login',
        {
            email,
            password
        }
    )
}

const registerUser =async (name, email, password) => {
 return await  axiosInstance.post('/auth/user/register',
        {
            name,
            email,
            password
        })
}

const logoutUser =async () => {
return await axiosInstance.get('/auth/user/logout');
}
export { loginUser, registerUser, logoutUser }
