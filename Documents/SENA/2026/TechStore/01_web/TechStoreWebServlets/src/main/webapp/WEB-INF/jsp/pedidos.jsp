<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.List,com.techstore.web.model.Pedido" %>
<%
    List<Pedido> pedidos = (List<Pedido>) request.getAttribute("pedidos");
    if (pedidos == null) {
        pedidos = java.util.Collections.emptyList();
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
    <title>Pedidos | TechStore</title>
    <link rel="stylesheet" href="<%= contextPath %>/css/techstore.css">
</head>
<body>
<main class="shell shell--wide">
    <header class="page-head">
        <div>
            <span class="eyebrow">TechStore</span>
            <h1>Gestión de pedidos</h1>
            <p>Bloque operativo de órdenes comerciales y trazabilidad básica.</p>
        </div>
        <div class="hero-actions">
            <a class="btn btn--secondary" href="<%= contextPath %>/">Inicio</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/usuarios">Usuarios</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/productos">Productos</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/proveedores">Proveedores</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/carritos">Carritos</a>
            <a class="btn btn--primary" href="<%= contextPath %>/pedidos?accion=nuevo">+ Nuevo pedido</a>
        </div>
    </header>

    <% if (mensaje != null && !mensaje.isBlank()) { %>
    <div class="message message--success"><%= mensaje %></div>
    <% } %>
    <% if (error != null && !error.isBlank()) { %>
    <div class="message message--error"><%= error %></div>
    <% } %>

    <section class="panel">
        <form class="search-form" method="get" action="<%= contextPath %>/pedidos">
            <input type="hidden" name="accion" value="listar">
            <label class="field">
                <span>Buscar pedido</span>
                <input type="search" name="q" value="<%= filtro %>" placeholder="ID, cliente, estado o transportadora">
            </label>
            <div class="search-actions">
                <button class="btn btn--primary" type="submit">Buscar</button>
                <a class="btn btn--secondary" href="<%= contextPath %>/pedidos">Limpiar</a>
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
                    <th>Empleado</th>
                    <th>Estado</th>
                    <th>Prioridad</th>
                    <th>Fecha</th>
                    <th>Estimada</th>
                    <th>Subtotal</th>
                    <th>Total</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                <% if (pedidos.isEmpty()) { %>
                    <tr>
                        <td colspan="10" class="empty-state">No hay pedidos para mostrar.</td>
                    </tr>
                <% } else { %>
                    <% for (Pedido pedido : pedidos) { %>
                        <tr>
                            <td><%= pedido.getIdPedido() %></td>
                            <td><%= pedido.getNombreCliente() %></td>
                            <td><%= pedido.getEmpleadoAsignado() %></td>
                            <td><span class="badge badge--success"><%= pedido.getEstado() %></span></td>
                            <td><%= pedido.getPrioridad() %></td>
                            <td><%= pedido.getFechaPedido() %></td>
                            <td><%= pedido.getFechaEstimada() %></td>
                            <td>$ <%= pedido.getSubtotal() %></td>
                            <td>$ <%= pedido.getTotal() %></td>
                            <td>
                                <div class="row-actions">
                                    <a class="link-action" href="<%= contextPath %>/pedidos?accion=editar&id=<%= pedido.getIdPedido() %>">Editar</a>
                                    <form method="post" action="<%= contextPath %>/pedidos" onsubmit="return confirm('¿Deseas cancelar este pedido?');">
                                        <input type="hidden" name="accion" value="eliminar">
                                        <input type="hidden" name="id" value="<%= pedido.getIdPedido() %>">
                                        <button class="link-action link-action--danger" type="submit">Cancelar</button>
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
