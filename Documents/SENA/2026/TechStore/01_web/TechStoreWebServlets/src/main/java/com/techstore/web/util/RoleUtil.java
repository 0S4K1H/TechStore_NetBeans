package com.techstore.web.util;

import com.techstore.web.model.Usuario;
import java.text.Normalizer;
import java.util.Arrays;
import java.util.Locale;

public final class RoleUtil {

    private static final String ADMIN = "administrador";
    private static final String EMPLEADO = "empleado";
    private static final String CLIENTE = "cliente";

    private RoleUtil() {
    }

    public static String normalize(String role) {
        String value = role == null ? "" : role;
        String normalized = Normalizer.normalize(value, Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .toLowerCase(Locale.ROOT)
                .trim();
        return normalized;
    }

    public static String canonical(String role) {
        return switch (normalize(role)) {
            case "admin", ADMIN -> ADMIN;
            case "empleado", "empleado comercial" -> EMPLEADO;
            case "cliente", "cliente registrado" -> CLIENTE;
            default -> normalize(role);
        };
    }

    public static Usuario canonicalize(Usuario usuario) {
        if (usuario != null) {
            usuario.setRol(canonical(usuario.getRol()));
        }
        return usuario;
    }

    public static boolean matchesAny(String role, String... allowedRoles) {
        String normalized = canonical(role);
        return Arrays.stream(allowedRoles)
                .map(RoleUtil::canonical)
                .anyMatch(normalized::equals);
    }

    public static boolean isAdmin(String role) {
        return ADMIN.equals(canonical(role));
    }

    public static boolean isInternal(String role) {
        String normalized = canonical(role);
        return ADMIN.equals(normalized) || EMPLEADO.equals(normalized);
    }
}
