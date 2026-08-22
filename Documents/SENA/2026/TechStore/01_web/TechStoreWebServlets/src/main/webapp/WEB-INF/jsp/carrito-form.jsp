<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.List,com.techstore.web.model.Carrito,com.techstore.web.model.Usuario,com.techstore.web.util.Html" %>
<%
    Carrito carrito = (Carrito) request.getAttribute("carrito");
    if (carrito == null) {
        carrito = new Carrito();
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
        titulo = edicion ? "Editar carrito" : "Nuevo carrito";
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
            <a class="btn btn--secondary" href="<%= contextPath %>/carritos">Volver al listado</a>
        </div>
    </header>

    <% if (error != null && !error.isBlank()) { %>
    <div class="message message--error"><%= Html.escape(error) %></div>
    <% } %>

    <section class="panel">
        <form class="form-grid" method="post" action="<%= contextPath %>/carritos">
            <input type="hidden" name="accion" value="guardar">
            <input type="hidden" name="modo" value="<%= modo %>">

            <label class="field">
                <span>ID carrito</span>
                <input type="number" min="1" name="idCarrito" value="<%= carrito.getIdCarrito() == null ? "" : carrito.getIdCarrito() %>" readonly>
                <small class="field-help">Se asigna automáticamente con la siguiente secuencia numérica del carrito.</small>
            </label>

            <label class="field">
                <span>Cliente</span>
                <select name="idUsuario" required>
                    <option value="">-- Selecciona --</option>
                    <% for (Usuario cliente : clientes) { %>
                        <option value="<%= Html.escape(cliente.getIdUsuario()) %>" <%= cliente.getIdUsuario() != null && cliente.getIdUsuario().equals(carrito.getIdUsuario()) ? "selected" : "" %>>
                            <%= Html.escape(cliente.getNombre()) %> (<%= Html.escape(cliente.getIdUsuario()) %>)
                        </option>
                    <% } %>
                </select>
            </label>

            <label class="field">
                <span>Estado</span>
                <select name="estado" required>
                    <option value="activo" <%= "activo".equalsIgnoreCase(carrito.getEstado()) ? "selected" : "" %>>activo</option>
                    <option value="cerrado" <%= "cerrado".equalsIgnoreCase(carrito.getEstado()) ? "selected" : "" %>>cerrado</option>
                </select>
            </label>

            <div class="form-actions">
                <button class="btn btn--primary" type="submit">
                    <%= edicion ? "Actualizar carrito" : "Guardar carrito" %>
                </button>
                <a class="btn btn--secondary" href="<%= contextPath %>/carritos">Cancelar</a>
            </div>
        </form>
    </section>
</main>
</body>
</html>


