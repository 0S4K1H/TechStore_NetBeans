package com.techstore.web.api;

import com.techstore.web.dao.PedidoDAO;
import com.techstore.web.dao.PedidoDetalleDAO;
import com.techstore.web.dao.PedidoTimelineDAO;
import com.techstore.web.model.Pedido;
import com.techstore.web.model.Usuario;
import com.techstore.web.util.ApiSupport;
import com.techstore.web.util.Json;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.SQLException;
import java.util.List;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/pedidos/*")
public class PedidoApiServlet extends HttpServlet {

    private final PedidoDAO pedidoDAO = new PedidoDAO();
    private final PedidoDetalleDAO detalleDAO = new PedidoDetalleDAO();
    private final PedidoTimelineDAO timelineDAO = new PedidoTimelineDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario usuario = ApiSupport.requireAuth(request, response);
        if (usuario == null) {
            return;
        }

        String[] segments = ApiSupport.pathSegments(request);
        try {
            if (segments.length == 0) {
                List<Pedido> pedidos = pedidoDAO.listar(request.getParameter("q"));
                if (!ApiSupport.isInterno(usuario)) {
                    pedidos = pedidos.stream().filter(p -> usuario.getIdUsuario().equals(p.getIdUsuarioCliente())).toList();
                }
                Json.write(response, HttpServletResponse.SC_OK, pedidos);
                return;
            }

            String id = segments[0];
            Pedido pedido = pedidoDAO.buscarPorId(id);
            if (pedido == null || !puedeVer(usuario, pedido.getIdUsuarioCliente())) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Pedido no encontrado.");
                return;
            }

            if (segments.length == 1) {
                Json.write(response, HttpServletResponse.SC_OK, pedido);
                return;
            }

            if (segments.length == 2 && "timeline".equals(segments[1])) {
                Json.write(response, HttpServletResponse.SC_OK, timelineDAO.listarPorPedido(id));
                return;
            }

            if (segments.length == 2 && "items".equals(segments[1])) {
                Json.write(response, HttpServletResponse.SC_OK, detalleDAO.listarPorPedido(id));
                return;
            }

            Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Ruta no encontrada.");
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible consultar pedidos.");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario usuario = ApiSupport.requireAuth(request, response);
        if (usuario == null) {
            return;
        }

        try {
            Pedido pedido = Json.read(request, Pedido.class);

            if (!ApiSupport.isInterno(usuario)) {
                // Un cliente solo puede crear pedidos propios.
                pedido.setIdUsuarioCliente(usuario.getIdUsuario());
                pedido.setNombreCliente(usuario.getNombre());
                pedido.setEmailCliente(usuario.getEmail());
            }

            if (pedido.getIdPedido() == null || pedido.getIdPedido().isBlank()) {
                pedido.setIdPedido(pedidoDAO.siguienteIdPedido());
            }
            if (pedido.getEstado() == null || pedido.getEstado().isBlank()) {
                pedido.setEstado("pendiente");
            }
            if (pedido.getPrioridad() == null || pedido.getPrioridad().isBlank()) {
                pedido.setPrioridad("media");
            }
            if (pedido.getSubtotal() == null) pedido.setSubtotal(BigDecimal.ZERO);
            if (pedido.getCostoEnvio() == null) pedido.setCostoEnvio(BigDecimal.ZERO);
            if (pedido.getDescuento() == null) pedido.setDescuento(BigDecimal.ZERO);
            if (pedido.getTotal() == null) {
                pedido.setTotal(com.techstore.web.util.PedidoTotales.calcularTotal(
                        pedido.getSubtotal(), pedido.getCostoEnvio(), pedido.getDescuento()));
            }

            String error = validar(pedido);
            if (error != null) {
                Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, error);
                return;
            }

            boolean creado = pedidoDAO.crear(pedido);
            if (!creado) {
                Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible crear el pedido.");
                return;
            }
            timelineDAO.insertar(pedido.getIdPedido(), "Pedido registrado.");
            Json.write(response, HttpServletResponse.SC_CREATED, pedido);
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible crear el pedido.");
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
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "Debes indicar el ID del pedido.");
            return;
        }

        try {
            Pedido pedido = Json.read(request, Pedido.class);
            pedido.setIdPedido(id);

            String error = validar(pedido);
            if (error != null) {
                Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, error);
                return;
            }

            boolean actualizado = pedidoDAO.actualizar(pedido);
            if (!actualizado) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Pedido no encontrado.");
                return;
            }
            timelineDAO.insertar(id, "Estado actualizado a \"" + pedido.getEstado() + "\".");
            Json.write(response, HttpServletResponse.SC_OK, pedido);
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible actualizar el pedido.");
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
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "Debes indicar el ID del pedido.");
            return;
        }

        try {
            boolean eliminado = pedidoDAO.eliminar(id);
            if (!eliminado) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Pedido no encontrado o ya cancelado.");
                return;
            }
            Json.write(response, HttpServletResponse.SC_OK, new OkBody(true));
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible cancelar el pedido.");
        }
    }

    private boolean puedeVer(Usuario usuario, String idUsuarioCliente) {
        return ApiSupport.isInterno(usuario) || usuario.getIdUsuario().equals(idUsuarioCliente);
    }

    private String validar(Pedido pedido) {
        if (pedido.getIdUsuarioCliente() == null || pedido.getIdUsuarioCliente().isBlank()) {
            return "El cliente del pedido es obligatorio.";
        }
        if (pedido.getNombreCliente() == null || pedido.getNombreCliente().isBlank()) {
            return "El nombre del cliente es obligatorio.";
        }
        return null;
    }

    private record OkBody(boolean ok) {
    }
}
