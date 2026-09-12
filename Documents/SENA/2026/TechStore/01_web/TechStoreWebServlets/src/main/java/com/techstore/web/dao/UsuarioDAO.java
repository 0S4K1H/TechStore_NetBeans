package com.techstore.web.dao;

import com.techstore.web.model.Usuario;
import com.techstore.web.util.Conexion;
import com.techstore.web.util.PasswordUtil;
import com.techstore.web.util.RetrySupport;
import com.techstore.web.util.RoleUtil;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
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
                """;

        String usuarioNormalizado = identificador == null ? "" : identificador.trim();
        String passwordNormalizado = password == null ? "" : password.trim();

        if (usuarioNormalizado.isBlank() || passwordNormalizado.isBlank()) {
            return null;
        }

        Usuario usuario;
        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, usuarioNormalizado);
            ps.setString(2, usuarioNormalizado);

            try (ResultSet rs = ps.executeQuery()) {
                if (!rs.next()) {
                    return null;
                }
                usuario = mapearUsuario(rs);
            }
        }

        String almacenada = usuario.getPasswordDemo();
        if (PasswordUtil.isHashed(almacenada)) {
            return PasswordUtil.verify(passwordNormalizado, almacenada) ? usuario : null;
        }

        // Cuenta legacy con password_demo en texto plano (datos sembrados sin migrar):
        // valida contra el valor guardado y, si coincide, migra a bcrypt de inmediato.
        if (!almacenada.equals(passwordNormalizado)) {
            return null;
        }
        String hasheada = PasswordUtil.hash(passwordNormalizado);
        actualizarPasswordHash(usuario.getIdUsuario(), hasheada);
        usuario.setPasswordDemo(hasheada);
        return usuario;
    }

    private void actualizarPasswordHash(String idUsuario, String passwordHasheada) throws SQLException {
        String sql = "UPDATE usuarios SET password_demo = ? WHERE id_usuario = ?";
        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, passwordHasheada);
            ps.setString(2, idUsuario);
            ps.executeUpdate();
        }
    }

    /** Resuelve un identificador (username o email) al id_usuario canónico de la cuenta activa, o null si no existe. */
    public String idCanonico(String identificador) throws SQLException {
        String sql = """
                SELECT id_usuario
                FROM usuarios
                WHERE activo = 1
                  AND (LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?))
                """;

        String normalizado = identificador == null ? "" : identificador.trim();
        if (normalizado.isBlank()) {
            return null;
        }

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, normalizado);
            ps.setString(2, normalizado);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getString("id_usuario") : null;
            }
        }
    }

    /** Valida unicidad real contra la tabla completa, incluyendo cuentas inactivas. */
    public boolean existeUsernameOEmail(String username, String email) throws SQLException {
        String sql = """
                SELECT 1
                FROM usuarios
                WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)
                LIMIT 1
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, username == null ? "" : username.trim());
            ps.setString(2, email == null ? "" : email.trim());

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        }
    }

    public List<Usuario> listar(String filtro) throws SQLException {
        StringBuilder sql = new StringBuilder("""
                SELECT id_usuario, username, password_demo, rol, nombre, email, ciudad, activo, fecha_registro
                FROM usuarios
                WHERE activo = 1
                """);

        boolean tieneFiltro = filtro != null && !filtro.isBlank();
        if (tieneFiltro) {
            sql.append("""
                    AND (
                         LOWER(id_usuario) LIKE ?
                       OR LOWER(username) LIKE ?
                       OR LOWER(rol) LIKE ?
                       OR LOWER(nombre) LIKE ?
                       OR LOWER(email) LIKE ?
                       OR LOWER(ciudad) LIKE ?
                    )
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
                WHERE id_usuario = ? AND activo = 1
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, idUsuario);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapearUsuario(rs) : null;
            }
        }
    }

    /**
     * Genera el id_usuario y crea la cuenta, reintentando si otra inserción concurrente
     * ya tomó el id calculado (SELECT MAX(id)+1 no es atómico: bajo registros
     * simultáneos dos solicitudes pueden calcular el mismo próximo id_usuario).
     */
    public Usuario crearConIdAutomatico(Usuario usuario) throws SQLException {
        SQLIntegrityConstraintViolationException ultimoError = null;
        for (int intento = 0; intento < 20; intento++) {
            usuario.setIdUsuario(siguienteIdUsuario());
            try {
                crear(usuario);
                return usuario;
            } catch (SQLIntegrityConstraintViolationException ex) {
                ultimoError = ex;
                RetrySupport.esperarBackoffAleatorio(intento);
            }
        }
        throw ultimoError;
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
            ps.setString(3, hashSiHaceFalta(usuario.getPasswordDemo()));
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
            ps.setString(2, hashSiHaceFalta(usuario.getPasswordDemo()));
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
                RoleUtil.canonical(rs.getString("rol")),
                rs.getString("nombre"),
                rs.getString("email"),
                rs.getString("ciudad"),
                rs.getInt("activo"),
                rs.getTimestamp("fecha_registro")
        );
    }

    private String hashSiHaceFalta(String password) {
        return PasswordUtil.isHashed(password) ? password : PasswordUtil.hash(password);
    }

    private int siguienteSecuencia(String sql) throws SQLException {
        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getInt("maximo") : 0;
        }
    }
}
