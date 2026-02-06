import axios from 'axios';
import { config } from './config';
import { useAuthStore } from '../stores/auth';

const apiClient = axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // useAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default apiClient;
