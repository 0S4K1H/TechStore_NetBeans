package com.techstore.web.dao;

import com.techstore.web.model.Producto;
import com.techstore.web.model.Proveedor;
import com.techstore.web.util.Conexion;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ProductoDAO {

    public String siguienteIdProducto() throws SQLException {
        int siguiente = siguienteSecuencia("""
                SELECT COALESCE(MAX(CAST(SUBSTRING(UPPER(id_producto), 2) AS UNSIGNED)), 0) AS maximo
                FROM productos
                WHERE UPPER(id_producto) REGEXP '^P[0-9]+$'
                """);
        return "p" + (siguiente + 1);
    }

    public String siguienteCodigoInventario() throws SQLException {
        int siguiente = siguienteSecuencia("""
                SELECT COALESCE(MAX(CAST(SUBSTRING(UPPER(codigo_inv), 5) AS UNSIGNED)), 0) AS maximo
                FROM productos
                WHERE UPPER(codigo_inv) REGEXP '^INV-[0-9]+$'
                """);
        return "INV-" + (siguiente + 1);
    }

    public int contarStockBajo(int umbral) throws SQLException {
        String sql = "SELECT COUNT(*) AS total FROM productos WHERE activo = 1 AND stock <= ?";
        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setInt(1, umbral);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? rs.getInt("total") : 0;
            }
        }
    }

    public List<Producto> listar(String filtro) throws SQLException {
        StringBuilder sql = new StringBuilder("""
                SELECT p.id_producto, p.codigo_inv, p.id_proveedor, pr.nombre AS proveedor,
                       p.nombre, p.categoria, p.precio, p.stock, p.activo, p.fecha_creacion
                FROM productos p
                INNER JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
                WHERE p.activo = 1
                """);

        boolean tieneFiltro = filtro != null && !filtro.isBlank();
        if (tieneFiltro) {
            sql.append("""
                    AND (
                         LOWER(p.id_producto) LIKE ?
                       OR LOWER(p.codigo_inv) LIKE ?
                       OR LOWER(p.nombre) LIKE ?
                       OR LOWER(pr.nombre) LIKE ?
                    )
                    """);
        }
        sql.append(" ORDER BY p.id_producto");

        List<Producto> productos = new ArrayList<>();

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
                    productos.add(mapearProducto(rs));
                }
            }
        }

        return productos;
    }

    public Producto buscarPorId(String idProducto) throws SQLException {
        String sql = """
                SELECT p.id_producto, p.codigo_inv, p.id_proveedor, pr.nombre AS proveedor,
                       p.nombre, p.categoria, p.precio, p.stock, p.activo, p.fecha_creacion
                FROM productos p
                INNER JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
                WHERE p.id_producto = ? AND p.activo = 1
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, idProducto);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapearProducto(rs) : null;
            }
        }
    }

    public boolean crear(Producto producto) throws SQLException {
        String sql = """
                INSERT INTO productos
                (id_producto, codigo_inv, id_proveedor, nombre, categoria, precio, stock, activo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            setParametrosBase(ps, producto);
            return ps.executeUpdate() > 0;
        }
    }

    public boolean actualizar(Producto producto) throws SQLException {
        String sql = """
                UPDATE productos
                SET codigo_inv = ?, id_proveedor = ?, nombre = ?, categoria = ?, precio = ?, stock = ?, activo = ?
                WHERE id_producto = ?
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, producto.getCodigoInv());
            ps.setString(2, producto.getIdProveedor());
            ps.setString(3, producto.getNombre());
            ps.setString(4, producto.getCategoria());
            ps.setBigDecimal(5, producto.getPrecio());
            ps.setInt(6, producto.getStock());
            ps.setInt(7, producto.getActivo());
            ps.setString(8, producto.getIdProducto());
            return ps.executeUpdate() > 0;
        }
    }

    public boolean eliminar(String idProducto) throws SQLException {
        String sql = """
                UPDATE productos
                SET activo = 0
                WHERE id_producto = ? AND activo = 1
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, idProducto);
            return ps.executeUpdate() > 0;
        }
    }

    public List<Proveedor> listarProveedores() throws SQLException {
        List<Proveedor> proveedores = listarProveedoresAsociados();
        if (!proveedores.isEmpty()) {
            return proveedores;
        }
        return listarTodosLosProveedores();
    }

    private Producto mapearProducto(ResultSet rs) throws SQLException {
        return new Producto(
                rs.getString("id_producto"),
                rs.getString("codigo_inv"),
                rs.getString("id_proveedor"),
                rs.getString("proveedor"),
                rs.getString("nombre"),
                rs.getString("categoria"),
                rs.getBigDecimal("precio"),
                rs.getInt("stock"),
                rs.getInt("activo"),
                rs.getTimestamp("fecha_creacion")
        );
    }

    private void setParametrosBase(PreparedStatement ps, Producto producto) throws SQLException {
        ps.setString(1, producto.getIdProducto());
        ps.setString(2, producto.getCodigoInv());
        ps.setString(3, producto.getIdProveedor());
        ps.setString(4, producto.getNombre());
        ps.setString(5, producto.getCategoria());
        ps.setBigDecimal(6, producto.getPrecio() == null ? BigDecimal.ZERO : producto.getPrecio());
        ps.setInt(7, producto.getStock());
        ps.setInt(8, producto.getActivo());
    }

    private int siguienteSecuencia(String sql) throws SQLException {
        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            return rs.next() ? rs.getInt("maximo") : 0;
        }
    }

    private List<Proveedor> listarProveedoresAsociados() throws SQLException {
        String sql = """
                SELECT DISTINCT pr.id_proveedor, pr.nombre, pr.email
                FROM proveedores pr
                INNER JOIN productos p ON p.id_proveedor = pr.id_proveedor
                ORDER BY pr.nombre
                """;

        List<Proveedor> proveedores = new ArrayList<>();

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                proveedores.add(new Proveedor(
                        rs.getString("id_proveedor"),
                        rs.getString("nombre"),
                        rs.getString("email")));
            }
        }

        return proveedores;
    }

    private List<Proveedor> listarTodosLosProveedores() throws SQLException {
        String sql = "SELECT id_proveedor, nombre, email FROM proveedores ORDER BY nombre";
        List<Proveedor> proveedores = new ArrayList<>();

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                proveedores.add(new Proveedor(
                        rs.getString("id_proveedor"),
                        rs.getString("nombre"),
                        rs.getString("email")));
            }
        }

        return proveedores;
    }
}
