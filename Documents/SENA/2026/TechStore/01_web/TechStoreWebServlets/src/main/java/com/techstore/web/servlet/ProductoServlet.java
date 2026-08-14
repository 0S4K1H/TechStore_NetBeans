package com.techstore.web.servlet;

import com.techstore.web.dao.ProductoDAO;
import com.techstore.web.model.Producto;
import com.techstore.web.model.Proveedor;
import java.io.IOException;
import java.math.BigDecimal;
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

@WebServlet("/productos")
public class ProductoServlet extends HttpServlet {

    private static final String LISTA_JSP = "/WEB-INF/jsp/productos.jsp";
    private static final String FORM_JSP = "/WEB-INF/jsp/producto-form.jsp";
    private final ProductoDAO productoDAO = new ProductoDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        String accion = valor(request.getParameter("accion"), "listar");

        try {
            switch (accion) {
                case "nuevo" -> mostrarFormulario(request, response, crearProductoNuevo(), "crear", "Nuevo producto");
                case "editar" -> mostrarEdicion(request, response);
                default -> mostrarListado(request, response);
            }
        } catch (SQLException ex) {
            manejarError(request, response, "No fue posible cargar la informacion.", ex);
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
                case "guardar" -> guardarProducto(request, response);
                case "eliminar" -> eliminarProducto(request, response);
                default -> response.sendRedirect(request.getContextPath() + "/productos");
            }
        } catch (SQLException ex) {
            manejarError(request, response, "Error al procesar la solicitud.", ex);
        }
    }

    private void mostrarListado(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, ServletException, IOException {
        String filtro = request.getParameter("q");
        List<Producto> productos = productoDAO.listar(filtro);

        request.setAttribute("productos", productos);
        request.setAttribute("filtro", filtro == null ? "" : filtro);
        reenviar(request, response, LISTA_JSP);
    }

    private void mostrarFormulario(HttpServletRequest request, HttpServletResponse response, Producto producto,
            String modo, String titulo) throws ServletException, IOException, SQLException {
        request.setAttribute("producto", producto);
        request.setAttribute("proveedores", productoDAO.listarProveedores());
        request.setAttribute("modo", modo);
        request.setAttribute("titulo", titulo);
        reenviar(request, response, FORM_JSP);
    }

    private void mostrarEdicion(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, ServletException, IOException {
        String id = valor(request.getParameter("id"), "").trim();
        if (id.isEmpty()) {
            redirigirConMensaje(request, response, "productos", "error", "Debes indicar el ID del producto.");
            return;
        }

        Producto producto = productoDAO.buscarPorId(id);
        if (producto == null) {
            redirigirConMensaje(request, response, "productos", "error", "No se encontro el producto solicitado.");
            return;
        }

        mostrarFormulario(request, response, producto, "editar", "Editar producto");
    }

    private void guardarProducto(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, IOException, ServletException {
        String modo = valor(request.getParameter("modo"), "crear");
        Producto producto = construirProducto(request);

        if (!"editar".equalsIgnoreCase(modo)) {
            if (producto.getIdProducto() == null || producto.getIdProducto().isBlank()) {
                producto.setIdProducto(productoDAO.siguienteIdProducto());
            }
            if (producto.getCodigoInv() == null || producto.getCodigoInv().isBlank()) {
                producto.setCodigoInv(productoDAO.siguienteCodigoInventario());
            }
        }

        String validacion = validar(producto);

        if (!validacion.isBlank()) {
            request.setAttribute("producto", producto);
            request.setAttribute("proveedores", productoDAO.listarProveedores());
            request.setAttribute("modo", modo);
            request.setAttribute("titulo", "editar".equalsIgnoreCase(modo) ? "Editar producto" : "Nuevo producto");
            request.setAttribute("error", validacion);
            reenviar(request, response, FORM_JSP);
            return;
        }

        boolean exito = "editar".equalsIgnoreCase(modo)
                ? productoDAO.actualizar(producto)
                : productoDAO.crear(producto);

        if (exito) {
            String mensaje = "editar".equalsIgnoreCase(modo)
                    ? "Producto actualizado correctamente."
                    : "Producto creado correctamente.";
            redirigirConMensaje(request, response, "productos", "mensaje", mensaje);
        } else {
            request.setAttribute("producto", producto);
            request.setAttribute("proveedores", productoDAO.listarProveedores());
            request.setAttribute("modo", modo);
            request.setAttribute("titulo", "editar".equalsIgnoreCase(modo) ? "Editar producto" : "Nuevo producto");
            request.setAttribute("error", "No fue posible guardar el producto.");
            reenviar(request, response, FORM_JSP);
        }
    }

    private void eliminarProducto(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, IOException {
        String id = valor(request.getParameter("id"), "").trim();

        if (id.isEmpty()) {
            redirigirConMensaje(request, response, "productos", "error", "Debes indicar el ID a eliminar.");
            return;
        }

        boolean exito = productoDAO.eliminar(id);
        if (exito) {
            redirigirConMensaje(request, response, "productos", "mensaje", "Producto inactivado correctamente.");
        } else {
            redirigirConMensaje(request, response, "productos", "error",
                    "No se pudo inactivar el producto. Verifica si ya estaba inactivo o si el ID no existe.");
        }
    }

    private Producto construirProducto(HttpServletRequest request) {
        Producto producto = new Producto();
        producto.setIdProducto(valor(request.getParameter("idProducto"), "").trim());
        producto.setCodigoInv(valor(request.getParameter("codigoInv"), "").trim());
        producto.setIdProveedor(valor(request.getParameter("idProveedor"), "").trim());
        producto.setNombre(valor(request.getParameter("nombre"), "").trim());
        producto.setCategoria(valor(request.getParameter("categoria"), "").trim().toLowerCase());

        String precio = valor(request.getParameter("precio"), "0").trim();
        String stock = valor(request.getParameter("stock"), "0").trim();
        String activo = valor(request.getParameter("activo"), "1").trim();

        producto.setPrecio(new BigDecimal(precio.isBlank() ? "0" : precio));
        producto.setStock(Integer.parseInt(stock.isBlank() ? "0" : stock));
        producto.setActivo(Integer.parseInt(activo.isBlank() ? "1" : activo));
        return producto;
    }

    private String validar(Producto producto) {
        StringBuilder errores = new StringBuilder();

        if (producto.getIdProducto() == null || producto.getIdProducto().isBlank()) {
            errores.append("El ID del producto es obligatorio. ");
        }
        if (producto.getCodigoInv() == null || producto.getCodigoInv().isBlank()) {
            errores.append("El codigo de inventario es obligatorio. ");
        }
        if (producto.getIdProveedor() == null || producto.getIdProveedor().isBlank()) {
            errores.append("El proveedor es obligatorio. ");
        }
        if (producto.getNombre() == null || producto.getNombre().isBlank()) {
            errores.append("El nombre del producto es obligatorio. ");
        }
        if (producto.getCategoria() == null || producto.getCategoria().isBlank()) {
            errores.append("La categoria es obligatoria. ");
        }
        if (producto.getPrecio() == null || producto.getPrecio().compareTo(BigDecimal.ZERO) < 0) {
            errores.append("El precio debe ser valido. ");
        }
        if (producto.getStock() < 0) {
            errores.append("El stock no puede ser negativo. ");
        }
        if (producto.getActivo() != 0 && producto.getActivo() != 1) {
            errores.append("El estado activo debe ser 1 o 0. ");
        }

        return errores.toString().trim();
    }

    private Producto crearProductoNuevo() throws SQLException {
        Producto producto = new Producto();
        producto.setIdProducto(productoDAO.siguienteIdProducto());
        producto.setCodigoInv(productoDAO.siguienteCodigoInventario());
        producto.setActivo(1);
        return producto;
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
        reenviar(request, response, FORM_JSP);
    }

    private String valor(String texto, String defecto) {
        return texto == null ? defecto : texto;
    }
}
