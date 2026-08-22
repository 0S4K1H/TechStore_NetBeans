package com.techstore.web.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonPrimitive;
import java.io.IOException;
import java.io.Reader;
import java.sql.Date;
import java.sql.Timestamp;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public final class Json {

    private static final Gson GSON = new GsonBuilder()
            .registerTypeAdapter(Timestamp.class, (com.google.gson.JsonSerializer<Timestamp>)
                    (src, type, ctx) -> src == null ? null : new JsonPrimitive(src.toInstant().toString()))
            .registerTypeAdapter(Date.class, (com.google.gson.JsonSerializer<Date>)
                    (src, type, ctx) -> src == null ? null : new JsonPrimitive(src.toLocalDate().toString()))
            .registerTypeAdapter(Date.class, (com.google.gson.JsonDeserializer<Date>)
                    (json, type, ctx) -> {
                        if (json == null || json.isJsonNull() || json.getAsString().isBlank()) {
                            return null;
                        }
                        return Date.valueOf(json.getAsString());
                    })
            .create();

    private Json() {
    }

    public static void write(HttpServletResponse response, int status, Object body) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write(GSON.toJson(body));
    }

    public static void writeError(HttpServletResponse response, int status, String message) throws IOException {
        write(response, status, new ErrorBody(message));
    }

    public static <T> T read(HttpServletRequest request, Class<T> type) throws IOException {
        try (Reader reader = request.getReader()) {
            T value = GSON.fromJson(reader, type);
            if (value == null) {
                throw new IOException("Cuerpo de la solicitud vacío o inválido.");
            }
            return value;
        }
    }

    private record ErrorBody(String error) {
    }
}
