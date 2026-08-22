package com.techstore.web.model;

import java.sql.Timestamp;

public class PedidoEvento {

    private Long idEvento;
    private String idPedido;
    private Timestamp fechaEvento;
    private String descripcion;

    public PedidoEvento() {
    }

    public PedidoEvento(Long idEvento, String idPedido, Timestamp fechaEvento, String descripcion) {
        this.idEvento = idEvento;
        this.idPedido = idPedido;
        this.fechaEvento = fechaEvento;
        this.descripcion = descripcion;
    }

    public Long getIdEvento() {
        return idEvento;
    }

    public void setIdEvento(Long idEvento) {
        this.idEvento = idEvento;
    }

    public String getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(String idPedido) {
        this.idPedido = idPedido;
    }

    public Timestamp getFechaEvento() {
        return fechaEvento;
    }

    public void setFechaEvento(Timestamp fechaEvento) {
        this.fechaEvento = fechaEvento;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
