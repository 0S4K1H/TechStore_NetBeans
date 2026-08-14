<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.List,com.techstore.web.model.Proveedor" %>
<%
    List<Proveedor> proveedores = (List<Proveedor>) request.getAttribute("proveedores");
    if (proveedores == null) {
        proveedores = java.util.Collections.emptyList();
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
    <title>Proveedores | TechStore</title>
    <link rel="stylesheet" href="<%= contextPath %>/css/techstore.css">
</head>
<body>
<main class="shell shell--wide">
    <header class="page-head">
        <div>
            <span class="eyebrow">TechStore</span>
            <h1>Catálogo de proveedores</h1>
            <p>Gestión de proveedores que alimenta el módulo de productos.</p>
        </div>
        <div class="hero-actions">
            <a class="btn btn--secondary" href="<%= contextPath %>/">Inicio</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/usuarios">Usuarios</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/productos">Productos</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/carritos">Carritos</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/pedidos">Pedidos</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/tickets">Tickets</a>
            <a class="btn btn--primary" href="<%= contextPath %>/proveedores?accion=nuevo">+ Nuevo proveedor</a>
        </div>
    </header>

    <% if (mensaje != null && !mensaje.isBlank()) { %>
    <div class="message message--success"><%= mensaje %></div>
    <% } %>
    <% if (error != null && !error.isBlank()) { %>
    <div class="message message--error"><%= error %></div>
    <% } %>

    <section class="panel">
        <form class="search-form" method="get" action="<%= contextPath %>/proveedores">
            <input type="hidden" name="accion" value="listar">
            <label class="field">
                <span>Buscar proveedor</span>
                <input type="search" name="q" value="<%= filtro %>" placeholder="ID, nombre o correo">
            </label>
            <div class="search-actions">
                <button class="btn btn--primary" type="submit">Buscar</button>
                <a class="btn btn--secondary" href="<%= contextPath %>/proveedores">Limpiar</a>
            </div>
        </form>
    </section>

    <section class="panel">
        <div class="table-wrap">
            <table class="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                <% if (proveedores.isEmpty()) { %>
                    <tr>
                        <td colspan="4" class="empty-state">No hay proveedores para mostrar.</td>
                    </tr>
                <% } else { %>
                    <% for (Proveedor proveedor : proveedores) { %>
                        <tr>
                            <td><%= proveedor.getIdProveedor() %></td>
                            <td><%= proveedor.getNombre() %></td>
                            <td><%= proveedor.getEmail() %></td>
                            <td>
                                <div class="row-actions">
                                    <a class="link-action" href="<%= contextPath %>/proveedores?accion=editar&id=<%= proveedor.getIdProveedor() %>">Editar</a>
                                    <form method="post" action="<%= contextPath %>/proveedores" onsubmit="return confirm('¿Deseas eliminar este proveedor?');">
                                        <input type="hidden" name="accion" value="eliminar">
                                        <input type="hidden" name="id" value="<%= proveedor.getIdProveedor() %>">
                                        <button class="link-action link-action--danger" type="submit">Eliminar</button>
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
