import api from './apiClient';

export type ServerHealth = {
    status: 'ok' | 'degraded' | 'error';
    schemaReady?: boolean;
    missingTables?: string[];
    missingEnvVars?: string[];
    lastDatabaseIssue?: string;
};

export async function fetchServerHealth() {
    const res = await api.get<ServerHealth>('/health/status', { timeout: 2500 });
    return res.data;
}
