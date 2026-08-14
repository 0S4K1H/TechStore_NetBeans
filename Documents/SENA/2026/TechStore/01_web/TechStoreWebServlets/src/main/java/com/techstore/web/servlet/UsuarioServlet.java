package com.techstore.web.servlet;

import com.techstore.web.dao.UsuarioDAO;
import com.techstore.web.model.Usuario;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.util.List;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/usuarios")
public class UsuarioServlet extends HttpServlet {

    private static final String LISTA_JSP = "/WEB-INF/jsp/usuarios.jsp";
    private static final String FORM_JSP = "/WEB-INF/jsp/usuario-form.jsp";
    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        String accion = valor(request.getParameter("accion"), "listar");

        try {
            switch (accion) {
                case "nuevo" -> mostrarFormulario(request, response, crearUsuarioVacio(), "crear", "Nuevo usuario");
                case "editar" -> mostrarEdicion(request, response);
                default -> mostrarListado(request, response);
            }
        } catch (SQLException ex) {
            manejarError(request, response, "No fue posible cargar la información.", ex);
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        String accion = valor(request.getParameter("accion"), "");

        try {
            switch (accion) {
                case "guardar" -> guardarUsuario(request, response);
                case "eliminar" -> eliminarUsuario(request, response);
                default -> response.sendRedirect(request.getContextPath() + "/usuarios");
            }
        } catch (SQLException ex) {
            manejarError(request, response, "Error al procesar la solicitud.", ex);
        }
    }

