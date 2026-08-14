<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.List,com.techstore.web.model.TicketSoporte" %>
<%
    List<TicketSoporte> tickets = (List<TicketSoporte>) request.getAttribute("tickets");
    if (tickets == null) {
        tickets = java.util.Collections.emptyList();
    }
    String filtro = (String) request.getAttribute("filtro");
    if (filtro == null) {
        filtro = "";
    }
    String mensaje = request.getParameter("mensaje");
    String error = request.getParameter("error");
    String contextPath = request.getContextPath();
%>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tickets | TechStore</title>
    <link rel="stylesheet" href="<%= contextPath %>/css/techstore.css">
</head>
<body>
<main class="shell shell--wide">
    <header class="page-head">
        <div>
            <span class="eyebrow">TechStore</span>
            <h1>Soporte técnico</h1>
            <p>Gestión de tickets vinculados a los clientes registrados.</p>
        </div>
        <div class="hero-actions">
            <a class="btn btn--secondary" href="<%= contextPath %>/">Inicio</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/usuarios">Usuarios</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/carritos">Carritos</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/pedidos">Pedidos</a>
            <a class="btn btn--primary" href="<%= contextPath %>/tickets?accion=nuevo">+ Nuevo ticket</a>
        </div>
    </header>

    <% if (mensaje != null && !mensaje.isBlank()) { %>
    <div class="message message--success"><%= mensaje %></div>
    <% } %>
    <% if (error != null && !error.isBlank()) { %>
    <div class="message message--error"><%= error %></div>
    <% } %>

    <section class="panel">
        <form class="search-form" method="get" action="<%= contextPath %>/tickets">
            <input type="hidden" name="accion" value="listar">
            <label class="field">
                <span>Buscar ticket</span>
                <input type="search" name="q" value="<%= filtro %>" placeholder="ID, cliente, asunto o estado">
            </label>
            <div class="search-actions">
                <button class="btn btn--primary" type="submit">Buscar</button>
                <a class="btn btn--secondary" href="<%= contextPath %>/tickets">Limpiar</a>
            </div>
        </form>
    </section>

    <section class="panel">
        <div class="table-wrap">
            <table class="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Asunto</th>
                    <th>Estado</th>
                    <th>Creación</th>
                    <th>Cierre</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                <% if (tickets.isEmpty()) { %>
                    <tr>
                        <td colspan="7" class="empty-state">No hay tickets para mostrar.</td>
                    </tr>
                <% } else { %>
                    <% for (TicketSoporte ticket : tickets) { %>
                        <tr>
                            <td><%= ticket.getIdTicket() %></td>
                            <td><%= ticket.getCliente() %></td>
                            <td><%= ticket.getAsunto() %></td>
                            <td><span class="badge badge--success"><%= ticket.getEstado() %></span></td>
                            <td><%= ticket.getFechaCreacion() %></td>
                            <td><%= ticket.getFechaCierre() == null ? "-" : ticket.getFechaCierre() %></td>
                            <td>
                                <div class="row-actions">
                                    <a class="link-action" href="<%= contextPath %>/tickets?accion=editar&id=<%= ticket.getIdTicket() %>">Editar</a>
                                    <form method="post" action="<%= contextPath %>/tickets" onsubmit="return confirm('¿Deseas cerrar este ticket?');">
                                        <input type="hidden" name="accion" value="eliminar">
                                        <input type="hidden" name="id" value="<%= ticket.getIdTicket() %>">
                                        <button class="link-action link-action--danger" type="submit">Cerrar</button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    <% } %>
                <% } %>
                </tbody>
            </table>
        </div>
    </section>
</main>
</body>
</html>
