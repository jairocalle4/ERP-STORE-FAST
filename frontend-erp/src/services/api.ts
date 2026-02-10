import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5140/api/v1',
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
