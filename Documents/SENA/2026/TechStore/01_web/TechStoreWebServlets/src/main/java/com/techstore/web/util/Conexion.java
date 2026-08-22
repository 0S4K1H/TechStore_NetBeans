package com.techstore.web.util;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import java.sql.Connection;
import java.sql.SQLException;

public final class Conexion {

    // connectTimeout: falla rapido si MySQL no responde al abrir el socket.
    // socketTimeout: mata cualquier query que se cuelgue mas de 15s en vez de retener
    // el thread de Tomcat y la conexion del pool indefinidamente.
    private static final String URL = "jdbc:mysql://127.0.0.1:3308/techstore_sql_real"
            + "?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true"
            + "&connectTimeout=5000&socketTimeout=15000";
    private static final String USER = "root";
    private static final String PASSWORD = "TechStore3308";

    private static final HikariDataSource DATA_SOURCE;

    static {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl(URL);
        config.setUsername(USER);
        config.setPassword(PASSWORD);
        config.setDriverClassName("com.mysql.cj.jdbc.Driver");

        // MySQL portable corre con el max_connections por defecto (~151) en la misma
        // maquina que Tomcat (maxThreads=150). El pool se queda bien por debajo de eso
        // para dejar margen a herramientas de administracion y no agotar el limite del
        // servidor si algun dia hay mas de una instancia de la app.
        config.setMaximumPoolSize(20);
        config.setMinimumIdle(5);

        // Bajo carga, una request espera hasta 5s por una conexion libre y despues falla
        // rapido (SQLTransientConnectionException) en vez de colgar el thread de Tomcat
        // indefinidamente.
        config.setConnectionTimeout(5_000);
        config.setValidationTimeout(3_000);
        config.setIdleTimeout(5 * 60_000);
        config.setMaxLifetime(25 * 60_000);

        // Si una conexion queda prestada mas de 30s sin devolverse, queda como fuga y
        // se loguea con el stack trace de quien la pidio.
        config.setLeakDetectionThreshold(30_000);

        config.setPoolName("techstore-pool");

        DATA_SOURCE = new HikariDataSource(config);
    }

    private Conexion() {
    }

    public static Connection getConnection() throws SQLException {
        return DATA_SOURCE.getConnection();
    }
}
