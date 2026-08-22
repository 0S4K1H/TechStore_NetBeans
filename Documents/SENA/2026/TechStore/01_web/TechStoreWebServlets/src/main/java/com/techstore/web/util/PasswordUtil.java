package com.techstore.web.util;

import java.util.regex.Pattern;
import org.mindrot.jbcrypt.BCrypt;

public final class PasswordUtil {

    private static final Pattern BCRYPT_HASH = Pattern.compile("^\\$2[aby]\\$.{56}$");

    private PasswordUtil() {
    }

    public static String hash(String raw) {
        return BCrypt.hashpw(raw, BCrypt.gensalt());
    }

    public static boolean verify(String raw, String hashed) {
        if (raw == null || hashed == null || !isHashed(hashed)) {
            return false;
        }
        return BCrypt.checkpw(raw, hashed);
    }

    /** True if the value already looks like a bcrypt hash ($2a$/$2b$/$2y$...), so we don't re-hash it. */
    public static boolean isHashed(String value) {
        return value != null && BCRYPT_HASH.matcher(value).matches();
    }
}
