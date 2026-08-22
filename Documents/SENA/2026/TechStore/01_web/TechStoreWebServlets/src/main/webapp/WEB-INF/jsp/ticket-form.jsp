<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.List,com.techstore.web.model.TicketSoporte,com.techstore.web.model.Usuario,java.util.function.Function,java.sql.Timestamp,com.techstore.web.util.Html" %>
<%
    TicketSoporte ticket = (TicketSoporte) request.getAttribute("ticket");
    if (ticket == null) {
        ticket = new TicketSoporte();
    }
    List<Usuario> clientes = (List<Usuario>) request.getAttribute("clientes");
    if (clientes == null) {
        clientes = java.util.Collections.emptyList();
    }
    String modo = (String) request.getAttribute("modo");
    if (modo == null) {
        modo = "crear";
    }
    boolean edicion = "editar".equalsIgnoreCase(modo);
    String titulo = (String) request.getAttribute("titulo");
    if (titulo == null) {
        titulo = edicion ? "Editar ticket" : "Nuevo ticket";
    }
    String error = (String) request.getAttribute("error");
    String contextPath = request.getContextPath();
    Function<Timestamp, String> formatearFecha = (Function<Timestamp, String>) request.getAttribute("formatearFecha");
    if (formatearFecha == null) {
        formatearFecha = ts -> ts == null ? "" : ts.toLocalDateTime().toString().substring(0, 16);
    }
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><%= titulo %> | TechStore</title>
    <link rel="stylesheet" href="<%= contextPath %>/css/techstore.css">
</head>
<body>
<main class="shell shell--narrow">
    <header class="page-head">
        <div>
            <span class="eyebrow">TechStore</span>
            <h1><%= titulo %></h1>
            <p>Formulario JSP conectado al servlet con método POST.</p>
        </div>
        <div class="hero-actions">
            <a class="btn btn--secondary" href="<%= contextPath %>/">Inicio</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/tickets">Volver al listado</a>
        </div>
    </header>

    <% if (error != null && !error.isBlank()) { %>
    <div class="message message--error"><%= Html.escape(error) %></div>
    <% } %>

    <section class="panel">
        <form class="form-grid" method="post" action="<%= contextPath %>/tickets">
            <input type="hidden" name="accion" value="guardar">
            <input type="hidden" name="modo" value="<%= modo %>">

            <label class="field">
                <span>ID ticket</span>
                <input type="text" name="idTicket" value="<%= Html.escape(ticket.getIdTicket()) %>" readonly required>
            </label>

            <label class="field">
                <span>Cliente</span>
                <select name="idUsuarioCliente" required>
                    <option value="">-- Selecciona --</option>
                    <% for (Usuario cliente : clientes) { %>
                        <option value="<%= Html.escape(cliente.getIdUsuario()) %>" <%= cliente.getIdUsuario() != null && cliente.getIdUsuario().equals(ticket.getIdUsuarioCliente()) ? "selected" : "" %>>
                            <%= Html.escape(cliente.getNombre()) %> (<%= Html.escape(cliente.getIdUsuario()) %>)
                        </option>
                    <% } %>
                </select>
            </label>

            <label class="field">
                <span>Asunto</span>
                <input type="text" name="asunto" value="<%= Html.escape(ticket.getAsunto()) %>" required>
            </label>

            <label class="field field--full">
                <span>Mensaje</span>
                <textarea name="mensaje" rows="5" required><%= Html.escape(ticket.getMensaje()) %></textarea>
            </label>

            <label class="field">
                <span>Estado</span>
                <select name="estado" required>
                    <option value="abierto" <%= "abierto".equalsIgnoreCase(ticket.getEstado()) ? "selected" : "" %>>abierto</option>
                    <option value="en_proceso" <%= "en_proceso".equalsIgnoreCase(ticket.getEstado()) ? "selected" : "" %>>en_proceso</option>
                    <option value="cerrado" <%= "cerrado".equalsIgnoreCase(ticket.getEstado()) ? "selected" : "" %>>cerrado</option>
                </select>
            </label>

            <label class="field">
                <span>Fecha creación</span>
                <input type="datetime-local" name="fechaCreacion" value="<%= formatearFecha.apply(ticket.getFechaCreacion()) %>" required>
            </label>

            <label class="field">
                <span>Fecha cierre</span>
                <input type="datetime-local" name="fechaCierre" value="<%= formatearFecha.apply(ticket.getFechaCierre()) %>">
            </label>

            <div class="form-actions">
                <button class="btn btn--primary" type="submit">
                    <%= edicion ? "Actualizar ticket" : "Guardar ticket" %>
                </button>
                <a class="btn btn--secondary" href="<%= contextPath %>/tickets">Cancelar</a>
            </div>
        </form>
    </section>
</main>
</body>
</html>

