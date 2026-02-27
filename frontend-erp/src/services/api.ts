import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5140/api/v1';
export const BASE_API_URL = API_URL.replace('/v1', '');

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    try {
        const storageData = localStorage.getItem('auth-storage');
        if (storageData) {
            const parsed = JSON.parse(storageData);
            const token = parsed?.state?.token;
            if (token) {
                config.headers.set('Authorization', `Bearer ${token}`);
            }
        }
    } catch (err) {
        console.error('Error setting auth header:', err);
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('auth-storage');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
