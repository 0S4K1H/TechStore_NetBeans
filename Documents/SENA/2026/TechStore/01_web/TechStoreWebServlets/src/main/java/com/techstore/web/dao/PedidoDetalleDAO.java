package com.techstore.web.dao;

import com.techstore.web.model.PedidoDetalle;
import com.techstore.web.util.Conexion;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

public class PedidoDetalleDAO {

    public void crear(Connection conexion, PedidoDetalle detalle) throws SQLException {
        String sql = """
                INSERT INTO pedido_detalle (id_pedido, id_producto, nombre_producto, categoria, cantidad, precio_unitario, subtotal)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;

        try (PreparedStatement ps = conexion.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, detalle.getIdPedido());
            ps.setString(2, detalle.getIdProducto());
            ps.setString(3, detalle.getNombreProducto());
            ps.setString(4, detalle.getCategoria());
            ps.setInt(5, detalle.getCantidad());
            ps.setBigDecimal(6, detalle.getPrecioUnitario());
            ps.setBigDecimal(7, detalle.getSubtotal());
            ps.executeUpdate();
        }
    }

    public List<PedidoDetalle> listarPorPedido(String idPedido) throws SQLException {
        String sql = """
                SELECT id_detalle, id_pedido, id_producto, nombre_producto, categoria, cantidad, precio_unitario, subtotal
                FROM pedido_detalle
                WHERE id_pedido = ?
                ORDER BY id_detalle
                """;

        List<PedidoDetalle> items = new ArrayList<>();
        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, idPedido);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    items.add(new PedidoDetalle(
                            rs.getLong("id_detalle"),
                            rs.getString("id_pedido"),
                            rs.getString("id_producto"),
                            rs.getString("nombre_producto"),
                            rs.getString("categoria"),
                            rs.getInt("cantidad"),
                            rs.getBigDecimal("precio_unitario"),
                            rs.getBigDecimal("subtotal")));
                }
            }
        }
        return items;
    }
}
