import { serviceFetch } from './ClientService';

export async function login(username, password) {
    const data = await serviceFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
    });

    // Ajusta "token" al nombre real que devuelva tu backend
    if (data?.token) localStorage.setItem('token', data.token);
    localStorage.setItem('usuario', JSON.stringify(data?.usuario ?? data ?? {}));
    // Si tu backend no usa token, esto sirve igual como "sesión iniciada"
    localStorage.setItem('sesion', 'true');

    return data;
}

export function register(username, email, password, id_rol = 4) {
    return serviceFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password, id_rol }),
    });
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('sesion');
}

export function estaAutenticado() {
    return localStorage.getItem('sesion') === 'true';
}

export function usuarioActual() {
    try {
        return JSON.parse(localStorage.getItem('usuario') || '{}');
    } catch {
        return {};
    }
}