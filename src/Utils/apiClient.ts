import axios, { AxiosHeaders } from 'axios';

const defaultApiBaseUrl = process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:8800';

export const API_BASE_URL = (process.env.REACT_APP_API_URL || defaultApiBaseUrl).replace(/\/+$/, '');

export const buildApiUrl = (path: string) =>
    `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
});

api.interceptors.request.use((config) => {
    const method = (config.method || 'get').toLowerCase();

    if (method === 'get') {
        config.params = {
            ...(config.params || {}),
            _ts: Date.now()
        };
    }

    if (typeof config.url === 'string' && (config.url.startsWith('/me') || config.url.startsWith('/logout'))) {
        const headers = AxiosHeaders.from(config.headers || {});
        headers.set('Cache-Control', 'no-cache');
        headers.set('Pragma', 'no-cache');
        config.headers = headers;
    }

    return config;
});

export default api;
