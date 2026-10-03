export const API_URL = (import.meta.env.VITE_API_URL || "https://veterinaria-patitas-production.up.railway.app/api").replace(/\/$/, "");

export async function serviceFetch(endpoint, options = {}) {
    const { headers, ...rest } = options;

    let response;
    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            ...rest,
            headers: {
                ...(options.body && { 'Content-Type': 'application/json' }),
                ...(headers || {}),
            },
        });
    } catch {
        throw new Error("No se pudo conectar con el backend. Revisa tu conexión y la dirección de la API.");
    }
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
        const detalle = data?.message || data?.error || response.statusText;
        throw new Error(`El backend respondió HTTP ${response.status}: ${detalle}`);
    }

    if ((!options.method || options.method === 'GET') && !Array.isArray(data)) {
        throw new Error("El backend no devolvió una lista válida.");
    }
    return data;
}