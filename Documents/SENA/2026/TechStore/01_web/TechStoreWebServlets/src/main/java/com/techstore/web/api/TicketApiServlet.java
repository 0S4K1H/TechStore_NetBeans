package com.techstore.web.api;

import com.techstore.web.dao.TicketSoporteDAO;
import com.techstore.web.model.TicketSoporte;
import com.techstore.web.model.Usuario;
import com.techstore.web.util.ApiSupport;
import com.techstore.web.util.Json;
import java.io.IOException;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.List;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@WebServlet("/api/tickets/*")
public class TicketApiServlet extends HttpServlet {

    private final TicketSoporteDAO ticketDAO = new TicketSoporteDAO();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario usuario = ApiSupport.requireAuth(request, response);
        if (usuario == null) {
            return;
        }

        String id = ApiSupport.pathId(request);
        try {
            if (id != null) {
                TicketSoporte ticket = ticketDAO.buscarPorId(id);
                if (ticket == null || !puedeVer(usuario, ticket.getIdUsuarioCliente())) {
                    Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Ticket no encontrado.");
                    return;
                }
                Json.write(response, HttpServletResponse.SC_OK, ticket);
                return;
            }

            List<TicketSoporte> tickets = ticketDAO.listar(request.getParameter("q"));
            if (!ApiSupport.isInterno(usuario)) {
                tickets = tickets.stream().filter(t -> usuario.getIdUsuario().equals(t.getIdUsuarioCliente())).toList();
            }
            Json.write(response, HttpServletResponse.SC_OK, tickets);
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible consultar tickets.");
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        Usuario usuario = ApiSupport.requireAuth(request, response);
        if (usuario == null) {
            return;
        }

        try {
            TicketSoporte ticket = Json.read(request, TicketSoporte.class);

            if (!ApiSupport.isInterno(usuario)) {
                ticket.setIdUsuarioCliente(usuario.getIdUsuario());
            }
            if (ticket.getIdUsuarioCliente() == null || ticket.getIdUsuarioCliente().isBlank()) {
                Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "El cliente del ticket es obligatorio.");
                return;
            }
            if (ticket.getAsunto() == null || ticket.getAsunto().isBlank()) {
                Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "El asunto es obligatorio.");
                return;
            }
            if (ticket.getMensaje() == null || ticket.getMensaje().isBlank()) {
                Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "El mensaje es obligatorio.");
                return;
            }

            ticket.setEstado("abierto");
            ticket.setFechaCreacion(new Timestamp(System.currentTimeMillis()));
            ticket.setFechaCierre(null);

            ticketDAO.crearConIdAutomatico(ticket);
            Json.write(response, HttpServletResponse.SC_CREATED, ticket);
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible crear el ticket.");
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
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "Debes indicar el ID del ticket.");
            return;
        }

        try {
            TicketSoporte existente = ticketDAO.buscarPorId(id);
            if (existente == null) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Ticket no encontrado.");
                return;
            }

            TicketSoporte ticket = Json.read(request, TicketSoporte.class);
            ticket.setIdTicket(id);
            if (ticket.getFechaCreacion() == null) {
                ticket.setFechaCreacion(existente.getFechaCreacion());
            }
            if ("cerrado".equalsIgnoreCase(ticket.getEstado()) && ticket.getFechaCierre() == null) {
                ticket.setFechaCierre(new Timestamp(System.currentTimeMillis()));
            }

            boolean actualizado = ticketDAO.actualizar(ticket);
            if (!actualizado) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Ticket no encontrado.");
                return;
            }
            Json.write(response, HttpServletResponse.SC_OK, ticket);
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible actualizar el ticket.");
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
            Json.writeError(response, HttpServletResponse.SC_BAD_REQUEST, "Debes indicar el ID del ticket.");
            return;
        }

        try {
            boolean cerrado = ticketDAO.eliminar(id);
            if (!cerrado) {
                Json.writeError(response, HttpServletResponse.SC_NOT_FOUND, "Ticket no encontrado o ya cerrado.");
                return;
            }
            Json.write(response, HttpServletResponse.SC_OK, new OkBody(true));
        } catch (SQLException ex) {
            Json.writeError(response, HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "No fue posible cerrar el ticket.");
        }
    }

    private boolean puedeVer(Usuario usuario, String idUsuarioCliente) {
        return ApiSupport.isInterno(usuario) || usuario.getIdUsuario().equals(idUsuarioCliente);
    }

    private record OkBody(boolean ok) {
    }
}
