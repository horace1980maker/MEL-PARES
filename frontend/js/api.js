/**
 * Cliente API REST para MEL-PARES Dashboard.
 */
const API_BASE = '/api';

const api = {
    async get(endpoint, params = {}) {
        const url = new URL(endpoint, window.location.origin);
        Object.entries(params).forEach(([k, v]) => {
            if (v !== null && v !== undefined && v !== '') url.searchParams.set(k, v);
        });
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
    },

    async post(endpoint, data) {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
    },

    async patch(endpoint, data) {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
    },

    async patchAuth(endpoint, data, token) {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) {
            const detail = await res.json().catch(() => ({}));
            throw new Error(detail.detail || `API error: ${res.status}`);
        }
        return res.json();
    },

    async download(endpoint, filename, params = {}) {
        const url = new URL(endpoint, window.location.origin);
        Object.entries(params).forEach(([k, v]) => {
            if (v !== null && v !== undefined && v !== '') url.searchParams.set(k, v);
        });
        const res = await fetch(url);
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const blob = await res.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(link.href);
    },

    // Shortcuts
    indicadores: (params) => api.get(`${API_BASE}/indicadores`, params),
    preguntas: () => api.get(`${API_BASE}/preguntas`),
    instrumentos: () => api.get(`${API_BASE}/instrumentos`),
    hitos: (params) => api.get(`${API_BASE}/hitos`, params),
    organizaciones: () => api.get(`${API_BASE}/organizaciones`),
    paisajes: () => api.get(`${API_BASE}/paisajes`),
    pilotos: (params) => api.get(`${API_BASE}/pilotos`, params),
    mediciones: (params) => api.get(`${API_BASE}/mediciones`, params),
    evidencias: (params) => api.get(`${API_BASE}/evidencias`, params),
    progreso: (params) => api.get(`${API_BASE}/agregacion/progreso`, params),
    resumen: () => api.get(`${API_BASE}/agregacion/resumen`),
    cortes: () => api.get(`${API_BASE}/cortes`),
    quickUpdate: (data) => api.patch('/mediciones/quick-update', data),
    melSocios: (params) => api.get(`${API_BASE}/mel-socios`, params),
    melSociosResumen: (params) => api.get(`${API_BASE}/mel-socios/resumen`, params),
    melSociosOrganizaciones: () => api.get(`${API_BASE}/mel-socios/organizaciones`),
    melSociosLogin: (data) => api.post('/mel-socios/login', data),
    melSociosUpdate: (id, data, token) => api.patchAuth(`/mel-socios/${id}`, data, token),
    melSociosExport: (params) => api.download(`${API_BASE}/mel-socios/export`, 'mel-socios.xlsx', params),
    melProyecto: (params) => api.get(`${API_BASE}/mel-proyecto`, params),
    melProyectoResumen: () => api.get(`${API_BASE}/mel-proyecto/resumen`),
    melProyectoLogin: (data) => api.post('/mel-proyecto/login', data),
    melProyectoUpdate: (id, data, token) => api.patchAuth(`/mel-proyecto/${id}`, data, token),
    melProyectoExport: (params) => api.download(`${API_BASE}/mel-proyecto/export`, 'mel-proyecto.xlsx', params),
};
