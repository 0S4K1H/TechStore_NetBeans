package com.techstore.web.model;

import java.sql.Timestamp;

public class TicketSoporte {

    private String idTicket;
    private String idUsuarioCliente;
    private String cliente;
    private String asunto;
    private String mensaje;
    private String estado;
    private Timestamp fechaCreacion;
    private Timestamp fechaCierre;

    public TicketSoporte() {
    }

    public TicketSoporte(String idTicket, String idUsuarioCliente, String cliente, String asunto, String mensaje,
            String estado, Timestamp fechaCreacion, Timestamp fechaCierre) {
        this.idTicket = idTicket;
        this.idUsuarioCliente = idUsuarioCliente;
        this.cliente = cliente;
        this.asunto = asunto;
        this.mensaje = mensaje;
        this.estado = estado;
        this.fechaCreacion = fechaCreacion;
        this.fechaCierre = fechaCierre;
    }

    public String getIdTicket() {
        return idTicket;
    }

    public void setIdTicket(String idTicket) {
        this.idTicket = idTicket;
    }

    public String getIdUsuarioCliente() {
        return idUsuarioCliente;
    }

    public void setIdUsuarioCliente(String idUsuarioCliente) {
        this.idUsuarioCliente = idUsuarioCliente;
    }

    public String getCliente() {
        return cliente;
    }

    public void setCliente(String cliente) {
        this.cliente = cliente;
    }

    public String getAsunto() {
        return asunto;
    }

    public void setAsunto(String asunto) {
        this.asunto = asunto;
    }

    public String getMensaje() {
        return mensaje;
    }

    public void setMensaje(String mensaje) {
        this.mensaje = mensaje;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public Timestamp getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Timestamp fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }

    public Timestamp getFechaCierre() {
        return fechaCierre;
    }

    public void setFechaCierre(Timestamp fechaCierre) {
        this.fechaCierre = fechaCierre;
    }
}
