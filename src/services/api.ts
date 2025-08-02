const API_BASE_URL = 'http://localhost:5000';

function getToken() {
    return localStorage.getItem('token');
}

async function request(method: string, url: string, data?: any) {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const options: RequestInit = {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
    };
    if (method === 'GET' || method === 'DELETE') {
        delete options.body;
    }
    const response = await fetch(`${API_BASE_URL}${url}`, options);
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(result.message || 'API error');
    }
    return result;
}

export const api = {
    get: (url: string) => request('GET', url),
    post: (url: string, data?: any) => request('POST', url, data),
    put: (url: string, data?: any) => request('PUT', url, data),
    delete: (url: string) => request('DELETE', url),
}; 