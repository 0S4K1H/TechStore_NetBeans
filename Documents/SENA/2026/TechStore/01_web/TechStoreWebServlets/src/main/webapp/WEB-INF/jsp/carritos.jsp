<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.List,com.techstore.web.model.Carrito" %>
<%
    List<Carrito> carritos = (List<Carrito>) request.getAttribute("carritos");
    if (carritos == null) {
        carritos = java.util.Collections.emptyList();
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
    <title>Carritos | TechStore</title>
    <link rel="stylesheet" href="<%= contextPath %>/css/techstore.css">
</head>
<body>
<main class="shell shell--wide">
    <header class="page-head">
        <div>
            <span class="eyebrow">TechStore</span>
            <h1>Gestión de carritos</h1>
            <p>Bloque comercial para administrar carritos activos y cerrados.</p>
        </div>
        <div class="hero-actions">
            <a class="btn btn--secondary" href="<%= contextPath %>/">Inicio</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/usuarios">Usuarios</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/productos">Productos</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/pedidos">Pedidos</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/tickets">Tickets</a>
            <a class="btn btn--primary" href="<%= contextPath %>/carritos?accion=nuevo">+ Nuevo carrito</a>
        </div>
    </header>

    <% if (mensaje != null && !mensaje.isBlank()) { %>
    <div class="message message--success"><%= mensaje %></div>
    <% } %>
    <% if (error != null && !error.isBlank()) { %>
    <div class="message message--error"><%= error %></div>
    <% } %>

    <section class="panel">
        <form class="search-form" method="get" action="<%= contextPath %>/carritos">
            <input type="hidden" name="accion" value="listar">
            <label class="field">
                <span>Buscar carrito</span>
                <input type="search" name="q" value="<%= filtro %>" placeholder="ID, cliente o estado">
            </label>
            <div class="search-actions">
                <button class="btn btn--primary" type="submit">Buscar</button>
                <a class="btn btn--secondary" href="<%= contextPath %>/carritos">Limpiar</a>
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
                    <th>Estado</th>
                    <th>Creación</th>
                    <th>Actualización</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                <% if (carritos.isEmpty()) { %>
                    <tr>
                        <td colspan="6" class="empty-state">No hay carritos para mostrar.</td>
                    </tr>
                <% } else { %>
                    <% for (Carrito carrito : carritos) { %>
                        <tr>
                            <td><%= carrito.getIdCarrito() %></td>
                            <td><%= carrito.getUsuario() %> (<%= carrito.getIdUsuario() %>)</td>
                            <td>
                                <span class="badge <%= "activo".equalsIgnoreCase(carrito.getEstado()) ? "badge--success" : "badge--danger" %>">
                                    <%= carrito.getEstado() %>
                                </span>
                            </td>
                            <td><%= carrito.getFechaCreacion() %></td>
                            <td><%= carrito.getFechaActualizacion() %></td>
                            <td>
                                <div class="row-actions">
                                    <a class="link-action" href="<%= contextPath %>/carritos?accion=editar&id=<%= carrito.getIdCarrito() %>">Editar</a>
                                    <form method="post" action="<%= contextPath %>/carritos" onsubmit="return confirm('¿Deseas cerrar este carrito?');">
                                        <input type="hidden" name="accion" value="eliminar">
                                        <input type="hidden" name="id" value="<%= carrito.getIdCarrito() %>">
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
