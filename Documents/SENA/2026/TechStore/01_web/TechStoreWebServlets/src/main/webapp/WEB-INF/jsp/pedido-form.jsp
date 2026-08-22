<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="java.util.List,com.techstore.web.model.Pedido,com.techstore.web.model.Usuario,com.techstore.web.util.Html" %>
<%
    Pedido pedido = (Pedido) request.getAttribute("pedido");
    if (pedido == null) {
        pedido = new Pedido();
    }
    List<Usuario> clientes = (List<Usuario>) request.getAttribute("clientes");
    if (clientes == null) {
        clientes = java.util.Collections.emptyList();
    }
    List<Usuario> empleados = (List<Usuario>) request.getAttribute("empleados");
    if (empleados == null) {
        empleados = java.util.Collections.emptyList();
    }
    String modo = (String) request.getAttribute("modo");
    if (modo == null) {
        modo = "crear";
    }
    boolean edicion = "editar".equalsIgnoreCase(modo);
    String titulo = (String) request.getAttribute("titulo");
    if (titulo == null) {
        titulo = edicion ? "Editar pedido" : "Nuevo pedido";
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
            <a class="btn btn--secondary" href="<%= contextPath %>/pedidos">Volver al listado</a>
        </div>
    </header>

    <% if (error != null && !error.isBlank()) { %>
    <div class="message message--error"><%= Html.escape(error) %></div>
    <% } %>

    <section class="panel">
        <form class="form-grid" method="post" action="<%= contextPath %>/pedidos">
            <input type="hidden" name="accion" value="guardar">
            <input type="hidden" name="modo" value="<%= modo %>">

            <label class="field">
                <span>ID pedido</span>
                <input type="text" name="idPedido" value="<%= Html.escape(pedido.getIdPedido()) %>" readonly required>
            </label>

            <label class="field">
                <span>Cliente</span>
                <select name="idUsuarioCliente" required>
                    <option value="">-- Selecciona --</option>
                    <% for (Usuario cliente : clientes) { %>
                        <option value="<%= Html.escape(cliente.getIdUsuario()) %>" <%= cliente.getIdUsuario() != null && cliente.getIdUsuario().equals(pedido.getIdUsuarioCliente()) ? "selected" : "" %>>
                            <%= Html.escape(cliente.getNombre()) %> (<%= Html.escape(cliente.getIdUsuario()) %>)
                        </option>
                    <% } %>
                </select>
            </label>

            <label class="field">
                <span>Empleado</span>
                <select name="idUsuarioEmpleado">
                    <option value="">Sin asignar</option>
                    <% for (Usuario empleado : empleados) { %>
                        <option value="<%= Html.escape(empleado.getIdUsuario()) %>" <%= empleado.getIdUsuario() != null && empleado.getIdUsuario().equals(pedido.getIdUsuarioEmpleado()) ? "selected" : "" %>>
                            <%= Html.escape(empleado.getNombre()) %> (<%= Html.escape(empleado.getIdUsuario()) %>)
                        </option>
                    <% } %>
                </select>
            </label>

            <label class="field">
                <span>Empleado asignado</span>
                <input type="text" name="empleadoAsignado" value="<%= pedido.getEmpleadoAsignado() == null ? "Sin asignar" : Html.escape(pedido.getEmpleadoAsignado()) %>">
            </label>

            <label class="field">
                <span>Nombre cliente</span>
                <input type="text" name="nombreCliente" value="<%= Html.escape(pedido.getNombreCliente()) %>" required>
            </label>

            <label class="field">
                <span>Correo cliente</span>
                <input type="email" name="emailCliente" value="<%= Html.escape(pedido.getEmailCliente()) %>" required>
            </label>

            <label class="field">
                <span>Teléfono</span>
                <input type="text" name="telefono" value="<%= Html.escape(pedido.getTelefono()) %>" required>
            </label>

            <label class="field">
                <span>Ciudad</span>
                <input type="text" name="ciudad" value="<%= Html.escape(pedido.getCiudad()) %>" required>
            </label>

            <label class="field">
                <span>Dirección</span>
                <input type="text" name="direccion" value="<%= Html.escape(pedido.getDireccion()) %>" required>
            </label>

            <label class="field">
                <span>Fecha pedido</span>
                <input type="date" name="fechaPedido" value="<%= pedido.getFechaPedido() == null ? "" : pedido.getFechaPedido().toString() %>" required>
            </label>

            <label class="field">
                <span>Fecha estimada</span>
                <input type="date" name="fechaEstimada" value="<%= pedido.getFechaEstimada() == null ? "" : pedido.getFechaEstimada().toString() %>" required>
            </label>

            <label class="field">
                <span>Transportadora</span>
                <input type="text" name="transportadora" value="<%= Html.escape(pedido.getTransportadora()) %>" required>
            </label>

            <label class="field">
                <span>Subtotal</span>
                <input type="number" step="0.01" min="0" name="subtotal" value="<%= pedido.getSubtotal() == null ? "0" : pedido.getSubtotal() %>" required>
            </label>

            <label class="field">
                <span>Costo envío</span>
                <input type="number" step="0.01" min="0" name="costoEnvio" value="<%= pedido.getCostoEnvio() == null ? "0" : pedido.getCostoEnvio() %>" required>
            </label>

            <label class="field">
                <span>Descuento</span>
                <input type="number" step="0.01" min="0" name="descuento" value="<%= pedido.getDescuento() == null ? "0" : pedido.getDescuento() %>" required>
            </label>

            <label class="field">
                <span>Estado</span>
                <select name="estado" required>
                    <option value="pendiente" <%= "pendiente".equalsIgnoreCase(pedido.getEstado()) ? "selected" : "" %>>pendiente</option>
                    <option value="preparacion" <%= "preparacion".equalsIgnoreCase(pedido.getEstado()) ? "selected" : "" %>>preparacion</option>
                    <option value="enviado" <%= "enviado".equalsIgnoreCase(pedido.getEstado()) ? "selected" : "" %>>enviado</option>
                    <option value="entregado" <%= "entregado".equalsIgnoreCase(pedido.getEstado()) ? "selected" : "" %>>entregado</option>
                    <option value="cancelado" <%= "cancelado".equalsIgnoreCase(pedido.getEstado()) ? "selected" : "" %>>cancelado</option>
                </select>
            </label>

            <label class="field">
                <span>Prioridad</span>
                <select name="prioridad" required>
                    <option value="baja" <%= "baja".equalsIgnoreCase(pedido.getPrioridad()) ? "selected" : "" %>>baja</option>
                    <option value="media" <%= "media".equalsIgnoreCase(pedido.getPrioridad()) ? "selected" : "" %>>media</option>
                    <option value="alta" <%= "alta".equalsIgnoreCase(pedido.getPrioridad()) ? "selected" : "" %>>alta</option>
                </select>
            </label>

            <label class="field">
                <span>Método de pago</span>
                <input type="text" name="metodoPago" value="<%= Html.escape(pedido.getMetodoPago()) %>" required>
            </label>

            <label class="field">
                <span>Nota</span>
                <textarea name="nota" rows="4"><%= Html.escape(pedido.getNota()) %></textarea>
            </label>

            <div class="form-actions">
                <button class="btn btn--primary" type="submit">
                    <%= edicion ? "Actualizar pedido" : "Guardar pedido" %>
                </button>
                <a class="btn btn--secondary" href="<%= contextPath %>/pedidos">Cancelar</a>
            </div>
        </form>
    </section>
</main>
</body>
</html>

