package com.techstore.web.servlet;

import com.techstore.web.dao.ProveedorDAO;
import com.techstore.web.model.Proveedor;
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

@WebServlet("/proveedores")
public class ProveedorServlet extends HttpServlet {

    private static final String LISTA_JSP = "/WEB-INF/jsp/proveedores.jsp";
    private static final String FORM_JSP = "/WEB-INF/jsp/proveedor-form.jsp";
    private final ProveedorDAO proveedorDAO = new ProveedorDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        String accion = valor(request.getParameter("accion"), "listar");

        try {
            switch (accion) {
                case "nuevo" -> mostrarFormulario(request, response, crearProveedorVacio(), "crear", "Nuevo proveedor");
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
                case "guardar" -> guardarProveedor(request, response);
                case "eliminar" -> eliminarProveedor(request, response);
                default -> response.sendRedirect(request.getContextPath() + "/proveedores");
            }
        } catch (SQLException ex) {
            manejarError(request, response, "Error al procesar la solicitud.", ex);
        }
    }

    private void mostrarListado(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, ServletException, IOException {
        String filtro = request.getParameter("q");
        List<Proveedor> proveedores = proveedorDAO.listar(filtro);

        request.setAttribute("proveedores", proveedores);
        request.setAttribute("filtro", filtro == null ? "" : filtro);
        reenviar(request, response, LISTA_JSP);
    }

    private void mostrarFormulario(HttpServletRequest request, HttpServletResponse response, Proveedor proveedor,
            String modo, String titulo) throws ServletException, IOException, SQLException {
        request.setAttribute("proveedor", proveedor);
        request.setAttribute("modo", modo);
        request.setAttribute("titulo", titulo);
        reenviar(request, response, FORM_JSP);
    }

    private void mostrarEdicion(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, ServletException, IOException {
        String id = valor(request.getParameter("id"), "").trim();
        if (id.isEmpty()) {
            redirigirConMensaje(request, response, "proveedores", "error", "Debes indicar el ID del proveedor.");
            return;
        }

        Proveedor proveedor = proveedorDAO.buscarPorId(id);
        if (proveedor == null) {
            redirigirConMensaje(request, response, "proveedores", "error", "No se encontró el proveedor solicitado.");
            return;
        }

        mostrarFormulario(request, response, proveedor, "editar", "Editar proveedor");
    }

    private void guardarProveedor(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, IOException, ServletException {
        String modo = valor(request.getParameter("modo"), "crear");
        Proveedor proveedor = construirProveedor(request);

        if (!"editar".equalsIgnoreCase(modo)) {
            proveedor.setIdProveedor(proveedorDAO.siguienteIdProveedor());
        }

        String validacion = validar(proveedor);

        if (!validacion.isBlank()) {
            request.setAttribute("proveedor", proveedor);
            request.setAttribute("modo", modo);
            request.setAttribute("titulo", "editar".equalsIgnoreCase(modo) ? "Editar proveedor" : "Nuevo proveedor");
            request.setAttribute("error", validacion);
            reenviar(request, response, FORM_JSP);
            return;
        }

        boolean exito = "editar".equalsIgnoreCase(modo)
                ? proveedorDAO.actualizar(proveedor)
                : proveedorDAO.crear(proveedor);

        if (exito) {
            String mensaje = "editar".equalsIgnoreCase(modo)
                    ? "Proveedor actualizado correctamente."
                    : "Proveedor creado correctamente.";
            redirigirConMensaje(request, response, "proveedores", "mensaje", mensaje);
        } else {
            request.setAttribute("proveedor", proveedor);
            request.setAttribute("modo", modo);
            request.setAttribute("titulo", "editar".equalsIgnoreCase(modo) ? "Editar proveedor" : "Nuevo proveedor");
            request.setAttribute("error", "No fue posible guardar el proveedor.");
            reenviar(request, response, FORM_JSP);
        }
    }

    private void eliminarProveedor(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, IOException {
        String id = valor(request.getParameter("id"), "").trim();
        if (id.isEmpty()) {
            redirigirConMensaje(request, response, "proveedores", "error", "Debes indicar el ID a eliminar.");
            return;
        }

        try {
            boolean exito = proveedorDAO.eliminar(id);
            if (exito) {
                redirigirConMensaje(request, response, "proveedores", "mensaje", "Proveedor eliminado correctamente.");
            } else {
                redirigirConMensaje(request, response, "proveedores", "error",
                        "No se pudo eliminar el proveedor. Verifica que no tenga productos asociados.");
            }
        } catch (SQLException ex) {
            redirigirConMensaje(request, response, "proveedores", "error",
                    "No fue posible eliminar el proveedor por un problema de base de datos.");
        }
    }

    private Proveedor construirProveedor(HttpServletRequest request) {
        Proveedor proveedor = new Proveedor();
        proveedor.setIdProveedor(valor(request.getParameter("idProveedor"), "").trim());
        proveedor.setNombre(valor(request.getParameter("nombre"), "").trim());
        proveedor.setEmail(valor(request.getParameter("email"), "").trim());
        return proveedor;
    }

    private String validar(Proveedor proveedor) {
        StringBuilder errores = new StringBuilder();

        if (proveedor.getIdProveedor() == null || proveedor.getIdProveedor().isBlank()) {
            errores.append("El ID del proveedor es obligatorio. ");
        }
        if (proveedor.getNombre() == null || proveedor.getNombre().isBlank()) {
            errores.append("El nombre del proveedor es obligatorio. ");
        }
        if (proveedor.getEmail() == null || proveedor.getEmail().isBlank()) {
            errores.append("El correo del proveedor es obligatorio. ");
        } else if (!proveedor.getEmail().contains("@")) {
            errores.append("El correo del proveedor no es válido. ");
        }

        return errores.toString().trim();
    }

    private Proveedor crearProveedorVacio() {
        try {
            return new Proveedor(proveedorDAO.siguienteIdProveedor(), null, null);
        } catch (SQLException ex) {
            return new Proveedor();
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
        request.setAttribute("proveedor", crearProveedorVacio());
        request.setAttribute("modo", "crear");
        request.setAttribute("titulo", "Nuevo proveedor");
        reenviar(request, response, FORM_JSP);
    }

    private String valor(String texto, String defecto) {
        return texto == null ? defecto : texto;
    }
}

