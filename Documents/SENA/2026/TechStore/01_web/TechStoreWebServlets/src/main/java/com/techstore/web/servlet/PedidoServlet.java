package com.techstore.web.servlet;

import com.techstore.web.dao.PedidoDAO;
import com.techstore.web.dao.UsuarioDAO;
import com.techstore.web.model.Pedido;
import com.techstore.web.model.Usuario;
import com.techstore.web.util.ApiSupport;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.util.List;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/pedidos")
public class PedidoServlet extends HttpServlet {

    private static final String LISTA_JSP = "/WEB-INF/jsp/pedidos.jsp";
    private static final String FORM_JSP = "/WEB-INF/jsp/pedido-form.jsp";
    private final PedidoDAO pedidoDAO = new PedidoDAO();
    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        String accion = valor(request.getParameter("accion"), "listar");

        try {
            switch (accion) {
                case "nuevo" -> mostrarFormulario(request, response, crearPedidoVacio(), "crear", "Nuevo pedido");
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
                case "guardar" -> guardarPedido(request, response);
                case "eliminar" -> eliminarPedido(request, response);
                default -> response.sendRedirect(request.getContextPath() + "/pedidos");
            }
        } catch (SQLException ex) {
            manejarError(request, response, "Error al procesar la solicitud.", ex);
        }
    }

    private void mostrarListado(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, ServletException, IOException {
        String filtro = request.getParameter("q");
        List<Pedido> pedidos = pedidoDAO.listar(filtro);

        Usuario sesion = ApiSupport.currentUser(request);
        if (sesion != null && !ApiSupport.isInterno(sesion)) {
            // Un cliente solo ve sus propios pedidos en el listado.
            pedidos = pedidos.stream()
                    .filter(p -> sesion.getIdUsuario().equals(p.getIdUsuarioCliente()))
                    .toList();
        }

        request.setAttribute("pedidos", pedidos);
        request.setAttribute("filtro", filtro == null ? "" : filtro);
        reenviar(request, response, LISTA_JSP);
    }

    private void mostrarFormulario(HttpServletRequest request, HttpServletResponse response, Pedido pedido,
            String modo, String titulo) throws ServletException, IOException, SQLException {
        request.setAttribute("pedido", pedido);
        request.setAttribute("clientes", usuarioDAO.listarClientesActivos());
        request.setAttribute("empleados", usuarioDAO.listarEmpleadosActivos());
        request.setAttribute("modo", modo);
        request.setAttribute("titulo", titulo);
        reenviar(request, response, FORM_JSP);
    }

    private void mostrarEdicion(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, ServletException, IOException {
        String id = valor(request.getParameter("id"), "").trim();
        if (id.isEmpty()) {
            redirigirConMensaje(request, response, "pedidos", "error", "Debes indicar el ID del pedido.");
            return;
        }

        Pedido pedido = pedidoDAO.buscarPorId(id);
        if (pedido == null) {
            redirigirConMensaje(request, response, "pedidos", "error", "No se encontró el pedido solicitado.");
            return;
        }
        if (!puedeAcceder(request, pedido.getIdUsuarioCliente())) {
            redirigirConMensaje(request, response, "pedidos", "error", "No tienes permiso para ver este pedido.");
            return;
        }

        mostrarFormulario(request, response, pedido, "editar", "Editar pedido");
    }

    private void guardarPedido(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, IOException, ServletException {
        String modo = valor(request.getParameter("modo"), "crear");
        Pedido pedido = construirPedido(request);

        Usuario sesion = ApiSupport.currentUser(request);
        if (sesion == null) {
            redirigirConMensaje(request, response, "pedidos", "error", "Debes iniciar sesión para continuar.");
            return;
        }

        if ("editar".equalsIgnoreCase(modo)) {
            Pedido existente = pedido.getIdPedido() == null || pedido.getIdPedido().isBlank()
                    ? null : pedidoDAO.buscarPorId(pedido.getIdPedido());
            if (existente == null || !puedeAcceder(request, existente.getIdUsuarioCliente())) {
                redirigirConMensaje(request, response, "pedidos", "error", "No tienes permiso para editar este pedido.");
                return;
            }
        } else {
            pedido.setIdPedido(pedidoDAO.siguienteIdPedido());
            if (!ApiSupport.isInterno(sesion)) {
                // Un cliente solo puede crear pedidos a su propio nombre.
                pedido.setIdUsuarioCliente(sesion.getIdUsuario());
            }
        }

        String validacion = validar(pedido);

        if (!validacion.isBlank()) {
            request.setAttribute("pedido", pedido);
            request.setAttribute("clientes", usuarioDAO.listarClientesActivos());
            request.setAttribute("empleados", usuarioDAO.listarEmpleadosActivos());
            request.setAttribute("modo", modo);
            request.setAttribute("titulo", "editar".equalsIgnoreCase(modo) ? "Editar pedido" : "Nuevo pedido");
            request.setAttribute("error", validacion);
            reenviar(request, response, FORM_JSP);
            return;
        }

        boolean exito = "editar".equalsIgnoreCase(modo)
                ? pedidoDAO.actualizar(pedido)
                : pedidoDAO.crear(pedido);

        if (exito) {
            String mensaje = "editar".equalsIgnoreCase(modo)
                    ? "Pedido actualizado correctamente."
                    : "Pedido creado correctamente.";
            redirigirConMensaje(request, response, "pedidos", "mensaje", mensaje);
        } else {
            request.setAttribute("pedido", pedido);
            request.setAttribute("clientes", usuarioDAO.listarClientesActivos());
            request.setAttribute("empleados", usuarioDAO.listarEmpleadosActivos());
            request.setAttribute("modo", modo);
            request.setAttribute("titulo", "editar".equalsIgnoreCase(modo) ? "Editar pedido" : "Nuevo pedido");
            request.setAttribute("error", "No fue posible guardar el pedido.");
            reenviar(request, response, FORM_JSP);
        }
    }

    private void eliminarPedido(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, IOException {
        String id = valor(request.getParameter("id"), "").trim();
        if (id.isEmpty()) {
            redirigirConMensaje(request, response, "pedidos", "error", "Debes indicar el ID a eliminar.");
            return;
        }

        try {
            Pedido existente = pedidoDAO.buscarPorId(id);
            if (existente == null || !puedeAcceder(request, existente.getIdUsuarioCliente())) {
                redirigirConMensaje(request, response, "pedidos", "error", "No tienes permiso para cancelar este pedido.");
                return;
            }

            boolean exito = pedidoDAO.eliminar(id);
            if (exito) {
                redirigirConMensaje(request, response, "pedidos", "mensaje", "Pedido cancelado correctamente.");
            } else {
                redirigirConMensaje(request, response, "pedidos", "error",
                        "No se pudo cancelar el pedido. Verifica si ya estaba cancelado o si el ID no existe.");
            }
        } catch (SQLException ex) {
            redirigirConMensaje(request, response, "pedidos", "error",
                    "No se pudo cancelar el pedido por un problema de base de datos.");
        }
    }

    private Pedido construirPedido(HttpServletRequest request) {
        Pedido pedido = new Pedido();
        pedido.setIdPedido(valor(request.getParameter("idPedido"), "").trim());
        pedido.setIdUsuarioCliente(valor(request.getParameter("idUsuarioCliente"), "").trim());
        pedido.setIdUsuarioEmpleado(valor(request.getParameter("idUsuarioEmpleado"), "").trim());
        pedido.setEmpleadoAsignado(valor(request.getParameter("empleadoAsignado"), "Sin asignar").trim());
        pedido.setNombreCliente(valor(request.getParameter("nombreCliente"), "").trim());
        pedido.setEmailCliente(valor(request.getParameter("emailCliente"), "").trim());
        pedido.setTelefono(valor(request.getParameter("telefono"), "").trim());
        pedido.setDireccion(valor(request.getParameter("direccion"), "").trim());
        pedido.setCiudad(valor(request.getParameter("ciudad"), "").trim());
        pedido.setFechaPedido(parseDate(valor(request.getParameter("fechaPedido"), "").trim()));
        pedido.setFechaEstimada(parseDate(valor(request.getParameter("fechaEstimada"), "").trim()));
        pedido.setTransportadora(valor(request.getParameter("transportadora"), "").trim());
        pedido.setSubtotal(parseDecimal(valor(request.getParameter("subtotal"), "0").trim()));
        pedido.setCostoEnvio(parseDecimal(valor(request.getParameter("costoEnvio"), "0").trim()));
        pedido.setDescuento(parseDecimal(valor(request.getParameter("descuento"), "0").trim()));
        pedido.setTotal(calcularTotal(pedido.getSubtotal(), pedido.getCostoEnvio(), pedido.getDescuento()));
        pedido.setEstado(valor(request.getParameter("estado"), "pendiente").trim().toLowerCase());
        pedido.setPrioridad(valor(request.getParameter("prioridad"), "media").trim().toLowerCase());
        pedido.setMetodoPago(valor(request.getParameter("metodoPago"), "").trim());
        pedido.setNota(valor(request.getParameter("nota"), "").trim());
        pedido.setFechaCreacion(Timestamp.valueOf(java.time.LocalDateTime.now()));
        return pedido;
    }

    private String validar(Pedido pedido) {
        StringBuilder errores = new StringBuilder();

        if (pedido.getIdPedido() == null || pedido.getIdPedido().isBlank()) {
            errores.append("El ID del pedido es obligatorio. ");
        }
        if (pedido.getIdUsuarioCliente() == null || pedido.getIdUsuarioCliente().isBlank()) {
            errores.append("El cliente es obligatorio. ");
        }
        if (pedido.getNombreCliente() == null || pedido.getNombreCliente().isBlank()) {
            errores.append("El nombre del cliente es obligatorio. ");
        }
        if (pedido.getEmailCliente() == null || pedido.getEmailCliente().isBlank() || !pedido.getEmailCliente().contains("@")) {
            errores.append("El correo del cliente no es válido. ");
        }
        if (pedido.getTelefono() == null || pedido.getTelefono().isBlank()) {
            errores.append("El teléfono es obligatorio. ");
        }
        if (pedido.getDireccion() == null || pedido.getDireccion().isBlank()) {
            errores.append("La dirección es obligatoria. ");
        }
        if (pedido.getCiudad() == null || pedido.getCiudad().isBlank()) {
            errores.append("La ciudad es obligatoria. ");
        }
        if (pedido.getFechaPedido() == null) {
            errores.append("La fecha del pedido es obligatoria. ");
        }
        if (pedido.getFechaEstimada() == null) {
            errores.append("La fecha estimada es obligatoria. ");
        }
        if (pedido.getTransportadora() == null || pedido.getTransportadora().isBlank()) {
            errores.append("La transportadora es obligatoria. ");
        }
        if (pedido.getSubtotal() == null || pedido.getSubtotal().compareTo(BigDecimal.ZERO) < 0) {
            errores.append("El subtotal debe ser válido. ");
        }
        if (pedido.getCostoEnvio() == null || pedido.getCostoEnvio().compareTo(BigDecimal.ZERO) < 0) {
            errores.append("El costo de envío debe ser válido. ");
        }
        if (pedido.getDescuento() == null || pedido.getDescuento().compareTo(BigDecimal.ZERO) < 0) {
            errores.append("El descuento debe ser válido. ");
        }
        if (pedido.getTotal() == null || pedido.getTotal().compareTo(BigDecimal.ZERO) < 0) {
            errores.append("El total debe ser válido. ");
        }
        if (!esEstadoValido(pedido.getEstado())) {
            errores.append("El estado no es válido. ");
        }
        if (!esPrioridadValida(pedido.getPrioridad())) {
            errores.append("La prioridad no es válida. ");
        }
        if (pedido.getMetodoPago() == null || pedido.getMetodoPago().isBlank()) {
            errores.append("El método de pago es obligatorio. ");
        }

        return errores.toString().trim();
    }

    private boolean esEstadoValido(String valor) {
        return "pendiente".equalsIgnoreCase(valor)
                || "preparacion".equalsIgnoreCase(valor)
                || "enviado".equalsIgnoreCase(valor)
                || "entregado".equalsIgnoreCase(valor)
                || "cancelado".equalsIgnoreCase(valor);
    }

    private boolean esPrioridadValida(String valor) {
        return "baja".equalsIgnoreCase(valor)
                || "media".equalsIgnoreCase(valor)
                || "alta".equalsIgnoreCase(valor);
    }

    private BigDecimal parseDecimal(String valor) {
        return new BigDecimal(valor.isBlank() ? "0" : valor);
    }

    private Date parseDate(String valor) {
        return (valor == null || valor.isBlank()) ? null : Date.valueOf(LocalDate.parse(valor));
    }

    private BigDecimal calcularTotal(BigDecimal subtotal, BigDecimal costoEnvio, BigDecimal descuento) {
        BigDecimal total = subtotal.add(costoEnvio).subtract(descuento);
        return total.compareTo(BigDecimal.ZERO) < 0 ? BigDecimal.ZERO : total;
    }

    private Pedido crearPedidoVacio() {
        Pedido pedido = new Pedido();
        try {
            pedido.setIdPedido(pedidoDAO.siguienteIdPedido());
        } catch (SQLException ex) {
            pedido.setIdPedido("");
        }
        pedido.setEstado("pendiente");
        pedido.setPrioridad("media");
        pedido.setFechaPedido(Date.valueOf(LocalDate.now()));
        pedido.setFechaEstimada(Date.valueOf(LocalDate.now().plusDays(3)));
        pedido.setEmpleadoAsignado("Sin asignar");
        return pedido;
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
        request.setAttribute("pedido", crearPedidoVacio());
        request.setAttribute("clientes", listarUsuariosSeguros(() -> usuarioDAO.listarClientesActivos()));
        request.setAttribute("empleados", listarUsuariosSeguros(() -> usuarioDAO.listarEmpleadosActivos()));
        request.setAttribute("modo", "crear");
        request.setAttribute("titulo", "Nuevo pedido");
        reenviar(request, response, FORM_JSP);
    }

    private List<Usuario> listarUsuariosSeguros(ProveedorUsuarios proveedor) {
        try {
            return proveedor.obtener();
        } catch (SQLException ex) {
            return java.util.Collections.emptyList();
        }
    }

    private String valor(String texto, String defecto) {
        return texto == null ? defecto : texto;
    }

    /** Personal interno ve/edita cualquier pedido; un cliente solo el suyo. */
    private boolean puedeAcceder(HttpServletRequest request, String idUsuarioCliente) {
        Usuario sesion = ApiSupport.currentUser(request);
        if (sesion == null) {
            return false;
        }
        return ApiSupport.isInterno(sesion) || sesion.getIdUsuario().equals(idUsuarioCliente);
    }

    @FunctionalInterface
    private interface ProveedorUsuarios {
        List<Usuario> obtener() throws SQLException;
    }
}

