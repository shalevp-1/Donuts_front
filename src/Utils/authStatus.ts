import api from './apiClient';

export type AuthStatus = {
    status: string;
    authenticated: boolean;
    id: number | null;
    name: string;
    role: string;
    points: number;
    purchaseCount: number;
    totalSpent: number;
};

const defaultAuthStatus: AuthStatus = {
    status: 'Success',
    authenticated: false,
    id: null,
    name: '',
    role: '',
    points: 0,
    purchaseCount: 0,
    totalSpent: 0
};

export async function fetchAuthStatus() {
    try {
        const res = await api.get<AuthStatus>('/auth/status');
        return res.data;
    } catch {
        return defaultAuthStatus;
    }
}
