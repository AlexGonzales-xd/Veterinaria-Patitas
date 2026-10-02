const API = import.meta.env.VITE_API_URL;
const KEY = "vet_user";

async function post(path, body) {
    let res;
    try {
        res = await fetch(`${API}/api/auth/${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
    } catch {
        throw new Error("No se pudo conectar con el servidor. Verifica que el backend este encendido.");
    }

    let data = null;
    try {
        data = await res.json();
    } catch {
        /* respuesta sin JSON */
    }

    if (!res.ok) {
        throw new Error(data?.error || data?.message || "Datos invalidos o error del servidor.");
    }
    return data;
}

// POST /api/auth/login -> { idUsuario, username, email, rol }
export async function login(username, password) {
    const user = await post("login", { username, password });
    localStorage.setItem(KEY, JSON.stringify(user));
    return user;
}

// POST /api/auth/register -> crea el usuario con rol 4 (apoderado)
export function register(username, email, password) {
    return post("register", { username, email, password });
}

export function logout() {
    localStorage.removeItem(KEY);
}

export function getSession() {
    try {
        return JSON.parse(localStorage.getItem(KEY));
    } catch {
        return null;
    }
}