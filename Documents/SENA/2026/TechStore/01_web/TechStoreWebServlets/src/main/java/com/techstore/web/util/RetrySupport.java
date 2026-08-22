package com.techstore.web.util;

import java.util.concurrent.ThreadLocalRandom;

/**
 * Backoff aleatorio para reintentos de inserción tras choque de PK generado por
 * concurrencia (SELECT MAX(id)+1 no es atómico). Sin jitter, varias solicitudes que
 * chocan al mismo tiempo recalculan casi el mismo "próximo id" y vuelven a chocar en
 * cadena; esperar un poco al azar entre intentos las desincroniza.
 */
public final class RetrySupport {

    private RetrySupport() {
    }

    public static void esperarBackoffAleatorio(int intento) {
        int techoMs = Math.min(10 + intento * 15, 200);
        int esperaMs = ThreadLocalRandom.current().nextInt(techoMs) + 1;
        try {
            Thread.sleep(esperaMs);
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
        }
    }
}
