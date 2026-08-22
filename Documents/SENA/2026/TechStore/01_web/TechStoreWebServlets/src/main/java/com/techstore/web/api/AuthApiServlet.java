package com.techstore.web.api;

import com.techstore.web.api.dto.UsuarioPublico;
import com.techstore.web.dao.UsuarioDAO;
import com.techstore.web.model.Usuario;
import com.techstore.web.util.ApiSupport;
import com.techstore.web.util.Json;
import com.techstore.web.util.LoginRateLimiter;
import com.techstore.web.util.PasswordUtil;
import com.techstore.web.util.RoleUtil;
import java.io.IOException;
import java.sql.SQLException;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/api/auth/*")
public class AuthApiServlet extends HttpServlet {

    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String pathInfo = request.getPathInfo();
        if (!"/session".equals(pathInfo)) {
            Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Ruta no encontrada.");
            return;
        }

        Usuario usuario = ApiSupport.currentUser(request);
        Json.write(response, HttpServletResponse.SC_OK, UsuarioPublico.from(usuario));
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws IOException, ServletException {
        String pathInfo = request.getPathInfo();

        if ("/login".equals(pathInfo)) {
            login(request, response);
            return;
        }
        if ("/register".equals(pathInfo)) {
            register(request, response);
            return;
        }
        if ("/logout".equals(pathInfo)) {
            logout(request, response);
            return;
        }
        Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Ruta no encontrada.");
    }

    private void login(HttpServletRequest request, HttpServletResponse response) throws IOException {
        LoginBody body;
        try {
            body = Json.read(request, LoginBody.class);
        } catch (IOException ex) {
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "Cuerpo de la solicitud inválido.");
            return;
        }

        if (body.identifier() == null || body.identifier().isBlank()
                || body.password() == null || body.password().isBlank()) {
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "Debes completar usuario y contraseña.");
            return;
        }

        String claveLimite = resolverClaveLimite(body.identifier());

        if (LoginRateLimiter.estaBloqueado(claveLimite)) {
            Json.writeError(response, 429, "Demasiados intentos fallidos. Intenta de nuevo en unos minutos.");
            return;
        }

        try {
            Usuario usuario = usuarioDAO.autenticar(body.identifier(), body.password());
            if (usuario == null) {
                LoginRateLimiter.registrarFallo(claveLimite);
                Json.writeError(response, HttpServletResponse.SC_UNAUTHORIZED, "Usuario o contraseña inválidos.");
                return;
            }
            RoleUtil.canonicalize(usuario);
            LoginRateLimiter.registrarExito(claveLimite);

            HttpSession session = request.getSession(true);
            session.setMaxInactiveInterval(60 * 60);
            session.setAttribute("usuarioAutenticado", usuario);
            session.setAttribute("rolAutenticado", usuario.getRol());
            session.setAttribute("nombreAutenticado", usuario.getNombre());
            session.setAttribute("usernameAutenticado", usuario.getUsername());

            Json.write(response, HttpServletResponse.SC_OK, UsuarioPublico.from(usuario));
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible validar las credenciales.");
        }
    }

    private void register(HttpServletRequest request, HttpServletResponse response) throws IOException {
        RegisterBody body;
        try {
            body = Json.read(request, RegisterBody.class);
        } catch (IOException ex) {
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "Cuerpo de la solicitud inválido.");
            return;
        }

        String username = valor(body.username());
        String email = valor(body.email());
        String password = valor(body.password());
        String nombre = valor(body.nombre());
        String ciudad = valor(body.ciudad());

        if (username.isBlank() || email.isBlank() || password.isBlank() || nombre.isBlank()) {
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST,
                    "Usuario, correo, contraseña y nombre son obligatorios.");
            return;
        }
        if (!email.contains("@") || !email.contains(".")) {
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "El correo no es válido.");
            return;
        }
        if (password.length() < 5) {
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "La contraseña debe tener al menos 5 caracteres.");
            return;
        }

        try {
            if (usuarioDAO.idCanonico(username) != null || usuarioDAO.idCanonico(email) != null) {
                Json.writeError(response, HttpServletResponse.SC_CONFLICT, "Ese usuario o correo ya está registrado.");
                return;
            }

            Usuario nuevo = new Usuario();
            nuevo.setUsername(username);
            nuevo.setEmail(email);
            nuevo.setPasswordDemo(PasswordUtil.hash(password));
            nuevo.setNombre(nombre);
            nuevo.setCiudad(ciudad.isBlank() ? "Sin especificar" : ciudad);
            nuevo.setActivo(1);
            // El rol nunca viene del cliente: toda cuenta autorregistrada es "cliente".
            nuevo.setRol("cliente");

            usuarioDAO.crearConIdAutomatico(nuevo);
            RoleUtil.canonicalize(nuevo);

            HttpSession session = request.getSession(true);
            session.setMaxInactiveInterval(60 * 60);
            session.setAttribute("usuarioAutenticado", nuevo);
            session.setAttribute("rolAutenticado", nuevo.getRol());
            session.setAttribute("nombreAutenticado", nuevo.getNombre());
            session.setAttribute("usernameAutenticado", nuevo.getUsername());

            Json.write(response, HttpServletResponse.SC_CREATED, UsuarioPublico.from(nuevo));
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible crear la cuenta.");
        }
    }

    private String valor(String texto) {
        return texto == null ? "" : texto.trim();
    }

    private void logout(HttpServletRequest request, HttpServletResponse response) throws IOException {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        Json.write(response, HttpServletResponse.SC_OK, new OkBody(true));
    }

    /** Usa el id_usuario canónico como clave del rate limiter para que alternar username/email no evada el bloqueo. */
    private String resolverClaveLimite(String identificador) {
        try {
            String idCanonico = usuarioDAO.idCanonico(identificador);
            return idCanonico != null ? idCanonico : identificador.trim().toLowerCase();
        } catch (SQLException ex) {
            return identificador.trim().toLowerCase();
        }
    }

    private record LoginBody(String identifier, String password) {
    }

    private record RegisterBody(String username, String email, String password, String nombre, String ciudad) {
    }

    private record OkBody(boolean ok) {
    }
}
