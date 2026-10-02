package com.vet.backend.repository;

import com.vet.backend.dto.MascotaDTO;
import com.vet.backend.model.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MascotaRepository extends JpaRepository<Mascota, Long> {

    @Query("""
        SELECT new com.vet.backend.dto.MascotaDTO(
            m.id, m.nombre, m.raza, m.peso, m.genero,
            a.id, a.nombre)
        FROM Mascota m
        JOIN m.apoderado a
        ORDER BY m.id
    """)
    List<MascotaDTO> listarConDueno();
}