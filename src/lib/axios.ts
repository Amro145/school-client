import axios from 'axios';
import Cookies from 'js-cookie';

import toast from 'react-hot-toast';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8787/graphql', // Use localhost as dev fallback, or better yet throw if not set in prod
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor to add the token to every request
api.interceptors.request.use(
    (config) => {
        const token = Cookies.get('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor to handle unauthorized errors globally
let unauthorizedHandler: (() => void) | null = null;

export const setUnauthorizedHandler = (handler: () => void) => {
    unauthorizedHandler = handler;
};

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.errors?.[0]?.message || error.response?.data?.message || error.message || 'An unexpected error occurred';

        if (error.response?.status === 401) {
            Cookies.remove('auth_token');
            if (unauthorizedHandler) {
                unauthorizedHandler();
            }
            toast.error('Session expired. Please login again.');
        } else {
            toast.error(message);
        }

        return Promise.reject(error);
    }
);

export default api;
