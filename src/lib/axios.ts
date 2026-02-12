import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://schoolapi.amroaltayeb14.workers.dev/graphql',
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

import { store } from '@/lib/redux/store';
import { logout } from '@/lib/redux/slices/authSlice';

// Interceptor to handle unauthorized errors globally (optional but recommended)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Handle logout logic if needed
            Cookies.remove('auth_token');
            store.dispatch(logout());
        }
        return Promise.reject(error);
    }
);

export default api;
