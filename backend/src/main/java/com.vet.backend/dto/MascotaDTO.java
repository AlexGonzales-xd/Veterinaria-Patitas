package com.vet.backend.dto;

import java.math.BigDecimal;

public record MascotaDTO(
        Long id,
        String nombre,
        String raza,
        BigDecimal peso,
        String genero,
        Long idApoderado,
        String nombreApoderado
) {}