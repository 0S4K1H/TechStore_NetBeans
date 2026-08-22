package com.techstore.web.filter;

import com.techstore.web.model.Usuario;
import com.techstore.web.util.ApiRateLimiter;
import com.techstore.web.util.ApiSupport;
import com.techstore.web.util.Json;
import com.techstore.web.util.RoleUtil;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class AuthFilter implements Filter {

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        // Sin configuración adicional.
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String contextPath = httpRequest.getContextPath();
        String path = httpRequest.getRequestURI().substring(contextPath.length());
        String method = httpRequest.getMethod();
        boolean isApi = path.startsWith("/api/");

        if ("OPTIONS".equalsIgnoreCase(method)) {
            // CorsFilter already answered the preflight for /api/*; nothing to guard here.
            chain.doFilter(request, response);
            return;
        }

        if (isApi) {
            String claveLimite = claveRateLimit(httpRequest);
            if (ApiRateLimiter.excedeLimite(claveLimite)) {
                httpResponse.setHeader("Retry-After", String.valueOf(ApiRateLimiter.segundosParaReintentar(claveLimite)));
                Json.writeError(httpResponse, 429, "Demasiadas solicitudes. Espera unos segundos e intenta de nuevo.");
                return;
            }
        }

        if (esPublico(path, isApi, method)) {
            chain.doFilter(request, response);
            return;
        }

        Usuario usuario = ApiSupport.currentUser(httpRequest);
        if (usuario == null) {
            if (isApi) {
                Json.writeError(httpResponse, HttpServletResponse.SC_UNAUTHORIZED, "Debes iniciar sesión para continuar.");
                return;
            }
            String mensaje = URLEncoder.encode("Debes iniciar sesión para continuar.", StandardCharsets.UTF_8);
            String query = httpRequest.getQueryString();
            String destino = path + (query == null || query.isBlank() ? "" : "?" + query);
            String redirect = URLEncoder.encode(destino, StandardCharsets.UTF_8);
            httpResponse.sendRedirect(contextPath + "/login?mensaje=" + mensaje + "&redirect=" + redirect);
            return;
        }

        if (!rolPermitido(path, method, usuario.getRol())) {
            String mensaje = URLEncoder.encode("No tienes permisos para esta acción.", StandardCharsets.UTF_8);
            if (isApi) {
                Json.writeError(httpResponse, HttpServletResponse.SC_FORBIDDEN, "No tienes permisos para esta acción.");
                return;
            }
            httpResponse.sendRedirect(contextPath + "/?mensaje=" + mensaje);
            return;
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Sin limpieza adicional.
    }

    private boolean esPublico(String path, boolean isApi, String method) {
        if (isApi) {
            boolean isGet = "GET".equalsIgnoreCase(method);
            return path.equals("/api/auth/login")
                    || path.equals("/api/auth/register")
                    || path.equals("/api/auth/session")
                    || (isGet && (path.equals("/api/productos") || path.startsWith("/api/productos/")));
        }

        return "/".equals(path)
                || "/index.jsp".equals(path)
                || "/login.jsp".equals(path)
                || "/login".equals(path)
                || "/logout".equals(path)
                || "/ui".equals(path)
                || path.startsWith("/ui/")
                || path.startsWith("/css/")
                || path.startsWith("/images/")
                || path.startsWith("/img/")
                || path.startsWith("/assets/")
                || path.endsWith(".ico")
                || path.endsWith(".js")
                || path.endsWith(".css");
    }

    /**
     * Gestión de cuentas y proveedores es exclusiva de personal interno; el catálogo de
     * productos se puede navegar como cliente pero solo el personal interno lo edita.
     * Pedidos/carritos/tickets quedan abiertos a cualquier rol autenticado aquí porque
     * un cliente sí debe poder usarlos — la restricción de "solo ver lo propio" se
     * aplica dentro de cada servlet, no a nivel de ruta.
     */
    private boolean rolPermitido(String path, String method, String rol) {
        boolean esAdmin = RoleUtil.isAdmin(rol);
        boolean esInterno = RoleUtil.isInternal(rol);

        if (esRuta(path, "/usuarios") || esRuta(path, "/api/usuarios")) {
            return esAdmin;
        }

        if (esRuta(path, "/proveedores") || esRuta(path, "/api/proveedores")) {
            return esInterno;
        }

        boolean esEdicionProducto = (esRuta(path, "/productos") || esRuta(path, "/api/productos"))
                && !"GET".equalsIgnoreCase(method);
        if (esEdicionProducto) {
            return esInterno;
        }

        return true;
    }

    private boolean esRuta(String path, String base) {
        return path.equals(base) || path.startsWith(base + "/");
    }

    /** Sesión si hay una activa (evita que compartir IP -oficina, NAT- comparta límite); si no, la IP remota. */
    private String claveRateLimit(HttpServletRequest request) {
        Usuario usuario = ApiSupport.currentUser(request);
        if (usuario != null && usuario.getIdUsuario() != null) {
            return "u:" + usuario.getIdUsuario();
        }
        return "ip:" + request.getRemoteAddr();
    }
}
