package com.vet.backend.repository;

import com.vet.backend.dto.MascotaDTO;
import com.vet.backend.model.Mascota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

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

    @Query("""
        SELECT new com.vet.backend.dto.MascotaDTO(
            m.id, m.nombre, m.raza, m.peso, m.genero,
            a.id, a.nombre)
        FROM Mascota m
        JOIN m.apoderado a
        WHERE a.id = :idApoderado
        ORDER BY m.id
    """)
    List<MascotaDTO> listarConDuenoPorApoderado(@Param("idApoderado") Long idApoderado);
}