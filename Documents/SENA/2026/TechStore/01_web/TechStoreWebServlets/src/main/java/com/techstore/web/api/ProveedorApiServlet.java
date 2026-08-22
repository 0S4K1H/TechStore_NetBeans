package com.techstore.web.api;

import com.techstore.web.dao.ProveedorDAO;
import com.techstore.web.model.Proveedor;
import com.techstore.web.model.Usuario;
import com.techstore.web.util.ApiSupport;
import com.techstore.web.util.Json;
import java.io.IOException;
import java.sql.SQLException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/proveedores/*")
public class ProveedorApiServlet extends HttpServlet {

    private final ProveedorDAO proveedorDAO = new ProveedorDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        if (ApiSupport.requireRole(request, response, "administrador") == null) {
            return;
        }

        String id = ApiSupport.pathId(request);
        try {
            if (id != null) {
                Proveedor proveedor = proveedorDAO.buscarPorId(id);
                if (proveedor == null) {
                    Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Proveedor no encontrado.");
                    return;
                }
                Json.write(response, HttpServletResponse.SC_OK, proveedor);
                return;
            }
            Json.write(response, HttpServletResponse.SC_OK, proveedorDAO.listar(request.getParameter("q")));
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible consultar proveedores.");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario usuario = ApiSupport.requireRole(request, response, "administrador");
        if (usuario == null) {
            return;
        }

        try {
            Proveedor proveedor = Json.read(request, Proveedor.class);
            if (proveedor.getIdProveedor() == null || proveedor.getIdProveedor().isBlank()) {
                proveedor.setIdProveedor(proveedorDAO.siguienteIdProveedor());
            }
            if (proveedor.getNombre() == null || proveedor.getNombre().isBlank()) {
                Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "El nombre del proveedor es obligatorio.");
                return;
            }

            boolean creado = proveedorDAO.crear(proveedor);
            if (!creado) {
                Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible crear el proveedor.");
                return;
            }
            Json.write(response, HttpServletResponse.SC_CREATED, proveedor);
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible crear el proveedor.");
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario usuario = ApiSupport.requireRole(request, response, "administrador");
        if (usuario == null) {
            return;
        }

        String id = ApiSupport.pathId(request);
        if (id == null) {
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "Debes indicar el ID del proveedor.");
            return;
        }

        try {
            Proveedor proveedor = Json.read(request, Proveedor.class);
            proveedor.setIdProveedor(id);

            if (proveedor.getNombre() == null || proveedor.getNombre().isBlank()) {
                Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "El nombre del proveedor es obligatorio.");
                return;
            }

            boolean actualizado = proveedorDAO.actualizar(proveedor);
            if (!actualizado) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Proveedor no encontrado.");
                return;
            }
            Json.write(response, HttpServletResponse.SC_OK, proveedor);
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible actualizar el proveedor.");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario usuario = ApiSupport.requireRole(request, response, "administrador");
        if (usuario == null) {
            return;
        }

        String id = ApiSupport.pathId(request);
        if (id == null) {
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "Debes indicar el ID del proveedor.");
            return;
        }

        try {
            boolean eliminado = proveedorDAO.eliminar(id);
            if (!eliminado) {
                Json.writeError(response, HttpServletResponse.SC_CONFLICT,
                        "No se puede eliminar: tiene productos asociados o no existe.");
                return;
            }
            Json.write(response, HttpServletResponse.SC_OK, new OkBody(true));
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible eliminar el proveedor.");
        }
    }

    private record OkBody(boolean ok) {
    }
}
