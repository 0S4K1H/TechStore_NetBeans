package com.techstore.web.servlet;

import com.techstore.web.dao.CarritoDAO;
import com.techstore.web.dao.UsuarioDAO;
import com.techstore.web.model.Carrito;
import com.techstore.web.model.Usuario;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/carritos")
public class CarritoServlet extends HttpServlet {

    private static final String LISTA_JSP = "/WEB-INF/jsp/carritos.jsp";
    private static final String FORM_JSP = "/WEB-INF/jsp/carrito-form.jsp";

    private final CarritoDAO carritoDAO = new CarritoDAO();
    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        String accion = valor(request.getParameter("accion"), "listar");

        try {
            switch (accion) {
                case "nuevo" -> mostrarFormulario(request, response, crearCarritoVacio(), "crear", "Nuevo carrito");
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
                case "guardar" -> guardarCarrito(request, response);
                case "eliminar" -> eliminarCarrito(request, response);
                default -> response.sendRedirect(request.getContextPath() + "/carritos");
            }
        } catch (SQLException ex) {
            manejarError(request, response, "Error al procesar la solicitud.", ex);
        }
    }

    private void mostrarListado(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, ServletException, IOException {
        String filtro = request.getParameter("q");
        List<Carrito> carritos = carritoDAO.listar(filtro);

        request.setAttribute("carritos", carritos);
        request.setAttribute("filtro", filtro == null ? "" : filtro);
        reenviar(request, response, LISTA_JSP);
    }

    private void mostrarFormulario(HttpServletRequest request, HttpServletResponse response, Carrito carrito,
            String modo, String titulo) throws ServletException, IOException, SQLException {
        request.setAttribute("carrito", carrito);
        request.setAttribute("clientes", listarClientesSeguros());
        request.setAttribute("modo", modo);
        request.setAttribute("titulo", titulo);
        reenviar(request, response, FORM_JSP);
    }

    private void mostrarEdicion(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, ServletException, IOException {
        Long idCarrito = parseLongOrNull(valor(request.getParameter("id"), ""));
        if (idCarrito == null || idCarrito <= 0) {
            redirigirConMensaje(request, response, "carritos", "error", "Debes indicar un ID válido.");
            return;
        }

        Carrito carrito = carritoDAO.buscarPorId(idCarrito);
        if (carrito == null) {
            redirigirConMensaje(request, response, "carritos", "error", "No se encontró el carrito solicitado.");
            return;
        }

        mostrarFormulario(request, response, carrito, "editar", "Editar carrito");
    }

    private void guardarCarrito(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, IOException, ServletException {
        String modo = valor(request.getParameter("modo"), "crear");
        Carrito carrito = construirCarrito(request);

        if (!"editar".equalsIgnoreCase(modo)) {
            carrito.setIdCarrito(carritoDAO.siguienteIdCarrito());
        }

        String validacion = validar(carrito);

        if (!validacion.isBlank()) {
            request.setAttribute("carrito", carrito);
            request.setAttribute("clientes", listarClientesSeguros());
            request.setAttribute("modo", modo);
            request.setAttribute("titulo", "editar".equalsIgnoreCase(modo) ? "Editar carrito" : "Nuevo carrito");
            request.setAttribute("error", validacion);
            reenviar(request, response, FORM_JSP);
            return;
        }

        boolean exito = "editar".equalsIgnoreCase(modo)
                ? carritoDAO.actualizar(carrito)
                : carritoDAO.crear(carrito);

        if (exito) {
            String mensaje = "editar".equalsIgnoreCase(modo)
                    ? "Carrito actualizado correctamente."
                    : "Carrito creado correctamente.";
            redirigirConMensaje(request, response, "carritos", "mensaje", mensaje);
        } else {
            request.setAttribute("carrito", carrito);
            request.setAttribute("clientes", listarClientesSeguros());
            request.setAttribute("modo", modo);
            request.setAttribute("titulo", "editar".equalsIgnoreCase(modo) ? "Editar carrito" : "Nuevo carrito");
            request.setAttribute("error", "No fue posible guardar el carrito.");
            reenviar(request, response, FORM_JSP);
        }
    }

    private void eliminarCarrito(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, IOException {
        Long idCarrito = parseLongOrNull(valor(request.getParameter("id"), ""));
        if (idCarrito == null || idCarrito <= 0) {
            redirigirConMensaje(request, response, "carritos", "error", "Debes indicar el ID a eliminar.");
            return;
        }

        try {
            boolean exito = carritoDAO.eliminar(idCarrito);
            if (exito) {
                redirigirConMensaje(request, response, "carritos", "mensaje", "Carrito cerrado correctamente.");
            } else {
                redirigirConMensaje(request, response, "carritos", "error",
                        "No se pudo cerrar el carrito. Verifica si ya estaba cerrado o si el ID no existe.");
            }
        } catch (SQLException ex) {
            redirigirConMensaje(request, response, "carritos", "error",
                    "No fue posible cerrar el carrito por un problema de base de datos.");
        }
    }

    private Carrito construirCarrito(HttpServletRequest request) {
        Carrito carrito = new Carrito();
        carrito.setIdCarrito(parseLongOrNull(valor(request.getParameter("idCarrito"), "").trim()));
        carrito.setIdUsuario(valor(request.getParameter("idUsuario"), "").trim());
        carrito.setEstado(valor(request.getParameter("estado"), "activo").trim().toLowerCase());
        return carrito;
    }

    private String validar(Carrito carrito) {
        StringBuilder errores = new StringBuilder();

        if (carrito.getIdCarrito() != null && carrito.getIdCarrito() <= 0) {
            errores.append("El ID del carrito debe ser válido. ");
        }
        if (carrito.getIdUsuario() == null || carrito.getIdUsuario().isBlank()) {
            errores.append("El cliente es obligatorio. ");
        }
        if (!esEstadoValido(carrito.getEstado())) {
            errores.append("El estado no es válido. ");
        }

        return errores.toString().trim();
    }

    private boolean esEstadoValido(String valor) {
        return "activo".equalsIgnoreCase(valor) || "cerrado".equalsIgnoreCase(valor);
    }

    private List<Usuario> listarClientesSeguros() {
        try {
            return usuarioDAO.listarClientesActivos();
        } catch (SQLException ex) {
            return java.util.Collections.emptyList();
        }
    }

    private Carrito crearCarritoVacio() {
        Carrito carrito = new Carrito();
        carrito.setEstado("activo");
        try {
            carrito.setIdCarrito(carritoDAO.siguienteIdCarrito());
        } catch (SQLException ex) {
            carrito.setIdCarrito(null);
        }
        return carrito;
    }

    private Long parseLongOrNull(String valor) {
        if (valor == null || valor.isBlank()) {
            return null;
        }
        try {
            return Long.valueOf(valor);
        } catch (NumberFormatException ex) {
            return null;
        }
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
        request.setAttribute("carrito", crearCarritoVacio());
        request.setAttribute("clientes", listarClientesSeguros());
        request.setAttribute("modo", "crear");
        request.setAttribute("titulo", "Nuevo carrito");
        reenviar(request, response, FORM_JSP);
    }

    private String valor(String texto, String defecto) {
        return texto == null ? defecto : texto;
    }
}

