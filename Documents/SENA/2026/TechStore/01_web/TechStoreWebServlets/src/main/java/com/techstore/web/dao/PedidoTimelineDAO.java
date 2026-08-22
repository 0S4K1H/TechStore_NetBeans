package com.techstore.web.dao;

import com.techstore.web.model.PedidoEvento;
import com.techstore.web.util.Conexion;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class PedidoTimelineDAO {

    public void insertar(Connection conexion, String idPedido, String descripcion) throws SQLException {
        String sql = "INSERT INTO pedido_timeline (id_pedido, fecha_evento, descripcion) VALUES (?, CURRENT_TIMESTAMP, ?)";
        try (PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, idPedido);
            ps.setString(2, descripcion);
            ps.executeUpdate();
        }
    }

    public void insertar(String idPedido, String descripcion) throws SQLException {
        try (Connection conexion = Conexion.getConnection()) {
            insertar(conexion, idPedido, descripcion);
        }
    }

    public List<PedidoEvento> listarPorPedido(String idPedido) throws SQLException {
        String sql = """
                SELECT id_evento, id_pedido, fecha_evento, descripcion
                FROM pedido_timeline
                WHERE id_pedido = ?
                ORDER BY fecha_evento ASC, id_evento ASC
                """;

        List<PedidoEvento> eventos = new ArrayList<>();
        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, idPedido);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    eventos.add(new PedidoEvento(
                            rs.getLong("id_evento"),
                            rs.getString("id_pedido"),
                            rs.getTimestamp("fecha_evento"),
                            rs.getString("descripcion")));
                }
            }
        }
        return eventos;
    }
}
