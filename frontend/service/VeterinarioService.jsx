import { serviceFetch } from './ClientService';

export function listarVeterinarios() {
    return serviceFetch('/veterinarios');
}

export function crearVeterinario({
    nombre,
    especialidad,
    telefono,
}) {
    return serviceFetch('/veterinarios', {
        method: 'POST',
        body: JSON.stringify({
            nombre,
            especialidad,
            telefono,
        }),
    });
}

export function actualizarVeterinario(id, { nombre, especialidad, telefono }) {
    return serviceFetch(`/veterinarios/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ nombre, especialidad, telefono }),
    });
}

export function eliminarVeterinario(id) {
    return serviceFetch(`/veterinarios/${id}`, {
        method: 'DELETE',
    });
}