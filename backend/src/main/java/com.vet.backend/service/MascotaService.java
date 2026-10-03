package com.vet.backend.service;

import com.vet.backend.dto.MascotaDTO;
import com.vet.backend.model.Mascota;
import com.vet.backend.repository.MascotaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MascotaService {

    private final MascotaRepository mascotaRepository;

    public MascotaService(MascotaRepository mascotaRepository) {
        this.mascotaRepository = mascotaRepository;
    }

    public List<MascotaDTO> listarConDueno() {
        return mascotaRepository.listarConDueno();
    }

    public List<Mascota> listar() {
        return mascotaRepository.findAll();
    }

    public Optional<Mascota> buscarPorId(Long id) {
        return mascotaRepository.findById(id);
    }

    public Mascota guardar(Mascota mascota) {
        return mascotaRepository.save(mascota);
    }

    public Optional<Mascota> actualizar(Long id, Mascota datos) {
        return mascotaRepository.findById(id).map(existente -> {
            existente.setNombre(datos.getNombre());
            existente.setRaza(datos.getRaza());
            existente.setPeso(datos.getPeso());
            existente.setGenero(datos.getGenero());
            existente.setApoderado(datos.getApoderado());
            return mascotaRepository.save(existente);
        });
    }

    public void eliminar(Long id) {
        mascotaRepository.deleteById(id);
    }
}