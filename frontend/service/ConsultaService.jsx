import { serviceFetch } from './ClientService';

// LISTAR
export function listarCitas() {
    return serviceFetch('/consultas');
}

// LISTAR POR VETERINARIO
export function listarCitasPorVeterinario(idVeterinario) {
    return serviceFetch(`/consultas/veterinario/${idVeterinario}`);
}

// LISTAR POR MASCOTA
export function listarCitasPorMascota(idMascota) {
    return serviceFetch(`/consultas/mascota/${idMascota}`);
}

// CREAR
export function agendarCita({
    fecha,
    idApoderado,
    idVeterinario,
    idMascota
}) {
    const params = new URLSearchParams({
        fecha,
        idApoderado,
        idVeterinario,
        idMascota
    });

    return serviceFetch(`/consultas/rapida?${params.toString()}`, {
        method: 'POST'
    });
}

// EDITAR
export function editarCita(id, {
    fecha,
    idApoderado,
    idVeterinario,
    idMascota
}) {
    return serviceFetch(`/consultas/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            fechaCon: fecha,
            apoderado: { id: Number(idApoderado) },
            veterinario: { id: Number(idVeterinario) },
            mascota: { id: Number(idMascota) }
        })
    });
}

// ELIMINAR
export function eliminarCita(id) {
    return serviceFetch(`/consultas/${id}`, {
        method: 'DELETE'
    });
}