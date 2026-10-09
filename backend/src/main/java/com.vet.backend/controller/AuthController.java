package com.vet.backend.controller;

import com.vet.backend.dto.AuthRequest;
import com.vet.backend.dto.AuthResponse;
import com.vet.backend.model.Apoderado;
import com.vet.backend.model.Rol;
import com.vet.backend.model.Usuario;
import com.vet.backend.repository.ApoderadoRepository;
import com.vet.backend.repository.RolRepository;
import com.vet.backend.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final ApoderadoRepository apoderadoRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioRepository usuarioRepository,
                          RolRepository rolRepository,
                          ApoderadoRepository apoderadoRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.apoderadoRepository = apoderadoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<Object> register(@Valid @RequestBody AuthRequest req) {
        if (usuarioRepository.existsByUsername(req.getUsername())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "El username ya existe"));
        }
        if (req.getEmail() == null || req.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "El email es obligatorio"));
        }
        if (usuarioRepository.existsByEmail(req.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "El email ya existe"));
        }

        // El registro publico SIEMPRE crea apoderados (rol 4); se ignora cualquier id_rol enviado.
        // Los admins y veterinarios se crean directamente en la base de datos.
        int idRol = 4;
        Optional<Rol> rolOpt = rolRepository.findById(idRol);
        if (rolOpt.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Rol " + idRol + " no existe"));
        }
        Rol rol = rolOpt.get();

        Usuario usuario = new Usuario();
        usuario.setUsername(req.getUsername());
        usuario.setEmail(req.getEmail());
        usuario.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        usuario.setRol(rol);
        usuario.setEstado(true);

        // Si se registra como apoderado, se crea su ficha de apoderado y se vincula al usuario.
        // El telefono es un valor provisional (la columna es NOT NULL); el admin puede corregirlo luego.
        if (idRol == 4) {
            Apoderado apoderado = new Apoderado();
            apoderado.setNombre(req.getUsername());
            apoderado.setTelefono("000000000");
            usuario.setApoderado(apoderadoRepository.save(apoderado));
        }

        Usuario guardado = usuarioRepository.save(usuario);

        AuthResponse body = new AuthResponse(guardado.getId(), guardado.getUsername(),
                guardado.getEmail(), rol.getNombreRol(),
                guardado.getApoderado() != null ? guardado.getApoderado().getId() : null,
                null);
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody AuthRequest req) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(req.getUsername());

        if (usuarioOpt.isEmpty() || !passwordEncoder.matches(req.getPassword(), usuarioOpt.get().getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales incorrectas"));
        }

        Usuario u = usuarioOpt.get();

        // Toda cuenta con rol apoderado (id 4) debe tener su ficha de apoderado.
        // Si no la tiene (cuentas creadas antes o a mano en la base de datos), se crea y vincula ahora.
        if (u.getApoderado() == null && u.getRol() != null
                && Integer.valueOf(4).equals(u.getRol().getIdRol())) {
            Apoderado ficha = new Apoderado();
            ficha.setNombre(u.getUsername());
            ficha.setTelefono("000000000");
            u.setApoderado(apoderadoRepository.save(ficha));
        }

        u.setUltimoLogin(LocalDateTime.now());
        u.setIntentosFallidos(0);
        usuarioRepository.save(u);

        AuthResponse body = new AuthResponse(
                u.getId(), u.getUsername(), u.getEmail(),
                u.getRol() != null ? u.getRol().getNombreRol() : null,
                u.getApoderado() != null ? u.getApoderado().getId() : null,
                u.getVeterinario() != null ? u.getVeterinario().getId() : null);
        return ResponseEntity.ok(body);
    }
}