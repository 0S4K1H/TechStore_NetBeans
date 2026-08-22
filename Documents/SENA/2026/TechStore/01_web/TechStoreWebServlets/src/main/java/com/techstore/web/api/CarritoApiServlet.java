package com.techstore.web.api;

import com.techstore.web.dao.CarritoDAO;
import com.techstore.web.dao.CarritoDetalleDAO;
import com.techstore.web.dao.PedidoDAO;
import com.techstore.web.dao.PedidoDetalleDAO;
import com.techstore.web.dao.PedidoTimelineDAO;
import com.techstore.web.dao.ProductoDAO;
import com.techstore.web.model.Carrito;
import com.techstore.web.model.CarritoDetalle;
import com.techstore.web.model.Pedido;
import com.techstore.web.model.PedidoDetalle;
import com.techstore.web.model.Producto;
import com.techstore.web.model.Usuario;
import com.techstore.web.util.ApiSupport;
import com.techstore.web.util.Conexion;
import com.techstore.web.util.Json;
import java.io.IOException;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.List;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/carritos/*")
public class CarritoApiServlet extends HttpServlet {

    private final CarritoDAO carritoDAO = new CarritoDAO();
    private final CarritoDetalleDAO detalleDAO = new CarritoDetalleDAO();
    private final ProductoDAO productoDAO = new ProductoDAO();
    private final PedidoDAO pedidoDAO = new PedidoDAO();
    private final PedidoDetalleDAO pedidoDetalleDAO = new PedidoDetalleDAO();
    private final PedidoTimelineDAO timelineDAO = new PedidoTimelineDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario usuario = ApiSupport.requireAuth(request, response);
        if (usuario == null) return;

        String[] segments = ApiSupport.pathSegments(request);
        try {
            if (segments.length == 0) {
                List<Carrito> carritos = carritoDAO.listar(request.getParameter("q"));
                if (!ApiSupport.isInterno(usuario)) {
                    carritos = carritos.stream().filter(c -> usuario.getIdUsuario().equals(c.getIdUsuario())).toList();
                }
                Json.write(response, HttpServletResponse.SC_OK, carritos);
                return;
            }

            Long idCarrito = parseId(segments[0], response);
            if (idCarrito == null) return;

            Carrito carrito = carritoDAO.buscarPorId(idCarrito);
            if (carrito == null || !puedeVer(usuario, carrito.getIdUsuario())) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Carrito no encontrado.");
                return;
            }

            if (segments.length == 1) {
                Json.write(response, HttpServletResponse.SC_OK, carrito);
                return;
            }

            if (segments.length == 2 && "items".equals(segments[1])) {
                Json.write(response, HttpServletResponse.SC_OK, detalleDAO.listarPorCarrito(idCarrito));
                return;
            }

            Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Ruta no encontrada.");
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible consultar carritos.");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario usuario = ApiSupport.requireAuth(request, response);
        if (usuario == null) return;

        String[] segments = ApiSupport.pathSegments(request);

        if (segments.length == 0) {
            crearCarrito(request, response, usuario);
            return;
        }

        Long idCarrito = parseId(segments[0], response);
        if (idCarrito == null) return;

        if (segments.length == 2 && "items".equals(segments[1])) {
            agregarItem(request, response, usuario, idCarrito);
            return;
        }

        if (segments.length == 2 && "checkout".equals(segments[1])) {
            checkout(request, response, usuario, idCarrito);
            return;
        }

        Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Ruta no encontrada.");
    }

    private void crearCarrito(HttpServletRequest request, HttpServletResponse response, Usuario usuario) throws IOException {
        try {
            Carrito carrito = Json.read(request, Carrito.class);
            carrito.setIdCarrito(null);

            if (!ApiSupport.isInterno(usuario)) {
                carrito.setIdUsuario(usuario.getIdUsuario());
            }
            if (carrito.getIdUsuario() == null || carrito.getIdUsuario().isBlank()) {
                Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "El usuario del carrito es obligatorio.");
                return;
            }
            if (carrito.getEstado() == null || carrito.getEstado().isBlank()) {
                carrito.setEstado("activo");
            }

            boolean creado = carritoDAO.crear(carrito);
            if (!creado) {
                Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible crear el carrito.");
                return;
            }
            Json.write(response, HttpServletResponse.SC_CREATED, carrito);
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible crear el carrito.");
        }
    }

    private void agregarItem(HttpServletRequest request, HttpServletResponse response, Usuario usuario, Long idCarrito)
            throws IOException {
        try {
            Carrito carrito = carritoDAO.buscarPorId(idCarrito);
            if (carrito == null || !puedeVer(usuario, carrito.getIdUsuario())) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Carrito no encontrado.");
                return;
            }
            if (!"activo".equals(carrito.getEstado())) {
                Json.writeError(response, HttpServletResponse.SC_CONFLICT, "El carrito ya está cerrado.");
                return;
            }

            ItemBody body = Json.read(request, ItemBody.class);
            if (body.idProducto() == null || body.idProducto().isBlank()) {
                Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "El producto es obligatorio.");
                return;
            }
            int cantidad = body.cantidad() == null || body.cantidad() < 1 ? 1 : body.cantidad();

            Producto producto = productoDAO.buscarPorId(body.idProducto());
            if (producto == null || producto.getActivo() != 1) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Producto no encontrado o inactivo.");
                return;
            }

            detalleDAO.agregar(idCarrito, producto.getIdProducto(), cantidad, producto.getPrecio());
            Json.write(response, HttpServletResponse.SC_CREATED, detalleDAO.listarPorCarrito(idCarrito));
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible agregar el producto.");
        }
    }

    private void checkout(HttpServletRequest request, HttpServletResponse response, Usuario usuario, Long idCarrito)
            throws IOException {
        try {
            Carrito carrito = carritoDAO.buscarPorId(idCarrito);
            if (carrito == null || !puedeVer(usuario, carrito.getIdUsuario())) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Carrito no encontrado.");
                return;
            }
            if (!"activo".equals(carrito.getEstado())) {
                Json.writeError(response, HttpServletResponse.SC_CONFLICT, "El carrito ya está cerrado.");
                return;
            }

            List<CarritoDetalle> items = detalleDAO.listarPorCarrito(idCarrito);
            if (items.isEmpty()) {
                Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "El carrito está vacío.");
                return;
            }

            CheckoutBody body = Json.read(request, CheckoutBody.class);
            Usuario cliente = ApiSupport.isInterno(usuario) ? usuario : usuario;

            BigDecimal subtotal = com.techstore.web.util.PedidoTotales.sumarSubtotales(
                    items.stream().map(CarritoDetalle::getSubtotal).toList());
            BigDecimal costoEnvio = body.costoEnvio() == null ? BigDecimal.ZERO : BigDecimal.valueOf(body.costoEnvio());
            BigDecimal descuento = body.descuento() == null ? BigDecimal.ZERO : BigDecimal.valueOf(body.descuento());
            BigDecimal total = com.techstore.web.util.PedidoTotales.calcularTotal(subtotal, costoEnvio, descuento);

            Pedido pedido = new Pedido();
            pedido.setIdPedido(pedidoDAO.siguienteIdPedido());
            pedido.setIdUsuarioCliente(carrito.getIdUsuario());
            pedido.setIdUsuarioEmpleado(null);
            pedido.setEmpleadoAsignado("Sin asignar");
            pedido.setNombreCliente(valorODefecto(body.nombreCliente(), cliente.getNombre()));
            pedido.setEmailCliente(valorODefecto(body.emailCliente(), cliente.getEmail()));
            pedido.setTelefono(valorODefecto(body.telefono(), ""));
            pedido.setDireccion(valorODefecto(body.direccion(), ""));
            pedido.setCiudad(valorODefecto(body.ciudad(), cliente.getCiudad()));
            pedido.setFechaPedido(Date.valueOf(LocalDate.now()));
            pedido.setFechaEstimada(Date.valueOf(LocalDate.now().plusDays(5)));
            pedido.setTransportadora(valorODefecto(body.transportadora(), "Por asignar"));
            pedido.setSubtotal(subtotal);
            pedido.setCostoEnvio(costoEnvio);
            pedido.setDescuento(descuento);
            pedido.setTotal(total);
            pedido.setEstado("pendiente");
            pedido.setPrioridad("media");
            pedido.setMetodoPago(valorODefecto(body.metodoPago(), "Por definir"));
            pedido.setNota(valorODefecto(body.nota(), ""));

            try (Connection conexion = Conexion.getConnection()) {
                conexion.setAutoCommit(false);
                try {
                    pedidoDAO.crear(conexion, pedido);

                    for (CarritoDetalle item : items) {
                        PedidoDetalle detalle = new PedidoDetalle();
                        detalle.setIdPedido(pedido.getIdPedido());
                        detalle.setIdProducto(item.getIdProducto());
                        detalle.setNombreProducto(item.getNombreProducto());
                        detalle.setCategoria(item.getCategoria());
                        detalle.setCantidad(item.getCantidad());
                        detalle.setPrecioUnitario(item.getPrecioUnitario());
                        detalle.setSubtotal(item.getSubtotal());
                        pedidoDetalleDAO.crear(conexion, detalle);
                    }

                    timelineDAO.insertar(conexion, pedido.getIdPedido(), "Pedido creado desde el carrito #" + idCarrito + ".");
                    carritoDAO.cerrar(conexion, idCarrito);

                    conexion.commit();
                } catch (SQLException ex) {
                    conexion.rollback();
                    throw ex;
                } finally {
                    conexion.setAutoCommit(true);
                }
            }

            Json.write(response, HttpServletResponse.SC_CREATED, pedido);
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible completar la compra.");
        }
    }

    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario usuario = ApiSupport.requireAuth(request, response);
        if (usuario == null) return;

        String[] segments = ApiSupport.pathSegments(request);

        if (segments.length == 3 && "items".equals(segments[1])) {
            actualizarItem(request, response, usuario, segments);
            return;
        }

        if (segments.length == 1 && ApiSupport.isInterno(usuario)) {
            actualizarCarrito(request, response, segments[0]);
            return;
        }

        Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Ruta no encontrada.");
    }

    private void actualizarItem(HttpServletRequest request, HttpServletResponse response, Usuario usuario, String[] segments)
            throws IOException {
        try {
            Long idCarrito = parseId(segments[0], response);
            if (idCarrito == null) return;
            String idProducto = segments[2];

            Carrito carrito = carritoDAO.buscarPorId(idCarrito);
            if (carrito == null || !puedeVer(usuario, carrito.getIdUsuario())) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Carrito no encontrado.");
                return;
            }

            ItemBody body = Json.read(request, ItemBody.class);
            int cantidad = body.cantidad() == null ? 1 : body.cantidad();
            if (cantidad < 1) {
                Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "La cantidad debe ser al menos 1.");
                return;
            }

            boolean actualizado = detalleDAO.actualizarCantidad(idCarrito, idProducto, cantidad);
            if (!actualizado) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "El producto no está en el carrito.");
                return;
            }
            Json.write(response, HttpServletResponse.SC_OK, detalleDAO.listarPorCarrito(idCarrito));
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible actualizar el producto.");
        }
    }

    private void actualizarCarrito(HttpServletRequest request, HttpServletResponse response, String rawId) throws IOException {
        try {
            Long idCarrito = parseId(rawId, response);
            if (idCarrito == null) return;

            Carrito carrito = Json.read(request, Carrito.class);
            carrito.setIdCarrito(idCarrito);

            boolean actualizado = carritoDAO.actualizar(carrito);
            if (!actualizado) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Carrito no encontrado.");
                return;
            }
            Json.write(response, HttpServletResponse.SC_OK, carrito);
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible actualizar el carrito.");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario usuario = ApiSupport.requireAuth(request, response);
        if (usuario == null) return;

        String[] segments = ApiSupport.pathSegments(request);
        if (segments.length == 0) {
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "Debes indicar el ID del carrito.");
            return;
        }

        try {
            Long idCarrito = parseId(segments[0], response);
            if (idCarrito == null) return;

            Carrito carrito = carritoDAO.buscarPorId(idCarrito);
            if (carrito == null || !puedeVer(usuario, carrito.getIdUsuario())) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Carrito no encontrado.");
                return;
            }

            if (segments.length == 3 && "items".equals(segments[1])) {
                boolean eliminado = detalleDAO.eliminar(idCarrito, segments[2]);
                if (!eliminado) {
                    Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "El producto no está en el carrito.");
                    return;
                }
                Json.write(response, HttpServletResponse.SC_OK, detalleDAO.listarPorCarrito(idCarrito));
                return;
            }

            if (segments.length == 1) {
                boolean eliminado = carritoDAO.eliminar(idCarrito);
                if (!eliminado) {
                    Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Carrito no encontrado o ya cerrado.");
                    return;
                }
                Json.write(response, HttpServletResponse.SC_OK, new OkBody(true));
                return;
            }

            Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Ruta no encontrada.");
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible completar la solicitud.");
        }
    }

    private Long parseId(String raw, HttpServletResponse response) throws IOException {
        try {
            return Long.valueOf(raw);
        } catch (NumberFormatException ex) {
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "ID de carrito inválido.");
            return null;
        }
    }

    private boolean puedeVer(Usuario usuario, String idUsuario) {
        return ApiSupport.isInterno(usuario) || usuario.getIdUsuario().equals(idUsuario);
    }

    private String valorODefecto(String valor, String defecto) {
        return valor == null || valor.isBlank() ? (defecto == null ? "" : defecto) : valor;
    }

    private record ItemBody(String idProducto, Integer cantidad) {
    }

    private record CheckoutBody(
            String nombreCliente,
            String emailCliente,
            String telefono,
            String direccion,
            String ciudad,
            String transportadora,
            String metodoPago,
            String nota,
            Double costoEnvio,
            Double descuento) {
    }

    private record OkBody(boolean ok) {
    }
}
