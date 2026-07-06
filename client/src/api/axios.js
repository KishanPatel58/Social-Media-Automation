import axios from "axios";
const Environment = import.meta.env.PRODUCT_ON
const VITE_DEVELOPMENT = import.meta.env.VITE_BASE_DEVELOPMENT_URL
const VITE_PRODUCTION = import.meta.env.VITE_BASE_PRODUCTION_URL

const VITE_URL = Environment==="development" ? VITE_DEVELOPMENT : VITE_PRODUCTION
const api = axios.create({
    baseURL: "http://localhost:3000"
});
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); 

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;