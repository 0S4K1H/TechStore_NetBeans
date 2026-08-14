<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.List,com.techstore.web.model.Usuario" %>
<%
    List<Usuario> usuarios = (List<Usuario>) request.getAttribute("usuarios");
    if (usuarios == null) {
        usuarios = java.util.Collections.emptyList();
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
    <title>Usuarios | TechStore</title>
    <link rel="stylesheet" href="<%= contextPath %>/css/techstore.css">
</head>
<body>
<main class="shell shell--wide">
    <header class="page-head">
        <div>
            <span class="eyebrow">TechStore</span>
            <h1>Gestión de usuarios</h1>
            <p>Base operativa para clientes, empleados y administración.</p>
        </div>
        <div class="hero-actions">
            <a class="btn btn--secondary" href="<%= contextPath %>/">Inicio</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/productos">Productos</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/proveedores">Proveedores</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/carritos">Carritos</a>
            <a class="btn btn--secondary" href="<%= contextPath %>/pedidos">Pedidos</a>
            <a class="btn btn--primary" href="<%= contextPath %>/usuarios?accion=nuevo">+ Nuevo usuario</a>
        </div>
    </header>

    <% if (mensaje != null && !mensaje.isBlank()) { %>
    <div class="message message--success"><%= mensaje %></div>
    <% } %>
    <% if (error != null && !error.isBlank()) { %>
    <div class="message message--error"><%= error %></div>
    <% } %>

    <section class="panel">
        <form class="search-form" method="get" action="<%= contextPath %>/usuarios">
            <input type="hidden" name="accion" value="listar">
            <label class="field">
                <span>Buscar usuario</span>
                <input type="search" name="q" value="<%= filtro %>" placeholder="ID, usuario, rol, nombre, correo o ciudad">
            </label>
            <div class="search-actions">
                <button class="btn btn--primary" type="submit">Buscar</button>
                <a class="btn btn--secondary" href="<%= contextPath %>/usuarios">Limpiar</a>
            </div>
        </form>
    </section>

    <section class="panel">
        <div class="table-wrap">
            <table class="table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Usuario</th>
                    <th>Rol</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Ciudad</th>
                    <th>Activo</th>
                    <th>Registro</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                <% if (usuarios.isEmpty()) { %>
                    <tr>
                        <td colspan="9" class="empty-state">No hay usuarios para mostrar.</td>
                    </tr>
                <% } else { %>
                    <% for (Usuario usuario : usuarios) { %>
                        <tr>
                            <td><%= usuario.getIdUsuario() %></td>
                            <td><%= usuario.getUsername() %></td>
                            <td><%= usuario.getRol() %></td>
                            <td><%= usuario.getNombre() %></td>
                            <td><%= usuario.getEmail() %></td>
                            <td><%= usuario.getCiudad() %></td>
                            <td>
                                <span class="badge <%= usuario.getActivo() == 1 ? "badge--success" : "badge--danger" %>">
                                    <%= usuario.getActivo() == 1 ? "SI" : "NO" %>
                                </span>
                            </td>
                            <td><%= usuario.getFechaRegistro() %></td>
                            <td>
                                <div class="row-actions">
                                    <a class="link-action" href="<%= contextPath %>/usuarios?accion=editar&id=<%= usuario.getIdUsuario() %>">Editar</a>
                                    <form method="post" action="<%= contextPath %>/usuarios" onsubmit="return confirm('¿Deseas inactivar este usuario?');">
                                        <input type="hidden" name="accion" value="eliminar">
                                        <input type="hidden" name="id" value="<%= usuario.getIdUsuario() %>">
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
