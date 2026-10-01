
import { serviceFetch } from './ClientService';

export function listarApoderados() {
    return serviceFetch('/apoderados');
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

export function eliminarApoderado(id) {
    return serviceFetch(`/apoderados/${id}`, {
        method: 'DELETE',
    });
}