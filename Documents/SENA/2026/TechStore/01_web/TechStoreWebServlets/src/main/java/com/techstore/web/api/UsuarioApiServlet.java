package com.techstore.web.api;

import com.techstore.web.api.dto.UsuarioPublico;
import com.techstore.web.dao.UsuarioDAO;
import com.techstore.web.model.Usuario;
import com.techstore.web.util.ApiSupport;
import com.techstore.web.util.Json;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/usuarios/*")
public class UsuarioApiServlet extends HttpServlet {

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Lectura: admin y empleado (empleado la necesita para asignar clientes a pedidos/carritos/tickets).
        if (ApiSupport.requireRole(request, response, "administrador", "empleado") == null) {
            return;
        }

        String id = ApiSupport.pathId(request);
        try {
            if (id != null) {
                Usuario usuario = usuarioDAO.buscarPorId(id);
                if (usuario == null) {
                    Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Usuario no encontrado.");
                    return;
                }
                Json.write(response, HttpServletResponse.SC_OK, UsuarioPublico.from(usuario));
                return;
            }
            List<UsuarioPublico> usuarios = usuarioDAO.listar(request.getParameter("q")).stream()
                    .map(UsuarioPublico::from)
                    .toList();
            Json.write(response, HttpServletResponse.SC_OK, usuarios);
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible consultar usuarios.");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario actor = ApiSupport.requireRole(request, response, "administrador");
        if (actor == null) {
            return;
        }

        try {
            Usuario usuario = Json.read(request, Usuario.class);
            if (usuario.getIdUsuario() == null || usuario.getIdUsuario().isBlank()) {
                usuario.setIdUsuario(usuarioDAO.siguienteIdUsuario());
            }
            if (usuario.getActivo() != 0 && usuario.getActivo() != 1) {
                usuario.setActivo(1);
            }

            String error = validar(usuario, true);
            if (error != null) {
                Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, error);
                return;
            }
            if (usuarioDAO.existeUsernameOEmail(usuario.getUsername(), usuario.getEmail())) {
                Json.writeError(response, HttpServletResponse.SC_CONFLICT,
                        "El nombre de usuario o el correo ya existe. Usa datos únicos para crear una cuenta nueva.");
                return;
            }

            boolean creado = usuarioDAO.crear(usuario);
            if (!creado) {
                Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible crear el usuario.");
                return;
            }
            Json.write(response, HttpServletResponse.SC_CREATED, UsuarioPublico.from(usuario));
        } catch (java.sql.SQLIntegrityConstraintViolationException ex) {
            Json.writeError(response, HttpServletResponse.SC_CONFLICT,
                    "El nombre de usuario o el correo ya existe. Usa datos únicos para crear una cuenta nueva.");
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible crear el usuario.");
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario actor = ApiSupport.requireRole(request, response, "administrador");
        if (actor == null) {
            return;
        }

        String id = ApiSupport.pathId(request);
        if (id == null) {
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "Debes indicar el ID del usuario.");
            return;
        }

        try {
            Usuario usuario = Json.read(request, Usuario.class);
            usuario.setIdUsuario(id);

            if ((usuario.getPasswordDemo() == null || usuario.getPasswordDemo().isBlank())) {
                Usuario existente = usuarioDAO.buscarPorId(id);
                if (existente == null) {
                    Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Usuario no encontrado.");
                    return;
                }
                usuario.setPasswordDemo(existente.getPasswordDemo());
            }

            String error = validar(usuario, false);
            if (error != null) {
                Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, error);
                return;
            }

            boolean actualizado = usuarioDAO.actualizar(usuario);
            if (!actualizado) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Usuario no encontrado.");
                return;
            }
            Json.write(response, HttpServletResponse.SC_OK, UsuarioPublico.from(usuario));
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible actualizar el usuario.");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario actor = ApiSupport.requireRole(request, response, "administrador");
        if (actor == null) {
            return;
        }

        String id = ApiSupport.pathId(request);
        if (id == null) {
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "Debes indicar el ID del usuario.");
            return;
        }

        try {
            boolean eliminado = usuarioDAO.eliminar(id);
            if (!eliminado) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Usuario no encontrado o ya inactivo.");
                return;
            }
            Json.write(response, HttpServletResponse.SC_OK, new OkBody(true));
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible inactivar el usuario.");
        }
    }

    private String validar(Usuario usuario, boolean requierePassword) {
        if (usuario.getUsername() == null || usuario.getUsername().isBlank()) {
            return "El nombre de usuario es obligatorio.";
        }
        if (usuario.getNombre() == null || usuario.getNombre().isBlank()) {
            return "El nombre es obligatorio.";
        }
        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            return "El correo es obligatorio.";
        }
        if (usuario.getRol() == null || usuario.getRol().isBlank()) {
            return "El rol es obligatorio.";
        }
        if (requierePassword && (usuario.getPasswordDemo() == null || usuario.getPasswordDemo().isBlank())) {
            return "La contraseña es obligatoria.";
        }
        return null;
    }

    private record OkBody(boolean ok) {
    }
}
