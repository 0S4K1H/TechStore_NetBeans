package com.techstore.web.dao;

import com.techstore.web.model.Usuario;
import com.techstore.web.util.Conexion;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class UsuarioDAO {

    public String siguienteIdUsuario() throws SQLException {
        int siguiente = siguienteSecuencia("""
                SELECT COALESCE(MAX(CAST(SUBSTRING(UPPER(id_usuario), 4) AS UNSIGNED)), 0) AS maximo
                FROM usuarios
                WHERE UPPER(id_usuario) REGEXP '^USR[0-9]+$'
                """);
        return String.format("USR%03d", siguiente + 1);
    }

    public Usuario autenticar(String identificador, String password) throws SQLException {
        String sql = """
                SELECT id_usuario, username, password_demo, rol, nombre, email, ciudad, activo, fecha_registro
                FROM usuarios
                WHERE activo = 1
                  AND (LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?))
                  AND password_demo = ?
                """;

        String usuarioNormalizado = identificador == null ? "" : identificador.trim();
        String passwordNormalizado = password == null ? "" : password.trim();

        if (usuarioNormalizado.isBlank() || passwordNormalizado.isBlank()) {
            return null;
        }

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, usuarioNormalizado);
            ps.setString(2, usuarioNormalizado);
            ps.setString(3, passwordNormalizado);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapearUsuario(rs) : null;
            }
        }
    }

    public List<Usuario> listar(String filtro) throws SQLException {
        StringBuilder sql = new StringBuilder("""
                SELECT id_usuario, username, password_demo, rol, nombre, email, ciudad, activo, fecha_registro
                FROM usuarios
                """);

        boolean tieneFiltro = filtro != null && !filtro.isBlank();
        if (tieneFiltro) {
            sql.append("""
                    WHERE LOWER(id_usuario) LIKE ?
                       OR LOWER(username) LIKE ?
                       OR LOWER(rol) LIKE ?
                       OR LOWER(nombre) LIKE ?
                       OR LOWER(email) LIKE ?
                       OR LOWER(ciudad) LIKE ?
                    """);
        }
        sql.append(" ORDER BY nombre");

        List<Usuario> usuarios = new ArrayList<>();

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql.toString())) {

            if (tieneFiltro) {
                String valor = "%" + filtro.trim().toLowerCase() + "%";
                ps.setString(1, valor);
                ps.setString(2, valor);
                ps.setString(3, valor);
                ps.setString(4, valor);
                ps.setString(5, valor);
                ps.setString(6, valor);
            }

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    usuarios.add(mapearUsuario(rs));
                }
            }
        }

        return usuarios;
    }

    public List<Usuario> listarClientesActivos() throws SQLException {
        return listarActivosPorRol("cliente");
    }

    public List<Usuario> listarEmpleadosActivos() throws SQLException {
        return listarActivosPorRol("empleado");
    }

    public List<Usuario> listarActivosPorRol(String rol) throws SQLException {
        String sql = """
                SELECT id_usuario, username, password_demo, rol, nombre, email, ciudad, activo, fecha_registro
                FROM usuarios
                WHERE rol = ? AND activo = 1
                ORDER BY nombre
                """;

        List<Usuario> usuarios = new ArrayList<>();

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, rol);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    usuarios.add(mapearUsuario(rs));
                }
            }
        }

        return usuarios;
    }

    public Usuario buscarPorId(String idUsuario) throws SQLException {
        String sql = """
                SELECT id_usuario, username, password_demo, rol, nombre, email, ciudad, activo, fecha_registro
                FROM usuarios
                WHERE id_usuario = ?
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, idUsuario);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapearUsuario(rs) : null;
            }
        }
    }

    public boolean crear(Usuario usuario) throws SQLException {
        String sql = """
                INSERT INTO usuarios (id_usuario, username, password_demo, rol, nombre, email, ciudad, activo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, usuario.getIdUsuario());
            ps.setString(2, usuario.getUsername());
            ps.setString(3, usuario.getPasswordDemo());
            ps.setString(4, usuario.getRol());
            ps.setString(5, usuario.getNombre());
            ps.setString(6, usuario.getEmail());
            ps.setString(7, usuario.getCiudad());
            ps.setInt(8, usuario.getActivo());
            return ps.executeUpdate() > 0;
        }
    }

    public boolean actualizar(Usuario usuario) throws SQLException {
        String sql = """
                UPDATE usuarios
                SET username = ?, password_demo = ?, rol = ?, nombre = ?, email = ?, ciudad = ?, activo = ?
                WHERE id_usuario = ?
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, usuario.getUsername());
            ps.setString(2, usuario.getPasswordDemo());
            ps.setString(3, usuario.getRol());
            ps.setString(4, usuario.getNombre());
            ps.setString(5, usuario.getEmail());
            ps.setString(6, usuario.getCiudad());
            ps.setInt(7, usuario.getActivo());
            ps.setString(8, usuario.getIdUsuario());
            return ps.executeUpdate() > 0;
        }
    }

    public boolean eliminar(String idUsuario) throws SQLException {
        String sql = """
                UPDATE usuarios
                SET activo = 0
                WHERE id_usuario = ? AND activo = 1
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, idUsuario);
            return ps.executeUpdate() > 0;
        }
    }

    private Usuario mapearUsuario(ResultSet rs) throws SQLException {
        return new Usuario(
                rs.getString("id_usuario"),
                rs.getString("username"),
                rs.getString("password_demo"),
                rs.getString("rol"),
                rs.getString("nombre"),
                rs.getString("email"),
                rs.getString("ciudad"),
                rs.getInt("activo"),
                rs.getTimestamp("fecha_registro")
        );
    }

    private int siguienteSecuencia(String sql) throws SQLException {
        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getInt("maximo") : 0;
        }
    }
}
