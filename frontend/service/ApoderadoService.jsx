import { serviceFetch } from './ClientService';

export function listarApoderados() {
    return serviceFetch('/apoderados');
}

export function obtenerApoderado(id) {
    return serviceFetch(`/apoderados/${id}`, { objeto: true });
}

export function crearApoderado({ nombre, telefono }) {
    return serviceFetch('/apoderados', {
        method: 'POST',
        body: JSON.stringify({
            nombre,
            telefono,
        }),
    });
}

export function actualizarApoderado(id, { nombre, telefono }) {
    return serviceFetch(`/apoderados/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ nombre, telefono }),
    });
}

export function eliminarApoderado(id) {
    return serviceFetch(`/apoderados/${id}`, {
        method: 'DELETE',
    });
}