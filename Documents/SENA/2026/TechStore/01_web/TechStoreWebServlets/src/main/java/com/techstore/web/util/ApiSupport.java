package com.techstore.web.util;

import com.techstore.web.model.Usuario;
import java.io.IOException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

public final class ApiSupport {

    private ApiSupport() {
    }

    public static Usuario currentUser(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session == null) {
            return null;
        }
        Object usuario = session.getAttribute("usuarioAutenticado");
        return usuario instanceof Usuario ? (Usuario) usuario : null;
    }

    public static Usuario requireAuth(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario usuario = currentUser(request);
        if (usuario == null) {
            Json.writeError(response, HttpServletResponse.SC_UNAUTHORIZED, "Debes iniciar sesión para continuar.");
            return null;
        }
        return usuario;
    }

    public static Usuario requireRole(HttpServletRequest request, HttpServletResponse response, String... roles)
            throws IOException {
        Usuario usuario = requireAuth(request, response);
        if (usuario == null) {
            return null;
        }
        if (!RoleUtil.matchesAny(usuario.getRol(), roles)) {
            Json.writeError(response, HttpServletResponse.SC_FORBIDDEN, "No tienes permisos para esta acción.");
            return null;
        }
        return usuario;
    }

    public static boolean isAdmin(Usuario usuario) {
        return usuario != null && RoleUtil.isAdmin(usuario.getRol());
    }

    public static boolean isInterno(Usuario usuario) {
        return usuario != null && RoleUtil.isInternal(usuario.getRol());
    }

    public static String pathId(HttpServletRequest request) {
        String[] segments = pathSegments(request);
        return segments.length > 0 ? segments[0] : null;
    }

    /** Splits pathInfo "/5/items/p1" into ["5", "items", "p1"]. Empty array if pathInfo is null/"/". */
    public static String[] pathSegments(HttpServletRequest request) {
        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.isBlank() || "/".equals(pathInfo)) {
            return new String[0];
        }
        String trimmed = pathInfo.startsWith("/") ? pathInfo.substring(1) : pathInfo;
        if (trimmed.endsWith("/")) {
            trimmed = trimmed.substring(0, trimmed.length() - 1);
        }
        return trimmed.split("/");
    }
}
