import { serviceFetch } from './ClientService';

export function listarMascotas() {
    return serviceFetch('/mascotas');
}

export function crearMascota({
    nombre,
    raza,
    peso,
    genero,
    idApoderado,
}) {
    return serviceFetch('/mascotas', {
        method: 'POST',
        body: JSON.stringify({
            nombre,
            raza,
            peso,
            genero,
            apoderado: {
                id: idApoderado,
            },
        }),
    });
}

export function eliminarMascota(id) {
    return serviceFetch(`/mascotas/${id}`, {
        method: 'DELETE',
    });
}