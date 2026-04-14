import axios from "axios";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BE_BASE_URL,
});

// Interceptor: antes de cada request, injeta o token JWT no header
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export default api;
