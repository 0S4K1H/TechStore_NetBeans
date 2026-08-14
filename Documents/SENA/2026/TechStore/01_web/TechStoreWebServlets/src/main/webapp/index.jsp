<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ page import="com.techstore.web.model.Usuario" %>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TechStore Web | Plataforma comercial</title>
    <link rel="stylesheet" href="<%= request.getContextPath() %>/css/techstore.css">
</head>
<body>
<%
    Usuario usuarioSesion = (Usuario) session.getAttribute("usuarioAutenticado");
    String nombreSesion = usuarioSesion == null ? "Usuario" : usuarioSesion.getNombre();
    String rolSesion = usuarioSesion == null ? "sesión no disponible" : usuarioSesion.getRol();
%>
<main class="shell shell--wide">
    <header class="topbar panel">
        <div class="brand">
            <div class="brand-mark">TS</div>
            <div class="brand-copy">
                <strong>TechStore Solutions S.A.S.</strong>
                <span>Plataforma comercial y operativa</span>
            </div>
        </div>

        <div class="topbar-actions">
            <span class="status-pill status-pill--live">MySQL 3308 · JDBC activo</span>
            <span class="session-chip">
                <span class="session-chip__label">Sesión</span>
                <strong><%= nombreSesion %></strong>
                <span><%= rolSesion %></span>
            </span>
            <a class="link-action" href="<%= request.getContextPath() %>/logout">Cerrar sesión</a>
            <a class="link-action" href="<%= request.getContextPath() %>/productos">Abrir catálogo</a>
        </div>
    </header>

    <section class="hero hero--commerce">
        <article class="panel panel--hero">
            <div class="hero-copy">
                <span class="eyebrow">Evidencia GA7-220501096-AA2-EV02</span>
                <h1>Una vitrina comercial con presencia de marca</h1>
                <p>
                    Un front pensado para sentirse como una tienda real: catálogo visible,
                    navegación directa y una estética más potente, más limpia y más premium.
                </p>
                <div class="hero-inline">
                    <span class="mini-pill">Hola, <%= nombreSesion %></span>
                    <span class="mini-pill mini-pill--soft">Rol: <%= rolSesion %></span>
                </div>
            </div>

            <div class="hero-actions hero-actions--grid">
                <a class="btn btn--primary" href="<%= request.getContextPath() %>/productos">Productos</a>
                <a class="btn btn--secondary" href="<%= request.getContextPath() %>/pedidos">Pedidos</a>
                <a class="btn btn--secondary" href="<%= request.getContextPath() %>/carritos">Carritos</a>
                <a class="btn btn--secondary" href="<%= request.getContextPath() %>/usuarios">Usuarios</a>
                <a class="btn btn--secondary" href="<%= request.getContextPath() %>/proveedores">Proveedores</a>
                <a class="btn btn--secondary" href="<%= request.getContextPath() %>/tickets">Tickets</a>
            </div>

            <div class="hero-badges">
                <span class="badge badge--glass">Catálogo listo</span>
                <span class="badge badge--glass">Soporte integrado</span>
                <span class="badge badge--glass">Trazabilidad comercial</span>
                <span class="badge badge--glass">JSP + Servlets</span>
            </div>
        </article>

        <aside class="panel panel--showcase">
            <div class="showcase-copy">
                <span class="eyebrow">Colección TechStore</span>
                <strong>Una vitrina pensada para vender con presencia.</strong>
                <p>
                    Lenguaje visual oscuro, acentos eléctricos y foco absoluto en productos,
                    compra y soporte. Más showroom que formulario.
                </p>
            </div>

            <div class="showcase-stage">
                <div class="showcase-orbit showcase-orbit--one"></div>
                <div class="showcase-orbit showcase-orbit--two"></div>
                <div class="showcase-orbit showcase-orbit--three"></div>

                <div class="showcase-device showcase-device--laptop">
                    <span class="showcase-device__screen"></span>
                    <span class="showcase-device__base"></span>
                </div>

                <div class="showcase-device showcase-device--phone"></div>
                <div class="showcase-device showcase-device--card"></div>

                <span class="floating-tag floating-tag--top">Gaming · Business · Store</span>
                <span class="floating-tag floating-tag--left">Inventario en tiempo real</span>
                <span class="floating-tag floating-tag--right">Pedidos y soporte</span>
            </div>

            <div class="showcase-stats">
                <article class="stat-card">
                    <strong>6</strong>
                    <span>Módulos activos</span>
                </article>
                <article class="stat-card">
                    <strong>JDBC</strong>
                    <span>Conexión real</span>
                </article>
                <article class="stat-card">
                    <strong>3308</strong>
                    <span>Base local</span>
                </article>
                <article class="stat-card">
                    <strong>UX</strong>
                    <span>Más premium</span>
                </article>
            </div>
        </aside>
    </section>

    <section class="panel">
        <div class="section-head">
            <div>
                <span class="eyebrow">Acceso rápido</span>
                <h2>Módulos listos para demo y sustentación</h2>
            </div>
            <p>Entradas directas a las áreas que representan la operación comercial de TechStore.</p>
        </div>

        <div class="module-grid">
            <a class="module-card module-card--featured" href="<%= request.getContextPath() %>/productos">
                <span class="module-card__tag">Activo</span>
                <strong>Productos</strong>
                <p>CRUD completo con conexión JDBC para administrar el catálogo de tecnología.</p>
                <span class="module-card__action">Abrir módulo</span>
            </a>

            <a class="module-card" href="<%= request.getContextPath() %>/pedidos">
                <span class="module-card__tag">Venta</span>
                <strong>Pedidos</strong>
                <p>Seguimiento de órdenes, estados y trazabilidad básica de negocio.</p>
                <span class="module-card__action">Abrir módulo</span>
            </a>

            <a class="module-card" href="<%= request.getContextPath() %>/carritos">
                <span class="module-card__tag">Compra</span>
                <strong>Carritos</strong>
                <p>Contenedor previo a la compra con relación al cliente y estado operativo.</p>
                <span class="module-card__action">Abrir módulo</span>
            </a>

            <a class="module-card" href="<%= request.getContextPath() %>/usuarios">
                <span class="module-card__tag">Acceso</span>
                <strong>Usuarios</strong>
                <p>Base para clientes, empleados y administración de la plataforma.</p>
                <span class="module-card__action">Abrir módulo</span>
            </a>

            <a class="module-card" href="<%= request.getContextPath() %>/proveedores">
                <span class="module-card__tag">Abastecimiento</span>
                <strong>Proveedores</strong>
                <p>Relación comercial para controlar el origen del inventario y la oferta.</p>
                <span class="module-card__action">Abrir módulo</span>
            </a>

            <a class="module-card" href="<%= request.getContextPath() %>/tickets">
                <span class="module-card__tag">Soporte</span>
                <strong>Tickets</strong>
                <p>Gestión de solicitudes y seguimiento de novedades de los clientes.</p>
                <span class="module-card__action">Abrir módulo</span>
            </a>
        </div>
    </section>

    <section class="panel panel--banner">
        <div class="banner-copy">
            <span class="eyebrow">TechStore listo para crecer</span>
            <h2>Una portada más comercial, más clara y mejor preparada para mostrar el proyecto.</h2>
            <p>
                Mantiene toda la lógica funcional, pero mejora la presentación para que el sistema
                se vea como una plataforma de negocio real.
            </p>
        </div>
        <div class="banner-actions">
            <a class="btn btn--primary" href="<%= request.getContextPath() %>/productos">Ir al catálogo</a>
            <a class="btn btn--secondary" href="<%= request.getContextPath() %>/pedidos">Revisar pedidos</a>
        </div>
    </section>
</main>
</body>
</html>
