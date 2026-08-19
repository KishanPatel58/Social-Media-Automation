import axios from "axios";
const VITE_PRODUCT = import.meta.env.VITE_PRODUCTION_URL

const api = axios.create({
    baseURL: VITE_PRODUCT,
    withCredentials: true,
});

export default api;
