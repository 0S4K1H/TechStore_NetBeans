package com.techstore.web.dao;

import com.techstore.web.model.CarritoDetalle;
import com.techstore.web.util.Conexion;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class CarritoDetalleDAO {

    private static final String SELECT_BASE = """
            SELECT cd.id_carrito, cd.id_producto, p.nombre AS nombre_producto, p.categoria, cd.cantidad, cd.precio_unitario,
                   (cd.cantidad * cd.precio_unitario) AS subtotal
            FROM carrito_detalle cd
            INNER JOIN productos p ON p.id_producto = cd.id_producto
            WHERE cd.id_carrito = ?
            ORDER BY p.nombre
            """;

    public List<CarritoDetalle> listarPorCarrito(Long idCarrito) throws SQLException {
        try (Connection conexion = Conexion.getConnection()) {
            return listarPorCarrito(conexion, idCarrito);
        }
    }

    public List<CarritoDetalle> listarPorCarrito(Connection conexion, Long idCarrito) throws SQLException {
        List<CarritoDetalle> items = new ArrayList<>();
        try (PreparedStatement ps = conexion.prepareStatement(SELECT_BASE)) {
            ps.setLong(1, idCarrito);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    items.add(mapear(rs));
                }
            }
        }
        return items;
    }

    /** Agrega el producto al carrito, sumando la cantidad si ya existía. */
    public void agregar(Long idCarrito, String idProducto, int cantidad, BigDecimal precioUnitario) throws SQLException {
        String sql = """
                INSERT INTO carrito_detalle (id_carrito, id_producto, cantidad, precio_unitario)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE cantidad = cantidad + VALUES(cantidad), precio_unitario = VALUES(precio_unitario)
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setLong(1, idCarrito);
            ps.setString(2, idProducto);
            ps.setInt(3, cantidad);
            ps.setBigDecimal(4, precioUnitario);
            ps.executeUpdate();
        }
    }

    public boolean actualizarCantidad(Long idCarrito, String idProducto, int cantidad) throws SQLException {
        String sql = "UPDATE carrito_detalle SET cantidad = ? WHERE id_carrito = ? AND id_producto = ?";

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setInt(1, cantidad);
            ps.setLong(2, idCarrito);
            ps.setString(3, idProducto);
            return ps.executeUpdate() > 0;
        }
    }

    public boolean eliminar(Long idCarrito, String idProducto) throws SQLException {
        String sql = "DELETE FROM carrito_detalle WHERE id_carrito = ? AND id_producto = ?";

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setLong(1, idCarrito);
            ps.setString(2, idProducto);
            return ps.executeUpdate() > 0;
        }
    }

    private CarritoDetalle mapear(ResultSet rs) throws SQLException {
        CarritoDetalle detalle = new CarritoDetalle(
                rs.getLong("id_carrito"),
                rs.getString("id_producto"),
                rs.getString("nombre_producto"),
                rs.getInt("cantidad"),
                rs.getBigDecimal("precio_unitario"),
                rs.getBigDecimal("subtotal"));
        detalle.setCategoria(rs.getString("categoria"));
        return detalle;
    }
}
