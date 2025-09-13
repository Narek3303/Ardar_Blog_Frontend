// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/", // փոխիր քո backend base URL-ը
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // ✅ authToken
        if (token) {
            config.headers["Authorization"] = `Token ${token}`; // ✅ Token {token}
        }
        console.log('Ուղարկվող հարցումը՝', config);  // Լոգավորում ենք հարցման տվյալները
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Unauthorized - logging out');
            localStorage.removeItem('authToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
