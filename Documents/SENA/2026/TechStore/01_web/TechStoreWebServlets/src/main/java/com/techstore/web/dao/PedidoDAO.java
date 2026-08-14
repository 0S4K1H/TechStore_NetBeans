package com.techstore.web.dao;

import com.techstore.web.model.Pedido;
import com.techstore.web.util.Conexion;
import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class PedidoDAO {

    public String siguienteIdPedido() throws SQLException {
        int siguiente = siguienteSecuencia("""
                SELECT COALESCE(MAX(CAST(SUBSTRING(UPPER(id_pedido), 4) AS UNSIGNED)), 0) AS maximo
                FROM pedidos
                WHERE UPPER(id_pedido) REGEXP '^PED[0-9]+$'
                """);
        return String.format("PED%03d", siguiente + 1);
    }

    public List<Pedido> listar(String filtro) throws SQLException {
        StringBuilder sql = new StringBuilder("""
                SELECT p.id_pedido, p.id_usuario_cliente, u.nombre AS cliente, p.id_usuario_empleado,
                       ue.nombre AS empleado, p.empleado_asignado, p.nombre_cliente, p.email_cliente, p.telefono,
                       p.direccion, p.ciudad, p.fecha_pedido, p.fecha_estimada, p.transportadora,
                       p.subtotal, p.costo_envio, p.descuento, p.total, p.estado, p.prioridad,
                       p.metodo_pago, p.nota, p.fecha_creacion
                FROM pedidos p
                LEFT JOIN usuarios u ON u.id_usuario = p.id_usuario_cliente
                LEFT JOIN usuarios ue ON ue.id_usuario = p.id_usuario_empleado
                """);

        boolean tieneFiltro = filtro != null && !filtro.isBlank();
        if (tieneFiltro) {
            sql.append("""
                    WHERE LOWER(p.id_pedido) LIKE ?
                       OR LOWER(p.nombre_cliente) LIKE ?
                       OR LOWER(p.email_cliente) LIKE ?
                       OR LOWER(p.estado) LIKE ?
                       OR LOWER(p.prioridad) LIKE ?
                       OR LOWER(p.transportadora) LIKE ?
                    """);
        }
        sql.append(" ORDER BY p.fecha_creacion DESC, p.id_pedido");

        List<Pedido> pedidos = new ArrayList<>();

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
                    pedidos.add(mapearPedido(rs));
                }
            }
        }

        return pedidos;
    }

    public Pedido buscarPorId(String idPedido) throws SQLException {
        String sql = """
                SELECT p.id_pedido, p.id_usuario_cliente, u.nombre AS cliente, p.id_usuario_empleado,
                       ue.nombre AS empleado, p.empleado_asignado, p.nombre_cliente, p.email_cliente, p.telefono,
                       p.direccion, p.ciudad, p.fecha_pedido, p.fecha_estimada, p.transportadora,
                       p.subtotal, p.costo_envio, p.descuento, p.total, p.estado, p.prioridad,
                       p.metodo_pago, p.nota, p.fecha_creacion
                FROM pedidos p
                LEFT JOIN usuarios u ON u.id_usuario = p.id_usuario_cliente
                LEFT JOIN usuarios ue ON ue.id_usuario = p.id_usuario_empleado
                WHERE p.id_pedido = ?
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            ps.setString(1, idPedido);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next() ? mapearPedido(rs) : null;
            }
        }
    }

    public boolean crear(Pedido pedido) throws SQLException {
        String sql = """
                INSERT INTO pedidos (
                    id_pedido, id_usuario_cliente, id_usuario_empleado, empleado_asignado,
                    nombre_cliente, email_cliente, telefono, direccion, ciudad,
                    fecha_pedido, fecha_estimada, transportadora,
                    subtotal, costo_envio, descuento, total,
                    estado, prioridad, metodo_pago, nota
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            cargarParametros(ps, pedido, false);
            return ps.executeUpdate() > 0;
        }
    }

    public boolean actualizar(Pedido pedido) throws SQLException {
        String sql = """
                UPDATE pedidos
                SET id_usuario_cliente = ?, id_usuario_empleado = ?, empleado_asignado = ?,
                    nombre_cliente = ?, email_cliente = ?, telefono = ?, direccion = ?, ciudad = ?,
                    fecha_pedido = ?, fecha_estimada = ?, transportadora = ?,
                    subtotal = ?, costo_envio = ?, descuento = ?, total = ?,
                    estado = ?, prioridad = ?, metodo_pago = ?, nota = ?
                WHERE id_pedido = ?
                """;

        try (Connection conexion = Conexion.getConnection();
                PreparedStatement ps = conexion.prepareStatement(sql)) {
            cargarParametros(ps, pedido, true);
            return ps.executeUpdate() > 0;
        }
    }

    public boolean eliminar(String idPedido) throws SQLException {
        String sqlActualizar = """
                UPDATE pedidos
                SET estado = 'cancelado'
                WHERE id_pedido = ? AND estado <> 'cancelado'
                """;
        String sqlTimeline = "INSERT INTO pedido_timeline (id_pedido, fecha_evento, descripcion) VALUES (?, CURRENT_TIMESTAMP, ?)";

        try (Connection conexion = Conexion.getConnection()) {
            conexion.setAutoCommit(false);

            try (PreparedStatement psActualizar = conexion.prepareStatement(sqlActualizar)) {
                psActualizar.setString(1, idPedido);
                int filas = psActualizar.executeUpdate();

                if (filas == 0) {
                    conexion.rollback();
                    return false;
                }

                try (PreparedStatement psTimeline = conexion.prepareStatement(sqlTimeline)) {
                    psTimeline.setString(1, idPedido);
                    psTimeline.setString(2, "Pedido cancelado manualmente desde el sistema.");
                    psTimeline.executeUpdate();
                }

                conexion.commit();
                return true;
            } catch (SQLException ex) {
                conexion.rollback();
                throw ex;
            } finally {
                conexion.setAutoCommit(true);
            }
        }
    }

    private void cargarParametros(PreparedStatement ps, Pedido pedido, boolean actualizacion) throws SQLException {
        int indice = 1;
        if (!actualizacion) {
            ps.setString(indice++, pedido.getIdPedido());
        }
        ps.setString(indice++, pedido.getIdUsuarioCliente());
        if (pedido.getIdUsuarioEmpleado() == null || pedido.getIdUsuarioEmpleado().isBlank()) {
            ps.setNull(indice++, java.sql.Types.VARCHAR);
        } else {
            ps.setString(indice++, pedido.getIdUsuarioEmpleado());
        }
        ps.setString(indice++, pedido.getEmpleadoAsignado());
        ps.setString(indice++, pedido.getNombreCliente());
        ps.setString(indice++, pedido.getEmailCliente());
        ps.setString(indice++, pedido.getTelefono());
        ps.setString(indice++, pedido.getDireccion());
        ps.setString(indice++, pedido.getCiudad());
        ps.setDate(indice++, pedido.getFechaPedido());
        ps.setDate(indice++, pedido.getFechaEstimada());
        ps.setString(indice++, pedido.getTransportadora());
        ps.setBigDecimal(indice++, pedido.getSubtotal());
        ps.setBigDecimal(indice++, pedido.getCostoEnvio());
        ps.setBigDecimal(indice++, pedido.getDescuento());
        ps.setBigDecimal(indice++, pedido.getTotal());
        ps.setString(indice++, pedido.getEstado());
        ps.setString(indice++, pedido.getPrioridad());
        ps.setString(indice++, pedido.getMetodoPago());
        ps.setString(indice++, pedido.getNota());
        if (actualizacion) {
            ps.setString(indice, pedido.getIdPedido());
        }
    }

    private Pedido mapearPedido(ResultSet rs) throws SQLException {
        return new Pedido(
                rs.getString("id_pedido"),
                rs.getString("id_usuario_cliente"),
                rs.getString("cliente"),
                rs.getString("id_usuario_empleado"),
                rs.getString("empleado"),
                rs.getString("empleado_asignado"),
                rs.getString("nombre_cliente"),
                rs.getString("email_cliente"),
                rs.getString("telefono"),
                rs.getString("direccion"),
                rs.getString("ciudad"),
                rs.getDate("fecha_pedido"),
                rs.getDate("fecha_estimada"),
                rs.getString("transportadora"),
                rs.getBigDecimal("subtotal"),
                rs.getBigDecimal("costo_envio"),
                rs.getBigDecimal("descuento"),
                rs.getBigDecimal("total"),
                rs.getString("estado"),
                rs.getString("prioridad"),
                rs.getString("metodo_pago"),
                rs.getString("nota"),
                rs.getTimestamp("fecha_creacion")
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
