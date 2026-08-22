package com.techstore.web.util;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

// ponytail: in-memory map, single Tomcat instance only. Upgrade path: shared store (Redis) if scaled to multiple nodes.
/**
 * Limite general de trafico por clave (sesion autenticada o IP) para toda la API,
 * distinto de LoginRateLimiter que solo protege el endpoint de login. Frena loops
 * infinitos del frontend o un cliente golpeando la API sin bloquear uso normal.
 */
public final class ApiRateLimiter {

    private static final int MAX_REQUESTS = 120;
    private static final long VENTANA_MS = 10_000L;

    private record Contador(AtomicInteger conteo, long inicioVentana) {
    }

    private static final ConcurrentHashMap<String, Contador> CONTADORES = new ConcurrentHashMap<>();

    private ApiRateLimiter() {
    }

    /** True si la clave superó el límite en la ventana actual y debe recibir 429. */
    public static boolean excedeLimite(String clave) {
        long ahora = System.currentTimeMillis();
        Contador actualizado = CONTADORES.compute(clave, (key, actual) -> {
            if (actual == null || ahora - actual.inicioVentana() > VENTANA_MS) {
                return new Contador(new AtomicInteger(1), ahora);
            }
            actual.conteo().incrementAndGet();
            return actual;
        });
        return actualizado.conteo().get() > MAX_REQUESTS;
    }

    /** Segundos hasta que la ventana actual de la clave se reinicie, para el header Retry-After. */
    public static long segundosParaReintentar(String clave) {
        Contador actual = CONTADORES.get(clave);
        if (actual == null) {
            return 1;
        }
        long restante = VENTANA_MS - (System.currentTimeMillis() - actual.inicioVentana());
        return Math.max(1, (restante + 999) / 1000);
    }
}
