package com.techstore.web.dao;

import com.techstore.web.model.TicketSoporte;
import com.techstore.web.util.Conexion;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class TicketSoporteDAO {

    public String siguienteIdTicket() throws SQLException {
        int siguiente = siguienteSecuencia("""
                SELECT COALESCE(MAX(CAST(SUBSTRING(UPPER(id_ticket), 4) AS UNSIGNED)), 0) AS maximo
                FROM tickets_soporte
                WHERE UPPER(id_ticket) REGEXP '^TKT[0-9]+$'
                """);
        return String.format("TKT%03d", siguiente + 1);
    }

    public List<TicketSoporte> listar(String filtro) throws SQLException {
        StringBuilder sql = new StringBuilder("""
                SELECT t.id_ticket, t.id_usuario_cliente, u.nombre AS cliente, t.asunto, t.mensaje, t.estado,
                       t.fecha_creacion, t.fecha_cierre
                FROM tickets_soporte t
                INNER JOIN usuarios u ON u.id_usuario = t.id_usuario_cliente
                """);

        boolean tieneFiltro = filtro != null && !filtro.isBlank();
        if (tieneFiltro) {
            sql.append("""
                    WHERE LOWER(t.id_ticket) LIKE ?
                       OR LOWER(t.id_usuario_cliente) LIKE ?
                       OR LOWER(u.nombre) LIKE ?
                       OR LOWER(t.asunto) LIKE ?
                       OR LOWER(t.estado) LIKE ?
                    """);
        }
        sql.append(" ORDER BY t.fecha_creacion DESC");

        List<TicketSoporte> tickets = new ArrayList<>();

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql.toString())) {

            if (tieneFiltro) {
                String valor = "%" + filtro.trim().toLowerCase() + "%";
                ps.setString(1, valor);
                ps.setString(2, valor);
                ps.setString(3, valor);
                ps.setString(4, valor);
                ps.setString(5, valor);
            }

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    tickets.add(mapearTicket(rs));
                }
            }
        }

        return tickets;
    }

    public TicketSoporte buscarPorId(String idTicket) throws SQLException {
        String sql = """
                SELECT t.id_ticket, t.id_usuario_cliente, u.nombre AS cliente, t.asunto, t.mensaje, t.estado,
                       t.fecha_creacion, t.fecha_cierre
                FROM tickets_soporte t
                INNER JOIN usuarios u ON u.id_usuario = t.id_usuario_cliente
                WHERE t.id_ticket = ?
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, idTicket);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapearTicket(rs) : null;
            }
        }
    }

    public boolean crear(TicketSoporte ticket) throws SQLException {
        String sql = """
                INSERT INTO tickets_soporte (id_ticket, id_usuario_cliente, asunto, mensaje, estado, fecha_creacion, fecha_cierre)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, ticket.getIdTicket());
            ps.setString(2, ticket.getIdUsuarioCliente());
            ps.setString(3, ticket.getAsunto());
            ps.setString(4, ticket.getMensaje());
            ps.setString(5, ticket.getEstado());
            ps.setTimestamp(6, ticket.getFechaCreacion());
            if (ticket.getFechaCierre() == null) {
                ps.setNull(7, java.sql.Types.TIMESTAMP);
            } else {
                ps.setTimestamp(7, ticket.getFechaCierre());
            }
            return ps.executeUpdate() > 0;
        }
    }

    public boolean actualizar(TicketSoporte ticket) throws SQLException {
        String sql = """
                UPDATE tickets_soporte
                SET id_usuario_cliente = ?, asunto = ?, mensaje = ?, estado = ?, fecha_creacion = ?, fecha_cierre = ?
                WHERE id_ticket = ?
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, ticket.getIdUsuarioCliente());
            ps.setString(2, ticket.getAsunto());
            ps.setString(3, ticket.getMensaje());
            ps.setString(4, ticket.getEstado());
            ps.setTimestamp(5, ticket.getFechaCreacion());
            if (ticket.getFechaCierre() == null) {
                ps.setNull(6, java.sql.Types.TIMESTAMP);
            } else {
                ps.setTimestamp(6, ticket.getFechaCierre());
            }
            ps.setString(7, ticket.getIdTicket());
            return ps.executeUpdate() > 0;
        }
    }

    public boolean eliminar(String idTicket) throws SQLException {
        String sql = """
                UPDATE tickets_soporte
                SET estado = 'cerrado',
                    fecha_cierre = COALESCE(fecha_cierre, CURRENT_TIMESTAMP)
                WHERE id_ticket = ? AND estado <> 'cerrado'
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, idTicket);
            return ps.executeUpdate() > 0;
        }
    }

    private TicketSoporte mapearTicket(ResultSet rs) throws SQLException {
        return new TicketSoporte(
                rs.getString("id_ticket"),
                rs.getString("id_usuario_cliente"),
                rs.getString("cliente"),
                rs.getString("asunto"),
                rs.getString("mensaje"),
                rs.getString("estado"),
                rs.getTimestamp("fecha_creacion"),
                rs.getTimestamp("fecha_cierre")
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
