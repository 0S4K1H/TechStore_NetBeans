package com.techstore.web.api;

import com.techstore.web.dao.ProductoDAO;
import com.techstore.web.model.Producto;
import com.techstore.web.model.Usuario;
import com.techstore.web.util.ApiSupport;
import com.techstore.web.util.Json;
import java.io.IOException;
import java.sql.SQLException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/productos/*")
public class ProductoApiServlet extends HttpServlet {

    private final ProductoDAO productoDAO = new ProductoDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String id = ApiSupport.pathId(request);
        try {
            if (id != null) {
                Producto producto = productoDAO.buscarPorId(id);
                if (producto == null) {
                    Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Producto no encontrado.");
                    return;
                }
                Json.write(response, HttpServletResponse.SC_OK, producto);
                return;
            }
            Json.write(response, HttpServletResponse.SC_OK, productoDAO.listar(request.getParameter("q")));
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible consultar productos.");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario usuario = ApiSupport.requireRole(request, response, "administrador", "empleado");
        if (usuario == null) {
            return;
        }

        try {
            Producto producto = Json.read(request, Producto.class);
            if (producto.getIdProducto() == null || producto.getIdProducto().isBlank()) {
                producto.setIdProducto(productoDAO.siguienteIdProducto());
            }
            if (producto.getCodigoInv() == null || producto.getCodigoInv().isBlank()) {
                producto.setCodigoInv(productoDAO.siguienteCodigoInventario());
            }
            if (producto.getActivo() != 0 && producto.getActivo() != 1) {
                producto.setActivo(1);
            }

            String error = validar(producto);
            if (error != null) {
                Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, error);
                return;
            }

            boolean creado = productoDAO.crear(producto);
            if (!creado) {
                Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible crear el producto.");
                return;
            }
            Json.write(response, HttpServletResponse.SC_CREATED, producto);
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible crear el producto.");
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario usuario = ApiSupport.requireRole(request, response, "administrador", "empleado");
        if (usuario == null) {
            return;
        }

        String id = ApiSupport.pathId(request);
        if (id == null) {
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "Debes indicar el ID del producto.");
            return;
        }

        try {
            Producto producto = Json.read(request, Producto.class);
            producto.setIdProducto(id);

            Producto existente = productoDAO.buscarPorId(id);
            if (existente == null) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Producto no encontrado.");
                return;
            }
            if (producto.getCodigoInv() == null || producto.getCodigoInv().isBlank()) {
                producto.setCodigoInv(existente.getCodigoInv());
            }

            String error = validar(producto);
            if (error != null) {
                Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, error);
                return;
            }

            boolean actualizado = productoDAO.actualizar(producto);
            if (!actualizado) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Producto no encontrado.");
                return;
            }
            Json.write(response, HttpServletResponse.SC_OK, producto);
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible actualizar el producto.");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario usuario = ApiSupport.requireRole(request, response, "administrador", "empleado");
        if (usuario == null) {
            return;
        }

        String id = ApiSupport.pathId(request);
        if (id == null) {
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "Debes indicar el ID del producto.");
            return;
        }

        try {
            boolean eliminado = productoDAO.eliminar(id);
            if (!eliminado) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Producto no encontrado o ya inactivo.");
                return;
            }
            Json.write(response, HttpServletResponse.SC_OK, new OkBody(true));
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible inactivar el producto.");
        }
    }

    private String validar(Producto producto) {
        if (producto.getIdProveedor() == null || producto.getIdProveedor().isBlank()) {
            return "El proveedor es obligatorio.";
        }
        if (producto.getNombre() == null || producto.getNombre().isBlank()) {
            return "El nombre del producto es obligatorio.";
        }
        if (producto.getCategoria() == null || producto.getCategoria().isBlank()) {
            return "La categoría es obligatoria.";
        }
        if (producto.getPrecio() == null || producto.getPrecio().signum() < 0) {
            return "El precio debe ser válido.";
        }
        if (producto.getStock() < 0) {
            return "El stock no puede ser negativo.";
        }
        return null;
    }

    private record OkBody(boolean ok) {
    }
}
