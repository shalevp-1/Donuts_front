import axios from 'axios';

const defaultApiBaseUrl = process.env.NODE_ENV === 'production'
    ? 'https://donuts-backend-1.onrender.com'
    : 'http://localhost:8800';

export const API_BASE_URL = (process.env.REACT_APP_API_URL || defaultApiBaseUrl).replace(/\/+$/, '');

export const buildApiUrl = (path: string) =>
    `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

export default api;
