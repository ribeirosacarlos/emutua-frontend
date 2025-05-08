import axios from "axios";
import { Product } from "@/types/product";

const API_URL = "http://127.0.0.1:8000/api/v1";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);