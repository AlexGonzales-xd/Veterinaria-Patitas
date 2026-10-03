import { serviceFetch } from "./ClientService";
const KEY = "vet_user";

function post(path, body) {
    return serviceFetch(`/auth/${path}`, {
        method: "POST",
        body: JSON.stringify(body),
    });
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

export function estaAutenticado() {
    return Boolean(getSession());
}
