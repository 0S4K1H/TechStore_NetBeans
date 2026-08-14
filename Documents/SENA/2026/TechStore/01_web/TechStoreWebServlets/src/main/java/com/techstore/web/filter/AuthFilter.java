package com.techstore.web.filter;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import jakarta.servlet.DispatcherType;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.annotation.WebFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

@WebFilter(urlPatterns = "/*", dispatcherTypes = {DispatcherType.REQUEST})
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

        if (esPublico(path)) {
            chain.doFilter(request, response);
            return;
        }

        HttpSession session = httpRequest.getSession(false);
        if (session == null || session.getAttribute("usuarioAutenticado") == null) {
            String mensaje = URLEncoder.encode("Debes iniciar sesión para continuar.", StandardCharsets.UTF_8);
            String query = httpRequest.getQueryString();
            String destino = path + (query == null || query.isBlank() ? "" : "?" + query);
            String redirect = URLEncoder.encode(destino, StandardCharsets.UTF_8);
            httpResponse.sendRedirect(contextPath + "/login?mensaje=" + mensaje + "&redirect=" + redirect);
            return;
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Sin limpieza adicional.
    }

    private boolean esPublico(String path) {
        return "/".equals(path)
                || "/login.jsp".equals(path)
                || "/login".equals(path)
                || "/logout".equals(path)
                || path.startsWith("/css/")
                || path.startsWith("/images/")
                || path.startsWith("/img/")
                || path.startsWith("/assets/")
                || path.endsWith(".ico")
                || path.endsWith(".js")
                || path.endsWith(".css");
    }
}
