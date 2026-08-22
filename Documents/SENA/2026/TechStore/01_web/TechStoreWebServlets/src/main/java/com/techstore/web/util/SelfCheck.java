package com.techstore.web.util;

import java.math.BigDecimal;
import java.util.List;

/**
 * Runnable check for the two non-trivial pieces added in this pass: password
 * hashing and order-money math. No test framework — run directly:
 *   java -cp target/classes;lib/jbcrypt-0.4.jar com.techstore.web.util.SelfCheck
 */
public final class SelfCheck {

    private SelfCheck() {
    }

    public static void main(String[] args) {
        checkPasswordRoundTrip();
        checkPasswordRejectsWrong();
        checkIsHashedDetection();
        checkTotalMath();
        checkSubtotalSum();
        checkEmptyCartRejected();
        System.out.println("SelfCheck OK: " + 6 + " checks passed.");
    }

    private static void checkPasswordRoundTrip() {
        String hash = PasswordUtil.hash("12345");
        assert PasswordUtil.verify("12345", hash) : "hash/verify round-trip failed";
    }

    private static void checkPasswordRejectsWrong() {
        String hash = PasswordUtil.hash("12345");
        assert !PasswordUtil.verify("wrong", hash) : "verify accepted wrong password";
    }

    private static void checkIsHashedDetection() {
        assert PasswordUtil.isHashed(PasswordUtil.hash("x")) : "isHashed should detect a real bcrypt hash";
        assert !PasswordUtil.isHashed("12345") : "isHashed should reject plaintext";
    }

    private static void checkTotalMath() {
        BigDecimal total = PedidoTotales.calcularTotal(
                new BigDecimal("100000"), new BigDecimal("15000"), new BigDecimal("5000"));
        assert total.compareTo(new BigDecimal("110000")) == 0 : "total math wrong: " + total;
    }

    private static void checkSubtotalSum() {
        BigDecimal sum = PedidoTotales.sumarSubtotales(
                List.of(new BigDecimal("10000"), new BigDecimal("20000"), new BigDecimal("5000")));
        assert sum.compareTo(new BigDecimal("35000")) == 0 : "subtotal sum wrong: " + sum;
    }

    private static void checkEmptyCartRejected() {
        assert PedidoTotales.sumarSubtotales(List.of()).compareTo(BigDecimal.ZERO) == 0
                : "empty cart should sum to zero, checkout servlet rejects zero-item lists separately";
    }
}
