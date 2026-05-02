import axios from 'axios'

// Use env var if set during build, otherwise use relative path for current domain
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ||
    (typeof window !== 'undefined' && window.location.hostname !== 'localhost'
        ? `${window.location.origin}/_/backend/api`
        : 'http://localhost:3000/api')

const axiosInstance = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true
})

export default axiosInstance