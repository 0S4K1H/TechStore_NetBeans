package com.techstore.web.util;

import java.math.BigDecimal;
import java.util.List;

public final class PedidoTotales {

    private PedidoTotales() {
    }

    public static BigDecimal calcularTotal(BigDecimal subtotal, BigDecimal costoEnvio, BigDecimal descuento) {
        return subtotal.add(costoEnvio).subtract(descuento);
    }

    public static BigDecimal sumarSubtotales(List<BigDecimal> subtotales) {
        return subtotales.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
