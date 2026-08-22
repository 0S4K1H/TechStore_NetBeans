<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="com.techstore.web.model.Proveedor,com.techstore.web.util.Html" %>
<%
    Proveedor proveedor = (Proveedor) request.getAttribute("proveedor");
    if (proveedor == null) {
        proveedor = new Proveedor();
    }
    String modo = (String) request.getAttribute("modo");
    if (modo == null) {
        modo = "crear";
    }
    boolean edicion = "editar".equalsIgnoreCase(modo);
    String titulo = (String) request.getAttribute("titulo");
    if (titulo == null) {
        titulo = edicion ? "Editar proveedor" : "Nuevo proveedor";
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
            <a class="btn btn--secondary" href="<%= contextPath %>/proveedores">Volver al listado</a>
        </div>
    </header>

    <% if (error != null && !error.isBlank()) { %>
    <div class="message message--error"><%= Html.escape(error) %></div>
    <% } %>

    <section class="panel">
        <form class="form-grid" method="post" action="<%= contextPath %>/proveedores">
            <input type="hidden" name="accion" value="guardar">
            <input type="hidden" name="modo" value="<%= modo %>">

            <label class="field">
                <span>ID proveedor</span>
                <input type="text" name="idProveedor" value="<%= Html.escape(proveedor.getIdProveedor()) %>" readonly required>
                <small class="field-help">Se genera automáticamente como PRV001, PRV002 y así sucesivamente.</small>
            </label>

            <label class="field">
                <span>Nombre</span>
                <input type="text" name="nombre" value="<%= Html.escape(proveedor.getNombre()) %>" required>
            </label>

            <label class="field">
                <span>Correo</span>
                <input type="email" name="email" value="<%= Html.escape(proveedor.getEmail()) %>" required>
            </label>

            <div class="form-actions">
                <button class="btn btn--primary" type="submit">
                    <%= edicion ? "Actualizar proveedor" : "Guardar proveedor" %>
                </button>
                <a class="btn btn--secondary" href="<%= contextPath %>/proveedores">Cancelar</a>
            </div>
        </form>
    </section>
</main>
</body>
</html>
