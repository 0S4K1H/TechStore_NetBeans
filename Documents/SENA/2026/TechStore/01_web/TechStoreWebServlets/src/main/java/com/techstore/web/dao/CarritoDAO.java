package com.techstore.web.dao;

import com.techstore.web.model.Carrito;
import com.techstore.web.util.Conexion;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CarritoDAO {

    public Long siguienteIdCarrito() throws SQLException {
        String sql = "SELECT COALESCE(MAX(id_carrito), 0) AS maximo FROM carritos";

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getLong("maximo") + 1L : 1L;
        }
    }

    public List<Carrito> listar(String filtro) throws SQLException {
        StringBuilder sql = new StringBuilder("""
                SELECT c.id_carrito, c.id_usuario, u.nombre AS usuario, c.estado,
                       c.fecha_creacion, c.fecha_actualizacion
                FROM carritos c
                INNER JOIN usuarios u ON u.id_usuario = c.id_usuario
                """);

        boolean tieneFiltro = filtro != null && !filtro.isBlank();
        if (tieneFiltro) {
            sql.append("""
                    WHERE CAST(c.id_carrito AS CHAR) LIKE ?
                       OR LOWER(c.id_usuario) LIKE ?
                       OR LOWER(u.nombre) LIKE ?
                       OR LOWER(c.estado) LIKE ?
                    """);
        }
        sql.append(" ORDER BY c.fecha_creacion DESC, c.id_carrito DESC");

        List<Carrito> carritos = new ArrayList<>();

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql.toString())) {

            if (tieneFiltro) {
                String valor = "%" + filtro.trim().toLowerCase() + "%";
                ps.setString(1, valor);
                ps.setString(2, valor);
                ps.setString(3, valor);
                ps.setString(4, valor);
            }

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    carritos.add(mapearCarrito(rs));
                }
            }
        }

        return carritos;
    }

    public Carrito buscarPorId(Long idCarrito) throws SQLException {
        String sql = """
                SELECT c.id_carrito, c.id_usuario, u.nombre AS usuario, c.estado,
                       c.fecha_creacion, c.fecha_actualizacion
                FROM carritos c
                INNER JOIN usuarios u ON u.id_usuario = c.id_usuario
                WHERE c.id_carrito = ?
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setLong(1, idCarrito);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapearCarrito(rs) : null;
            }
        }
    }

    public boolean crear(Carrito carrito) throws SQLException {
        String sqlConId = """
                INSERT INTO carritos (id_carrito, id_usuario, estado)
                VALUES (?, ?, ?)
                """;
        String sqlSinId = """
                INSERT INTO carritos (id_usuario, estado)
                VALUES (?, ?)
                """;

        try (Connection conexion = Conexion.getConnection()) {
            if (carrito.getIdCarrito() != null) {
                try (PreparedStatement ps = conexion.prepareStatement(sqlConId)) {
                    ps.setLong(1, carrito.getIdCarrito());
                    ps.setString(2, carrito.getIdUsuario());
                    ps.setString(3, carrito.getEstado());
                    return ps.executeUpdate() > 0;
                }
            }

            try (PreparedStatement ps = conexion.prepareStatement(sqlSinId)) {
                ps.setString(1, carrito.getIdUsuario());
                ps.setString(2, carrito.getEstado());
                return ps.executeUpdate() > 0;
            }
        }
    }

    public boolean actualizar(Carrito carrito) throws SQLException {
        String sql = """
                UPDATE carritos
                SET id_usuario = ?, estado = ?
                WHERE id_carrito = ?
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, carrito.getIdUsuario());
            ps.setString(2, carrito.getEstado());
            ps.setLong(3, carrito.getIdCarrito());
            return ps.executeUpdate() > 0;
        }
    }

    public boolean eliminar(Long idCarrito) throws SQLException {
        String sql = """
                UPDATE carritos
                SET estado = 'cerrado'
                WHERE id_carrito = ? AND estado = 'activo'
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setLong(1, idCarrito);
            return ps.executeUpdate() > 0;
        }
    }

    private Carrito mapearCarrito(ResultSet rs) throws SQLException {
        return new Carrito(
                rs.getLong("id_carrito"),
                rs.getString("id_usuario"),
                rs.getString("usuario"),
                rs.getString("estado"),
                rs.getTimestamp("fecha_creacion"),
                rs.getTimestamp("fecha_actualizacion")
        );
    }
}
