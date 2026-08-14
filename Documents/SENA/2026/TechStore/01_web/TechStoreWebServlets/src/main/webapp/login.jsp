<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" import="com.techstore.web.model.Usuario" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ingresar | TechStore</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/css/techstore.css">
</head>
<body class="auth-body">
<%
    Usuario usuarioSesion = (Usuario) session.getAttribute("usuarioAutenticado");
    if (usuarioSesion != null) {
        response.sendRedirect(request.getContextPath() + "/index.jsp");
        return;
    }

    String error = request.getParameter("error");
    String mensaje = request.getParameter("mensaje");
    String redirect = request.getParameter("redirect");
    redirect = redirect == null ? "" : redirect
            .replace("&", "&amp;")
            .replace("\"", "&quot;")
            .replace("<", "&lt;")
            .replace(">", "&gt;");
%>
<main class="auth-shell">
    <section class="panel auth-showcase">
        <span class="eyebrow">TechStore Solutions S.A.S.</span>
        <h1>Acceso comercial al ecosistema TechStore</h1>
        <p>
            Ingresa con tu usuario o correo y continúa a la administración de productos,
            pedidos, carritos, usuarios, proveedores y soporte.
        </p>

        <div class="auth-highlights">
            <article class="auth-highlight">
                <strong>JDBC real</strong>
                <span>Validación contra MySQL local.</span>
            </article>
            <article class="auth-highlight">
                <strong>Sesión segura</strong>
                <span>El sistema mantiene el acceso activo mientras trabajas.</span>
            </article>
            <article class="auth-highlight">
                <strong>Arquitectura limpia</strong>
                <span>Servlets, DAO y JSP separados por responsabilidad.</span>
            </article>
        </div>

        <div class="auth-stage">
            <div class="auth-stage__glow auth-stage__glow--one"></div>
            <div class="auth-stage__glow auth-stage__glow--two"></div>
            <div class="auth-stage__card auth-stage__card--main">
                <span class="auth-stage__label">TechStore</span>
                <strong>Retail + control + soporte</strong>
            </div>
            <div class="auth-stage__card auth-stage__card--small"></div>
            <div class="auth-stage__card auth-stage__card--mini"></div>
        </div>
    </section>

    <section class="panel auth-card">
        <div class="brand auth-brand">
            <div class="brand-mark">TS</div>
            <div class="brand-copy">
                <strong>TechStore</strong>
                <span>Ingreso al sistema</span>
            </div>
        </div>

        <h2>Iniciar sesión</h2>
        <p class="auth-copy">
            Usa tus credenciales para entrar a la plataforma y administrar el proyecto.
        </p>

        <% if (mensaje != null && !mensaje.isBlank()) { %>
            <div class="auth-message auth-message--info"><%= mensaje %></div>
        <% } %>
        <% if (error != null && !error.isBlank()) { %>
            <div class="auth-message auth-message--error"><%= error %></div>
        <% } %>

        <form class="auth-form" method="post" action="<%= request.getContextPath() %>/login">
            <input type="hidden" name="redirect" value="<%= redirect %>">
            <div class="field">
                <span>Usuario o correo</span>
                <input type="text" name="usuario" placeholder="mateo, admin@techstore.com" required autofocus>
            </div>

            <div class="field">
                <span>Contraseña</span>
                <input type="password" name="password" placeholder="••••••••" required>
            </div>

            <button class="btn btn--primary btn--full" type="submit">Entrar a TechStore</button>
        </form>

        <div class="auth-footer">
            <span>Base: techstore_sql_real</span>
            <span>Puerto: 3308</span>
        </div>
    </section>
</main>
</body>
</html>
