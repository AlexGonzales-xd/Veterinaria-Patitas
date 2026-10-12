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

// POST /api/auth/register -> crea el usuario con rol 4 (apoderado) y su ficha con el teléfono
export function register(username, email, password, telefono) {
    return post("register", { username, email, password, telefono });
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

// Normaliza el nombre del rol del backend a: "admin" | "veterinario" | "apoderado"
export function getRol(usuario) {
    const nombre = (usuario?.rol || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    if (nombre.includes("admin")) return "admin";
    if (nombre.includes("veterin")) return "veterinario";
    return "apoderado";
}