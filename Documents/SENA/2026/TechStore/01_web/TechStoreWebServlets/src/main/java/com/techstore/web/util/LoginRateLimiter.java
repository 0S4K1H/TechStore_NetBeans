package com.techstore.web.util;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

// ponytail: in-memory map, single Tomcat instance only. Upgrade path: shared store (DB/Redis) if scaled to multiple nodes.
public final class LoginRateLimiter {

    private static final int MAX_INTENTOS = 5;
    private static final long VENTANA_MS = 15 * 60 * 1000L;

    private record Intento(AtomicInteger conteo, long inicioVentana) {
    }

    private static final ConcurrentHashMap<String, Intento> INTENTOS = new ConcurrentHashMap<>();

    private LoginRateLimiter() {
    }

    /** True si el identificador (usuario/email/IP) debe ser bloqueado por demasiados intentos fallidos. */
    public static boolean estaBloqueado(String identificador) {
        Intento intento = INTENTOS.get(clave(identificador));
        if (intento == null) {
            return false;
        }
        if (System.currentTimeMillis() - intento.inicioVentana() > VENTANA_MS) {
            INTENTOS.remove(clave(identificador));
            return false;
        }
        return intento.conteo().get() >= MAX_INTENTOS;
    }

    public static void registrarFallo(String identificador) {
        INTENTOS.compute(clave(identificador), (key, actual) -> {
            long ahora = System.currentTimeMillis();
            if (actual == null || ahora - actual.inicioVentana() > VENTANA_MS) {
                return new Intento(new AtomicInteger(1), ahora);
            }
            actual.conteo().incrementAndGet();
            return actual;
        });
    }

    public static void registrarExito(String identificador) {
        INTENTOS.remove(clave(identificador));
    }

    private static String clave(String identificador) {
        return identificador == null ? "" : identificador.trim().toLowerCase();
    }
}
