package com.techstore.web.dao;

import com.techstore.web.model.Proveedor;
import com.techstore.web.util.Conexion;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ProveedorDAO {

    public String siguienteIdProveedor() throws SQLException {
        int siguiente = siguienteSecuencia("""
                SELECT COALESCE(MAX(CAST(SUBSTRING(UPPER(id_proveedor), 4) AS UNSIGNED)), 0) AS maximo
                FROM proveedores
                WHERE UPPER(id_proveedor) REGEXP '^PRV[0-9]+$'
                """);
        return String.format("PRV%03d", siguiente + 1);
    }

    public List<Proveedor> listar(String filtro) throws SQLException {
        StringBuilder sql = new StringBuilder("""
                SELECT id_proveedor, nombre, email
                FROM proveedores
                """);

        boolean tieneFiltro = filtro != null && !filtro.isBlank();
        if (tieneFiltro) {
            sql.append("""
                    WHERE LOWER(id_proveedor) LIKE ?
                       OR LOWER(nombre) LIKE ?
                       OR LOWER(email) LIKE ?
                    """);
        }
        sql.append(" ORDER BY nombre");

        List<Proveedor> proveedores = new ArrayList<>();

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql.toString())) {

            if (tieneFiltro) {
                String valor = "%" + filtro.trim().toLowerCase() + "%";
                ps.setString(1, valor);
                ps.setString(2, valor);
                ps.setString(3, valor);
            }

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    proveedores.add(mapearProveedor(rs));
                }
            }
        }

        return proveedores;
    }

    public Proveedor buscarPorId(String idProveedor) throws SQLException {
        String sql = """
                SELECT id_proveedor, nombre, email
                FROM proveedores
                WHERE id_proveedor = ?
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, idProveedor);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapearProveedor(rs) : null;
            }
        }
    }

    public boolean crear(Proveedor proveedor) throws SQLException {
        String sql = """
                INSERT INTO proveedores (id_proveedor, nombre, email)
                VALUES (?, ?, ?)
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, proveedor.getIdProveedor());
            ps.setString(2, proveedor.getNombre());
            ps.setString(3, proveedor.getEmail());
            return ps.executeUpdate() > 0;
        }
    }

    public boolean actualizar(Proveedor proveedor) throws SQLException {
        String sql = """
                UPDATE proveedores
                SET nombre = ?, email = ?
                WHERE id_proveedor = ?
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, proveedor.getNombre());
            ps.setString(2, proveedor.getEmail());
            ps.setString(3, proveedor.getIdProveedor());
            return ps.executeUpdate() > 0;
        }
    }

    public boolean eliminar(String idProveedor) throws SQLException {
        if (tieneProductosAsociados(idProveedor)) {
            return false;
        }

        String sql = "DELETE FROM proveedores WHERE id_proveedor = ?";

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, idProveedor);
            return ps.executeUpdate() > 0;
        }
    }

    private boolean tieneProductosAsociados(String idProveedor) throws SQLException {
        String sql = "SELECT COUNT(*) FROM productos WHERE id_proveedor = ?";

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, idProveedor);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() && rs.getInt(1) > 0;
            }
        }
    }

    private Proveedor mapearProveedor(ResultSet rs) throws SQLException {
        return new Proveedor(
                rs.getString("id_proveedor"),
                rs.getString("nombre"),
                rs.getString("email")
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
