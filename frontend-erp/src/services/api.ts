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
                // For Axios 1.x, the recommended way to set headers in interceptors:
                config.headers.set('Authorization', `Bearer ${token}`);
                // config.headers['Authorization'] = `Bearer ${token}`; // Fallback if set() fails
            }
        }
    } catch (err) {
        console.error('Error setting auth header:', err);
    }
    return config;
});

export default api;
