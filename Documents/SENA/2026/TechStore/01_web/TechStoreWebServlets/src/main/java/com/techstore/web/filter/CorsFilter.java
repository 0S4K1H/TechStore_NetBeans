package com.techstore.web.filter;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.FilterConfig;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class CorsFilter implements Filter {

    // Dev origins always allowed. Prod origin(s) come from TECHSTORE_CORS_ORIGINS (comma-separated env var),
    // e.g. TECHSTORE_CORS_ORIGINS=https://techstore.midominio.com,https://www.techstore.midominio.com
    private static final Set<String> ALLOWED_ORIGINS = buildAllowedOrigins();

    private static Set<String> buildAllowedOrigins() {
        Set<String> origins = new HashSet<>(Set.of("http://localhost:5173", "http://127.0.0.1:5173"));
        String env = System.getenv("TECHSTORE_CORS_ORIGINS");
        if (env != null && !env.isBlank()) {
            origins.addAll(Arrays.stream(env.split(",")).map(String::trim).filter(s -> !s.isEmpty()).toList());
        }
        return origins;
    }

    @Override
    public void init(FilterConfig filterConfig) {
        // Sin configuración adicional.
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String origin = httpRequest.getHeader("Origin");
        if (origin != null && ALLOWED_ORIGINS.contains(origin)) {
            httpResponse.setHeader("Access-Control-Allow-Origin", origin);
            httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
            httpResponse.setHeader("Vary", "Origin");
        }

        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type");
            httpResponse.setStatus(HttpServletResponse.SC_NO_CONTENT);
            return;
        }

        chain.doFilter(request, response);
    }

    @Override
    public void destroy() {
        // Sin limpieza adicional.
    }
}
