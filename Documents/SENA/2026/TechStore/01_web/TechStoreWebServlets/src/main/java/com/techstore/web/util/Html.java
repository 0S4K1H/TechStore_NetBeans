package com.techstore.web.util;

public final class Html {

    private Html() {
    }

    /** Escapes a value for safe inclusion in HTML text or a quoted attribute. */
    public static String escape(String valor) {
        if (valor == null) {
            return "";
        }
        return valor
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
