package com.techstore.web.model;

import java.math.BigDecimal;
import java.sql.Timestamp;

public class Producto {

    private String idProducto;
    private String codigoInv;
    private String idProveedor;
    private String proveedor;
    private String nombre;
    private String categoria;
    private BigDecimal precio;
    private int stock;
    private int activo;
    private Timestamp fechaCreacion;

    public Producto() {
    }

    public Producto(String idProducto, String codigoInv, String idProveedor, String proveedor, String nombre,
            String categoria, BigDecimal precio, int stock, int activo, Timestamp fechaCreacion) {
        this.idProducto = idProducto;
        this.codigoInv = codigoInv;
        this.idProveedor = idProveedor;
        this.proveedor = proveedor;
        this.nombre = nombre;
        this.categoria = categoria;
        this.precio = precio;
        this.stock = stock;
        this.activo = activo;
        this.fechaCreacion = fechaCreacion;
    }

    public String getIdProducto() {
        return idProducto;
    }

    public void setIdProducto(String idProducto) {
        this.idProducto = idProducto;
    }

    public String getCodigoInv() {
        return codigoInv;
    }

    public void setCodigoInv(String codigoInv) {
        this.codigoInv = codigoInv;
    }

    public String getIdProveedor() {
        return idProveedor;
    }

    public void setIdProveedor(String idProveedor) {
        this.idProveedor = idProveedor;
    }

    public String getProveedor() {
        return proveedor;
    }

    public void setProveedor(String proveedor) {
        this.proveedor = proveedor;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    public BigDecimal getPrecio() {
        return precio;
    }

    public void setPrecio(BigDecimal precio) {
        this.precio = precio;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    public int getActivo() {
        return activo;
    }

    public void setActivo(int activo) {
        this.activo = activo;
    }

    public Timestamp getFechaCreacion() {
        return fechaCreacion;
    }

    public void setFechaCreacion(Timestamp fechaCreacion) {
        this.fechaCreacion = fechaCreacion;
    }
}
