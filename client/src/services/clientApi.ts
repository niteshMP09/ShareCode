type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: unknown;
    headers?: Record<string, string>;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function apiClient<T>(
    url: string,
    options: RequestOptions = {}
): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${url}`, {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ message: res.statusText }));
        throw new Error((error as { message?: string }).message || 'API Error');
    }

    return res.json() as Promise<T>;
}
