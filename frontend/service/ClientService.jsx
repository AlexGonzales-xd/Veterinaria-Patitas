const API_URL = import.meta.env.VITE_API_URL;

export async function serviceFetch(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const { headers, ...rest } = options;

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...rest,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...(headers || {}),
        },
    });

    const text = await response.text();
    let data = null;

    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }
    }

    if (!response.ok) {
        throw new Error(
            data?.message ||
            data?.error ||
            `Error HTTP ${response.status}`
        );
    }

    return data;
}