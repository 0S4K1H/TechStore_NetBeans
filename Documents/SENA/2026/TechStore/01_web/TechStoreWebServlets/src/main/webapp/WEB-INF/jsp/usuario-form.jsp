<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="com.techstore.web.model.Usuario" %>
<%
    Usuario usuario = (Usuario) request.getAttribute("usuario");
    if (usuario == null) {
        usuario = new Usuario();
        usuario.setActivo(1);
        usuario.setRol("cliente");
    }
    String modo = (String) request.getAttribute("modo");
    if (modo == null) {
        modo = "crear";
    }
    boolean edicion = "editar".equalsIgnoreCase(modo);
    String titulo = (String) request.getAttribute("titulo");
    if (titulo == null) {
        titulo = edicion ? "Editar usuario" : "Nuevo usuario";
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
            <a class="btn btn--secondary" href="<%= contextPath %>/usuarios">Volver al listado</a>
        </div>
    </header>

    <% if (error != null && !error.isBlank()) { %>
    <div class="message message--error"><%= error %></div>
    <% } %>

    <section class="panel">
        <form class="form-grid" method="post" action="<%= contextPath %>/usuarios">
            <input type="hidden" name="accion" value="guardar">
            <input type="hidden" name="modo" value="<%= modo %>">

            <label class="field">
                <span>ID usuario</span>
                <input type="text" name="idUsuario" value="<%= usuario.getIdUsuario() == null ? "" : usuario.getIdUsuario() %>" readonly required>
                <small class="field-help">Se genera automáticamente como USR001, USR002 y así sucesivamente.</small>
            </label>

            <label class="field">
                <span>Nombre de usuario</span>
                <input type="text" name="username" value="<%= usuario.getUsername() == null ? "" : usuario.getUsername() %>" required>
            </label>

            <label class="field">
                <span>Contraseña demo</span>
                <input type="text" name="passwordDemo" value="<%= usuario.getPasswordDemo() == null ? "" : usuario.getPasswordDemo() %>" required>
            </label>

            <label class="field">
                <span>Rol</span>
                <select name="rol" required>
                    <option value="cliente" <%= "cliente".equalsIgnoreCase(usuario.getRol()) ? "selected" : "" %>>cliente</option>
                    <option value="empleado" <%= "empleado".equalsIgnoreCase(usuario.getRol()) ? "selected" : "" %>>empleado</option>
                    <option value="administrador" <%= "administrador".equalsIgnoreCase(usuario.getRol()) ? "selected" : "" %>>administrador</option>
                </select>
            </label>

            <label class="field">
                <span>Nombre completo</span>
                <input type="text" name="nombre" value="<%= usuario.getNombre() == null ? "" : usuario.getNombre() %>" required>
            </label>

            <label class="field">
                <span>Correo</span>
                <input type="email" name="email" value="<%= usuario.getEmail() == null ? "" : usuario.getEmail() %>" required>
            </label>

            <label class="field">
                <span>Ciudad</span>
                <input type="text" name="ciudad" value="<%= usuario.getCiudad() == null ? "" : usuario.getCiudad() %>" required>
            </label>

            <label class="field">
                <span>Activo</span>
                <select name="activo" required>
                    <option value="1" <%= usuario.getActivo() == 1 ? "selected" : "" %>>SI</option>
                    <option value="0" <%= usuario.getActivo() == 0 ? "selected" : "" %>>NO</option>
                </select>
            </label>

            <div class="form-actions">
                <button class="btn btn--primary" type="submit">
                    <%= edicion ? "Actualizar usuario" : "Guardar usuario" %>
                </button>
                <a class="btn btn--secondary" href="<%= contextPath %>/usuarios">Cancelar</a>
            </div>
        </form>
    </section>
</main>
</body>
</html>
