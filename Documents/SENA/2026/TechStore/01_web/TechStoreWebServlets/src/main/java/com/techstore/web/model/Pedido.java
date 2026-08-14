package com.techstore.web.model;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;

public class Pedido {

    private String idPedido;
    private String idUsuarioCliente;
    private String cliente;
    private String idUsuarioEmpleado;
    private String empleado;
    private String empleadoAsignado;
    private String nombreCliente;
    private String emailCliente;
    private String telefono;
    private String direccion;
    private String ciudad;
    private Date fechaPedido;
    private Date fechaEstimada;
    private String transportadora;
    private BigDecimal subtotal;
    private BigDecimal costoEnvio;
    private BigDecimal descuento;
    private BigDecimal total;
    private String estado;
    private String prioridad;
    private String metodoPago;
    private String nota;
    private Timestamp fechaCreacion;

    public Pedido() {
    }

    public Pedido(String idPedido, String idUsuarioCliente, String cliente, String idUsuarioEmpleado, String empleado,
            String empleadoAsignado, String nombreCliente, String emailCliente, String telefono, String direccion,
            String ciudad, Date fechaPedido, Date fechaEstimada, String transportadora, BigDecimal subtotal,
            BigDecimal costoEnvio, BigDecimal descuento, BigDecimal total, String estado, String prioridad,
            String metodoPago, String nota, Timestamp fechaCreacion) {
        this.idPedido = idPedido;
        this.idUsuarioCliente = idUsuarioCliente;
        this.cliente = cliente;
        this.idUsuarioEmpleado = idUsuarioEmpleado;
        this.empleado = empleado;
        this.empleadoAsignado = empleadoAsignado;
        this.nombreCliente = nombreCliente;
        this.emailCliente = emailCliente;
        this.telefono = telefono;
        this.direccion = direccion;
        this.ciudad = ciudad;
        this.fechaPedido = fechaPedido;
        this.fechaEstimada = fechaEstimada;
        this.transportadora = transportadora;
        this.subtotal = subtotal;
        this.costoEnvio = costoEnvio;
        this.descuento = descuento;
        this.total = total;
        this.estado = estado;
        this.prioridad = prioridad;
        this.metodoPago = metodoPago;
        this.nota = nota;
        this.fechaCreacion = fechaCreacion;
    }

    public String getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(String idPedido) {
        this.idPedido = idPedido;
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

    public String getIdUsuarioEmpleado() {
        return idUsuarioEmpleado;
    }

    public void setIdUsuarioEmpleado(String idUsuarioEmpleado) {
        this.idUsuarioEmpleado = idUsuarioEmpleado;
    }

    public String getEmpleado() {
        return empleado;
    }

    public void setEmpleado(String empleado) {
        this.empleado = empleado;
    }

    public String getEmpleadoAsignado() {
        return empleadoAsignado;
    }

    public void setEmpleadoAsignado(String empleadoAsignado) {
        this.empleadoAsignado = empleadoAsignado;
    }

    public String getNombreCliente() {
        return nombreCliente;
    }

    public void setNombreCliente(String nombreCliente) {
        this.nombreCliente = nombreCliente;
    }

    public String getEmailCliente() {
        return emailCliente;
    }

    public void setEmailCliente(String emailCliente) {
        this.emailCliente = emailCliente;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getDireccion() {
        return direccion;
    }

    public void setDireccion(String direccion) {
        this.direccion = direccion;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public Date getFechaPedido() {
        return fechaPedido;
    }

    public void setFechaPedido(Date fechaPedido) {
        this.fechaPedido = fechaPedido;
    }

    public Date getFechaEstimada() {
        return fechaEstimada;
    }

    public void setFechaEstimada(Date fechaEstimada) {
        this.fechaEstimada = fechaEstimada;
    }

    public String getTransportadora() {
        return transportadora;
    }

    public void setTransportadora(String transportadora) {
        this.transportadora = transportadora;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getCostoEnvio() {
        return costoEnvio;
    }

    public void setCostoEnvio(BigDecimal costoEnvio) {
        this.costoEnvio = costoEnvio;
    }

    public BigDecimal getDescuento() {
        return descuento;
    }

    public void setDescuento(BigDecimal descuento) {
        this.descuento = descuento;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getPrioridad() {
        return prioridad;
    }

    public void setPrioridad(String prioridad) {
        this.prioridad = prioridad;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getNota() {
        return nota;
    }

    public void setNota(String nota) {
        this.nota = nota;
    }

    public Timestamp getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Timestamp fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
