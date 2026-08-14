<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.List,com.techstore.web.model.Producto,com.techstore.web.model.Proveedor" %>
<%
    Producto producto = (Producto) request.getAttribute("producto");
    if (producto == null) {
        producto = new Producto();
        producto.setActivo(1);
    }
    List<Proveedor> proveedores = (List<Proveedor>) request.getAttribute("proveedores");
    if (proveedores == null) {
        proveedores = java.util.Collections.emptyList();
    }
    String modo = (String) request.getAttribute("modo");
    if (modo == null) {
        modo = "crear";
    }
    boolean edicion = "editar".equalsIgnoreCase(modo);
    boolean creacion = !edicion;
    String titulo = (String) request.getAttribute("titulo");
    if (titulo == null) {
        titulo = edicion ? "Editar producto" : "Nuevo producto";
    }
    String error = (String) request.getAttribute("error");
    String contextPath = request.getContextPath();
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
            <a class="btn btn--secondary" href="<%= contextPath %>/productos">Volver al listado</a>
        </div>
    </header>

    <% if (error != null && !error.isBlank()) { %>
    <div class="message message--error"><%= error %></div>
    <% } %>

    <section class="panel">
        <form class="form-grid" method="post" action="<%= contextPath %>/productos">
            <input type="hidden" name="accion" value="guardar">
            <input type="hidden" name="modo" value="<%= modo %>">

            <label class="field">
                <span>ID producto</span>
                <input type="text" name="idProducto" value="<%= producto.getIdProducto() == null ? "" : producto.getIdProducto() %>" readonly required>
            </label>

            <label class="field">
                <span>Código inventario</span>
                <input type="text" name="codigoInv" value="<%= producto.getCodigoInv() == null ? "" : producto.getCodigoInv() %>" <%= creacion ? "readonly" : "" %> required>
            </label>

            <% if (creacion) { %>
            <div class="message message--info" style="grid-column: 1 / -1;">
                Los identificadores se generan automáticamente siguiendo la secuencia del inventario existente.
            </div>
            <% } %>

            <label class="field">
                <span>Proveedor</span>
                <select name="idProveedor" required>
                    <option value="">Seleccione un proveedor</option>
                    <% for (Proveedor proveedor : proveedores) { %>
                        <option value="<%= proveedor.getIdProveedor() %>" <%= proveedor.getIdProveedor().equals(producto.getIdProveedor()) ? "selected" : "" %>>
                            <%= proveedor.getIdProveedor() %> - <%= proveedor.getNombre() %>
                        </option>
                    <% } %>
                </select>
            </label>

            <label class="field">
                <span>Nombre</span>
                <input type="text" name="nombre" value="<%= producto.getNombre() == null ? "" : producto.getNombre() %>" required>
            </label>

            <label class="field">
                <span>Categoría</span>
                <select name="categoria" required>
                    <option value="">Seleccione categoría</option>
                    <% String[] categorias = {"laptop", "movil", "accesorio", "componente", "periferico"}; %>
                    <% for (String categoria : categorias) { %>
                        <option value="<%= categoria %>" <%= categoria.equalsIgnoreCase(producto.getCategoria() == null ? "" : producto.getCategoria()) ? "selected" : "" %>>
                            <%= categoria %>
                        </option>
                    <% } %>
                </select>
            </label>

            <label class="field">
                <span>Precio</span>
                <input type="number" name="precio" step="0.01" min="0" value="<%= producto.getPrecio() == null ? "" : producto.getPrecio() %>" required>
            </label>

            <label class="field">
                <span>Stock</span>
                <input type="number" name="stock" min="0" value="<%= producto.getStock() %>" required>
            </label>

            <label class="field">
                <span>Activo</span>
                <select name="activo" required>
                    <option value="1" <%= producto.getActivo() == 1 ? "selected" : "" %>>SI</option>
                    <option value="0" <%= producto.getActivo() == 0 ? "selected" : "" %>>NO</option>
                </select>
            </label>

            <div class="form-actions">
                <button class="btn btn--primary" type="submit">
                    <%= edicion ? "Actualizar producto" : "Guardar producto" %>
                </button>
                <a class="btn btn--secondary" href="<%= contextPath %>/productos">Cancelar</a>
            </div>
        </form>
    </section>
</main>
</body>
</html>
