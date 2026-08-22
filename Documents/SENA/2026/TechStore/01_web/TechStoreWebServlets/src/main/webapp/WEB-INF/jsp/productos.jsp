<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.List,com.techstore.web.model.Producto,com.techstore.web.util.Html" %>
<%
    List<Producto> productos = (List<Producto>) request.getAttribute("productos");
    if (productos == null) {
        productos = java.util.Collections.emptyList();
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
    <title>Productos | TechStore</title>
    <link rel="stylesheet" href="<%= contextPath %>/css/techstore.css">
</head>
<body>
<main class="shell shell--wide">
    <header class="page-head">
        <div>
            <span class="eyebrow">TechStore</span>
            <h1>Catálogo de productos</h1>
            <p>Listado operativo del módulo con filtrado, edición y eliminación.</p>
        </div>
        <div class="hero-actions">
            <a class="btn btn--secondary" href="<%= contextPath %>/">Inicio</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/usuarios">Usuarios</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/proveedores">Proveedores</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/carritos">Carritos</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/pedidos">Pedidos</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/tickets">Tickets</a>
            <a class="btn btn--primary" href="<%= contextPath %>/productos?accion=nuevo">+ Nuevo producto</a>
        </div>
    </header>

    <% if (mensaje != null && !mensaje.isBlank()) { %>
    <div class="message message--success"><%= Html.escape(mensaje) %></div>
    <% } %>
    <% if (error != null && !error.isBlank()) { %>
    <div class="message message--error"><%= Html.escape(error) %></div>
    <% } %>

    <section class="panel">
        <form class="search-form" method="get" action="<%= contextPath %>/productos">
            <input type="hidden" name="accion" value="listar">
            <label class="field">
                <span>Buscar producto</span>
                <input type="search" name="q" value="<%= Html.escape(filtro) %>" placeholder="ID, código, nombre o proveedor">
            </label>
            <div class="search-actions">
                <button class="btn btn--primary" type="submit">Buscar</button>
                <a class="btn btn--secondary" href="<%= contextPath %>/productos">Limpiar</a>
            </div>
        </form>
    </section>

    <section class="panel">
        <div class="table-wrap">
            <table class="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Código</th>
                    <th>Proveedor</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Activo</th>
                    <th>Fecha</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                <% if (productos.isEmpty()) { %>
                    <tr>
                        <td colspan="10" class="empty-state">No hay productos para mostrar.</td>
                    </tr>
                <% } else { %>
                    <% for (Producto producto : productos) { %>
                        <tr>
                            <td><%= Html.escape(producto.getIdProducto()) %></td>
                            <td><%= Html.escape(producto.getCodigoInv()) %></td>
                            <td><%= Html.escape(producto.getProveedor()) %></td>
                            <td><%= Html.escape(producto.getNombre()) %></td>
                            <td><%= Html.escape(producto.getCategoria()) %></td>
                            <td>$ <%= producto.getPrecio() %></td>
                            <td><%= producto.getStock() %></td>
                            <td>
                                <span class="badge <%= producto.getActivo() == 1 ? "badge--success" : "badge--danger" %>">
                                    <%= producto.getActivo() == 1 ? "SI" : "NO" %>
                                </span>
                            </td>
                            <td><%= producto.getFechaCreacion() %></td>
                            <td>
                                <div class="row-actions">
                                    <a class="link-action" href="<%= contextPath %>/productos?accion=editar&id=<%= Html.escape(producto.getIdProducto()) %>">Editar</a>
                                    <form method="post" action="<%= contextPath %>/productos" onsubmit="return confirm('¿Deseas inactivar este producto?');">
                                        <input type="hidden" name="accion" value="eliminar">
                                        <input type="hidden" name="id" value="<%= Html.escape(producto.getIdProducto()) %>">
                                        <button class="link-action link-action--danger" type="submit">Inactivar</button>
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
