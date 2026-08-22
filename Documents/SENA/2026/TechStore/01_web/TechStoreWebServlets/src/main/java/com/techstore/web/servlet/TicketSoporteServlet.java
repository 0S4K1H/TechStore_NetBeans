package com.techstore.web.servlet;

import com.techstore.web.dao.TicketSoporteDAO;
import com.techstore.web.dao.UsuarioDAO;
import com.techstore.web.model.TicketSoporte;
import com.techstore.web.model.Usuario;
import com.techstore.web.util.ApiSupport;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/tickets")
public class TicketSoporteServlet extends HttpServlet {

    private static final String LISTA_JSP = "/WEB-INF/jsp/tickets.jsp";
    private static final String FORM_JSP = "/WEB-INF/jsp/ticket-form.jsp";
    private static final DateTimeFormatter FORMATO = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
    private final TicketSoporteDAO ticketDAO = new TicketSoporteDAO();
    private final UsuarioDAO usuarioDAO = new UsuarioDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        response.setContentType("text/html;charset=UTF-8");

        String accion = valor(request.getParameter("accion"), "listar");

        try {
            switch (accion) {
                case "nuevo" -> mostrarFormulario(request, response, crearTicketVacio(), "crear", "Nuevo ticket");
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
                case "guardar" -> guardarTicket(request, response);
                case "eliminar" -> eliminarTicket(request, response);
                default -> response.sendRedirect(request.getContextPath() + "/tickets");
            }
        } catch (SQLException ex) {
            manejarError(request, response, "Error al procesar la solicitud.", ex);
        }
    }

    private void mostrarListado(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, ServletException, IOException {
        String filtro = request.getParameter("q");
        List<TicketSoporte> tickets = ticketDAO.listar(filtro);

        Usuario sesion = ApiSupport.currentUser(request);
        if (sesion != null && !ApiSupport.isInterno(sesion)) {
            // Un cliente solo ve sus propios tickets en el listado.
            tickets = tickets.stream()
                    .filter(t -> sesion.getIdUsuario().equals(t.getIdUsuarioCliente()))
                    .toList();
        }

        request.setAttribute("tickets", tickets);
        request.setAttribute("filtro", filtro == null ? "" : filtro);
        reenviar(request, response, LISTA_JSP);
    }

    private void mostrarFormulario(HttpServletRequest request, HttpServletResponse response, TicketSoporte ticket,
            String modo, String titulo) throws ServletException, IOException, SQLException {
        request.setAttribute("ticket", ticket);
        request.setAttribute("clientes", usuarioDAO.listarClientesActivos());
        request.setAttribute("modo", modo);
        request.setAttribute("titulo", titulo);
        reenviar(request, response, FORM_JSP);
    }

    private void mostrarEdicion(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, ServletException, IOException {
        String id = valor(request.getParameter("id"), "").trim();
        if (id.isEmpty()) {
            redirigirConMensaje(request, response, "tickets", "error", "Debes indicar el ID del ticket.");
            return;
        }

        TicketSoporte ticket = ticketDAO.buscarPorId(id);
        if (ticket == null) {
            redirigirConMensaje(request, response, "tickets", "error", "No se encontró el ticket solicitado.");
            return;
        }
        if (!puedeAcceder(request, ticket.getIdUsuarioCliente())) {
            redirigirConMensaje(request, response, "tickets", "error", "No tienes permiso para ver este ticket.");
            return;
        }

        mostrarFormulario(request, response, ticket, "editar", "Editar ticket");
    }

    private void guardarTicket(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, IOException, ServletException {
        String modo = valor(request.getParameter("modo"), "crear");
        TicketSoporte ticket = construirTicket(request);

        Usuario sesion = ApiSupport.currentUser(request);
        if (sesion == null) {
            redirigirConMensaje(request, response, "tickets", "error", "Debes iniciar sesión para continuar.");
            return;
        }

        if ("editar".equalsIgnoreCase(modo)) {
            TicketSoporte existente = ticket.getIdTicket() == null || ticket.getIdTicket().isBlank()
                    ? null : ticketDAO.buscarPorId(ticket.getIdTicket());
            if (existente == null || !puedeAcceder(request, existente.getIdUsuarioCliente())) {
                redirigirConMensaje(request, response, "tickets", "error", "No tienes permiso para editar este ticket.");
                return;
            }
            if (!ApiSupport.isInterno(sesion)) {
                // Un cliente no puede reasignar su ticket a otro dueño ni cambiar campos de triage.
                ticket.setIdUsuarioCliente(existente.getIdUsuarioCliente());
                ticket.setEstado(existente.getEstado());
            }
        } else {
            ticket.setIdTicket(ticketDAO.siguienteIdTicket());
            if (!ApiSupport.isInterno(sesion)) {
                // Un cliente solo puede abrir tickets a su propio nombre.
                ticket.setIdUsuarioCliente(sesion.getIdUsuario());
            }
        }

        String validacion = validar(ticket);

        if (!validacion.isBlank()) {
            request.setAttribute("ticket", ticket);
            request.setAttribute("clientes", usuarioDAO.listarClientesActivos());
            request.setAttribute("modo", modo);
            request.setAttribute("titulo", "editar".equalsIgnoreCase(modo) ? "Editar ticket" : "Nuevo ticket");
            request.setAttribute("error", validacion);
            reenviar(request, response, FORM_JSP);
            return;
        }

        boolean exito = "editar".equalsIgnoreCase(modo)
                ? ticketDAO.actualizar(ticket)
                : ticketDAO.crear(ticket);

        if (exito) {
            String mensaje = "editar".equalsIgnoreCase(modo)
                    ? "Ticket actualizado correctamente."
                    : "Ticket creado correctamente.";
            redirigirConMensaje(request, response, "tickets", "mensaje", mensaje);
        } else {
            request.setAttribute("ticket", ticket);
            request.setAttribute("clientes", usuarioDAO.listarClientesActivos());
            request.setAttribute("modo", modo);
            request.setAttribute("titulo", "editar".equalsIgnoreCase(modo) ? "Editar ticket" : "Nuevo ticket");
            request.setAttribute("error", "No fue posible guardar el ticket.");
            reenviar(request, response, FORM_JSP);
        }
    }

    private void eliminarTicket(HttpServletRequest request, HttpServletResponse response)
            throws SQLException, IOException {
        String id = valor(request.getParameter("id"), "").trim();
        if (id.isEmpty()) {
            redirigirConMensaje(request, response, "tickets", "error", "Debes indicar el ID a eliminar.");
            return;
        }

        TicketSoporte existente = ticketDAO.buscarPorId(id);
        if (existente == null || !puedeAcceder(request, existente.getIdUsuarioCliente())) {
            redirigirConMensaje(request, response, "tickets", "error", "No tienes permiso para cerrar este ticket.");
            return;
        }

        boolean exito = ticketDAO.eliminar(id);
        if (exito) {
            redirigirConMensaje(request, response, "tickets", "mensaje", "Ticket cerrado correctamente.");
        } else {
            redirigirConMensaje(request, response, "tickets", "error",
                    "No se pudo cerrar el ticket. Verifica si ya estaba cerrado o si el ID no existe.");
        }
    }

    private TicketSoporte construirTicket(HttpServletRequest request) {
        TicketSoporte ticket = new TicketSoporte();
        ticket.setIdTicket(valor(request.getParameter("idTicket"), "").trim());
        ticket.setIdUsuarioCliente(valor(request.getParameter("idUsuarioCliente"), "").trim());
        ticket.setAsunto(valor(request.getParameter("asunto"), "").trim());
        ticket.setMensaje(valor(request.getParameter("mensaje"), "").trim());
        ticket.setEstado(valor(request.getParameter("estado"), "abierto").trim().toLowerCase());
        ticket.setFechaCreacion(parseFecha(valor(request.getParameter("fechaCreacion"), "").trim(), true));
        ticket.setFechaCierre(parseFecha(valor(request.getParameter("fechaCierre"), "").trim(), false));
        return ticket;
    }

    private String validar(TicketSoporte ticket) {
        StringBuilder errores = new StringBuilder();

        if (ticket.getIdTicket() == null || ticket.getIdTicket().isBlank()) {
            errores.append("El ID del ticket es obligatorio. ");
        }
        if (ticket.getIdUsuarioCliente() == null || ticket.getIdUsuarioCliente().isBlank()) {
            errores.append("El cliente es obligatorio. ");
        }
        if (ticket.getAsunto() == null || ticket.getAsunto().isBlank()) {
            errores.append("El asunto es obligatorio. ");
        }
        if (ticket.getMensaje() == null || ticket.getMensaje().isBlank()) {
            errores.append("El mensaje es obligatorio. ");
        }
        if (ticket.getEstado() == null || ticket.getEstado().isBlank()) {
            errores.append("El estado es obligatorio. ");
        }
        if (!"abierto".equalsIgnoreCase(ticket.getEstado())
                && !"en_proceso".equalsIgnoreCase(ticket.getEstado())
                && !"cerrado".equalsIgnoreCase(ticket.getEstado())) {
            errores.append("El estado no es válido. ");
        }
        if (ticket.getFechaCreacion() == null) {
            errores.append("La fecha de creación es obligatoria. ");
        }

        return errores.toString().trim();
    }

    private TicketSoporte crearTicketVacio() {
        TicketSoporte ticket = new TicketSoporte();
        try {
            ticket.setIdTicket(ticketDAO.siguienteIdTicket());
        } catch (SQLException ex) {
            ticket.setIdTicket("");
        }
        ticket.setEstado("abierto");
        ticket.setFechaCreacion(Timestamp.valueOf(LocalDateTime.now()));
        return ticket;
    }

    private Timestamp parseFecha(String valor, boolean defectoAhora) {
        if (valor == null || valor.isBlank()) {
            return defectoAhora ? Timestamp.valueOf(LocalDateTime.now()) : null;
        }
        LocalDateTime fecha = LocalDateTime.parse(valor, FORMATO);
        return Timestamp.valueOf(fecha);
    }

    private String formatear(Timestamp timestamp) {
        return timestamp == null ? "" : timestamp.toLocalDateTime().format(FORMATO);
    }

    private void reenviar(HttpServletRequest request, HttpServletResponse response, String jsp)
            throws ServletException, IOException {
        request.setAttribute("formatearFecha", (java.util.function.Function<Timestamp, String>) this::formatear);
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
        request.setAttribute("ticket", crearTicketVacio());
        try {
            request.setAttribute("clientes", usuarioDAO.listarClientesActivos());
        } catch (SQLException sqlEx) {
            request.setAttribute("clientes", java.util.Collections.emptyList());
        }
        request.setAttribute("modo", "crear");
        request.setAttribute("titulo", "Nuevo ticket");
        reenviar(request, response, FORM_JSP);
    }

    private String valor(String texto, String defecto) {
        return texto == null ? defecto : texto;
    }

    /** Personal interno ve/edita cualquier ticket; un cliente solo el suyo. */
    private boolean puedeAcceder(HttpServletRequest request, String idUsuarioCliente) {
        Usuario sesion = ApiSupport.currentUser(request);
        if (sesion == null) {
            return false;
        }
        return ApiSupport.isInterno(sesion) || sesion.getIdUsuario().equals(idUsuarioCliente);
    }
}

