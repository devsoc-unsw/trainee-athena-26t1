import axios from "axios";
import { getAccessToken } from "./auth";

/** Axios instance for API calls. Auth token is attached automatically when logged in. */
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

export type RegisterResponse = {
    userId: string;
    email: string;
};

export type LoginResponse = {
    userId: string;
    email: string;
    accessToken: string;
};

export async function registerUser(email: string, password: string) {
    const response = await api.post<RegisterResponse>("/api/auth/register", {
        email,
        password,
    });
    return response.data;
}

export async function loginUser(email: string, password: string) {
    const response = await api.post<LoginResponse>("/api/auth/login", {
        email,
        password,
    });
    return response.data;
}

export async function changePassword(currentPassword: string, newPassword: string) {
    const response = await api.post<{ message: string }>("/api/auth/change-password", {
        currentPassword,
        newPassword,
    });
    return response.data;
}

api.interceptors.request.use((config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});