import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true
})

export default axiosInstance