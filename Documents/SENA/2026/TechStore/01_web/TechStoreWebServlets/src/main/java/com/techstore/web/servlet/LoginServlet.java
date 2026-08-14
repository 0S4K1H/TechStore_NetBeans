package com.techstore.web.servlet;

import com.techstore.web.dao.UsuarioDAO;
import com.techstore.web.model.Usuario;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

    private static final String LOGIN_JSP = "/login.jsp";
    private static final String INDEX = "/index.jsp";
    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("usuarioAutenticado") != null) {
            response.sendRedirect(request.getContextPath() + INDEX);
            return;
        }

        reenviar(request, response, LOGIN_JSP);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        String usuarioIngresado = valor(request.getParameter("usuario"), "");
        String password = valor(request.getParameter("password"), "");

        if (usuarioIngresado.isBlank() || password.isBlank()) {
            redirigirConError(request, response, "Debes completar usuario y contraseña.");
            return;
        }

        try {
            Usuario usuario = usuarioDAO.autenticar(usuarioIngresado, password);
            if (usuario == null) {
                redirigirConError(request, response, "Usuario o contraseña inválidos.");
                return;
            }

            HttpSession session = request.getSession(true);
            session.setMaxInactiveInterval(60 * 60);
            session.setAttribute("usuarioAutenticado", usuario);
            session.setAttribute("rolAutenticado", usuario.getRol());
            session.setAttribute("nombreAutenticado", usuario.getNombre());
            session.setAttribute("usernameAutenticado", usuario.getUsername());
            String destino = destinoSeguro(request.getParameter("redirect"), INDEX);
            response.sendRedirect(request.getContextPath() + destino);
        } catch (SQLException ex) {
            redirigirConError(request, response, "No fue posible validar las credenciales.");
        }
    }

    private void reenviar(HttpServletRequest request, HttpServletResponse response, String jsp)
            throws ServletException, IOException {
        RequestDispatcher rd = request.getRequestDispatcher(jsp);
        rd.forward(request, response);
    }

    private void redirigirConError(HttpServletRequest request, HttpServletResponse response, String mensaje)
            throws IOException {
        String valor = URLEncoder.encode(mensaje, StandardCharsets.UTF_8);
        response.sendRedirect(request.getContextPath() + LOGIN_JSP + "?error=" + valor);
    }

    private String valor(String texto, String defecto) {
        return texto == null ? defecto : texto.trim();
    }

    private String destinoSeguro(String redirect, String defecto) {
        String destino = valor(redirect, defecto);
        if (!destino.startsWith("/")) {
            return defecto;
        }
        if (destino.contains("://") || destino.contains("..")) {
            return defecto;
        }
        return destino;
    }
}