    private void mostrarListado(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, ServletException, IOException {
        String filtro = request.getParameter("q");
        List<Usuario> usuarios = usuarioDAO.listar(filtro);

        request.setAttribute("usuarios", usuarios);
        request.setAttribute("filtro", filtro == null ? "" : filtro);
        reenviar(request, response, LISTA_JSP);
    }

    private void mostrarFormulario(HttpServletRequest request, HttpServletResponse response, Usuario usuario,
            String modo, String titulo) throws ServletException, IOException {
        request.setAttribute("usuario", usuario);
        request.setAttribute("modo", modo);
        request.setAttribute("titulo", titulo);
        reenviar(request, response, FORM_JSP);
    }

    private void mostrarEdicion(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, ServletException, IOException {
        String id = valor(request.getParameter("id"), "").trim();
        if (id.isEmpty()) {
            redirigirConMensaje(request, response, "usuarios", "error", "Debes indicar el ID del usuario.");
            return;
        }

        Usuario usuario = usuarioDAO.buscarPorId(id);
        if (usuario == null) {
            redirigirConMensaje(request, response, "usuarios", "error", "No se encontró el usuario solicitado.");
            return;
        }

        mostrarFormulario(request, response, usuario, "editar", "Editar usuario");
    }

    private void guardarUsuario(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, IOException, ServletException {
        String modo = valor(request.getParameter("modo"), "crear");
        Usuario usuario = construirUsuario(request);

        if (!"editar".equalsIgnoreCase(modo)) {
            usuario.setIdUsuario(usuarioDAO.siguienteIdUsuario());
        }

        String validacion = validar(usuario);

        if (!validacion.isBlank()) {
            request.setAttribute("usuario", usuario);
            request.setAttribute("modo", modo);
            request.setAttribute("titulo", "editar".equalsIgnoreCase(modo) ? "Editar usuario" : "Nuevo usuario");
            request.setAttribute("error", validacion);
            reenviar(request, response, FORM_JSP);
            return;
        }

        boolean exito = "editar".equalsIgnoreCase(modo)
                ? usuarioDAO.actualizar(usuario)
                : usuarioDAO.crear(usuario);

        if (exito) {
            String mensaje = "editar".equalsIgnoreCase(modo)
                    ? "Usuario actualizado correctamente."
                    : "Usuario creado correctamente.";
            redirigirConMensaje(request, response, "usuarios", "mensaje", mensaje);
        } else {
            request.setAttribute("usuario", usuario);
            request.setAttribute("modo", modo);
            request.setAttribute("titulo", "editar".equalsIgnoreCase(modo) ? "Editar usuario" : "Nuevo usuario");
            request.setAttribute("error", "No fue posible guardar el usuario.");
            reenviar(request, response, FORM_JSP);
        }
    }

    private void eliminarUsuario(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, IOException {
        String id = valor(request.getParameter("id"), "").trim();
        if (id.isEmpty()) {
            redirigirConMensaje(request, response, "usuarios", "error", "Debes indicar el ID a eliminar.");
            return;
        }

        try {
            boolean exito = usuarioDAO.eliminar(id);
            if (exito) {
                redirigirConMensaje(request, response, "usuarios", "mensaje", "Usuario inactivado correctamente.");
            } else {
                redirigirConMensaje(request, response, "usuarios", "error",
                        "No se pudo inactivar el usuario. Verifica si ya estaba inactivo o si el ID no existe.");
            }
        } catch (SQLException ex) {
            redirigirConMensaje(request, response, "usuarios", "error",
                    "No fue posible inactivar el usuario por un problema de base de datos.");
        }
    }

    private Usuario construirUsuario(HttpServletRequest request) {
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(valor(request.getParameter("idUsuario"), "").trim());
        usuario.setUsername(valor(request.getParameter("username"), "").trim());
        usuario.setPasswordDemo(valor(request.getParameter("passwordDemo"), "").trim());
        usuario.setRol(valor(request.getParameter("rol"), "").trim().toLowerCase());
        usuario.setNombre(valor(request.getParameter("nombre"), "").trim());
        usuario.setEmail(valor(request.getParameter("email"), "").trim());
        usuario.setCiudad(valor(request.getParameter("ciudad"), "").trim());
        String activo = valor(request.getParameter("activo"), "1").trim();
        usuario.setActivo(Integer.parseInt(activo.isBlank() ? "1" : activo));
        return usuario;
    }

    private String validar(Usuario usuario) {
        StringBuilder errores = new StringBuilder();

        if (usuario.getIdUsuario() == null || usuario.getIdUsuario().isBlank()) {
            errores.append("El ID del usuario es obligatorio. ");
        }
        if (usuario.getUsername() == null || usuario.getUsername().isBlank()) {
            errores.append("El nombre de usuario es obligatorio. ");
        }
        if (usuario.getPasswordDemo() == null || usuario.getPasswordDemo().isBlank()) {
            errores.append("La contraseña demo es obligatoria. ");
        }
        if (usuario.getRol() == null || usuario.getRol().isBlank()) {
            errores.append("El rol es obligatorio. ");
        }
        if (usuario.getNombre() == null || usuario.getNombre().isBlank()) {
            errores.append("El nombre completo es obligatorio. ");
        }
        if (usuario.getEmail() == null || usuario.getEmail().isBlank()) {
            errores.append("El correo es obligatorio. ");
        } else if (!usuario.getEmail().contains("@")) {
            errores.append("El correo no es válido. ");
        }
        if (usuario.getCiudad() == null || usuario.getCiudad().isBlank()) {
            errores.append("La ciudad es obligatoria. ");
        }
        if (usuario.getActivo() != 0 && usuario.getActivo() != 1) {
            errores.append("El estado activo debe ser 1 o 0. ");
        }

        return errores.toString().trim();
    }

    private Usuario crearUsuarioVacio() {
        Usuario usuario = new Usuario();
        usuario.setActivo(1);
        usuario.setRol("cliente");
        try {
            usuario.setIdUsuario(usuarioDAO.siguienteIdUsuario());
        } catch (SQLException ex) {
            usuario.setIdUsuario("");
        }
        return usuario;
    }

    private void reenviar(HttpServletRequest request, HttpServletResponse response, String jsp)
            throws ServletException, IOException {
        RequestDispatcher rd = request.getRequestDispatcher(jsp);
        rd.forward(request, response);
    }

    private void redirigirConMensaje(HttpServletRequest request, HttpServletResponse response,
            String ruta, String parametro, String mensaje) throws IOException {
        String valor = URLEncoder.encode(mensaje, StandardCharsets.UTF_8);
        response.sendRedirect(request.getContextPath() + "/" + ruta + "?" + parametro + "=" + valor);
    }

    private void manejarError(HttpServletRequest request, HttpServletResponse response, String mensaje, Exception ex)
            throws ServletException, IOException {
        request.setAttribute("error", mensaje);
        request.setAttribute("detalle", ex.getMessage());
        request.setAttribute("usuario", crearUsuarioVacio());
        request.setAttribute("modo", "crear");
        request.setAttribute("titulo", "Nuevo usuario");
        reenviar(request, response, FORM_JSP);
    }

    private String valor(String texto, String defecto) {
        return texto == null ? defecto : texto;
    }
}
