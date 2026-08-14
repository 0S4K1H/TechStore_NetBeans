package com.techstore.web.model;

public class Proveedor {

    private String idProveedor;
    private String nombre;
    private String email;

    public Proveedor() {
    }

    public Proveedor(String idProveedor, String nombre) {
        this(idProveedor, nombre, null);
    }

    public Proveedor(String idProveedor, String nombre, String email) {
        this.idProveedor = idProveedor;
        this.nombre = nombre;
        this.email = email;
    }

    public String getIdProveedor() {
        return idProveedor;
    }

    public void setIdProveedor(String idProveedor) {
        this.idProveedor = idProveedor;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
