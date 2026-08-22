package com.techstore.web.api.dto;

import com.techstore.web.model.Usuario;
import java.sql.Timestamp;

/** Usuario sin el campo de contraseña, seguro para exponer por la API JSON. */
public record UsuarioPublico(
        String idUsuario,
        String username,
        String rol,
        String nombre,
        String email,
        String ciudad,
        int activo,
        Timestamp fechaRegistro) {

    public static UsuarioPublico from(Usuario usuario) {
        if (usuario == null) {
            return null;
        }
        return new UsuarioPublico(
                usuario.getIdUsuario(),
                usuario.getUsername(),
                usuario.getRol(),
                usuario.getNombre(),
                usuario.getEmail(),
                usuario.getCiudad(),
                usuario.getActivo(),
                usuario.getFechaRegistro());
    }
}
