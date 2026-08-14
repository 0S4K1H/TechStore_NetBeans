package com.techstore.web.model;

import java.sql.Timestamp;

public class Usuario {

    private String idUsuario;
    private String username;
    private String passwordDemo;
    private String rol;
    private String nombre;
    private String email;
    private String ciudad;
    private int activo;
    private Timestamp fechaRegistro;

    public Usuario() {
    }

    public Usuario(String idUsuario, String username, String passwordDemo, String rol, String nombre, String email,
            String ciudad, int activo, Timestamp fechaRegistro) {
        this.idUsuario = idUsuario;
        this.username = username;
        this.passwordDemo = passwordDemo;
        this.rol = rol;
        this.nombre = nombre;
        this.email = email;
        this.ciudad = ciudad;
        this.activo = activo;
        this.fechaRegistro = fechaRegistro;
    }

    public String getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(String idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordDemo() {
        return passwordDemo;
    }

    public void setPasswordDemo(String passwordDemo) {
        this.passwordDemo = passwordDemo;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
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

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public int getActivo() {
        return activo;
    }

    public void setActivo(int activo) {
        this.activo = activo;
    }

    public Timestamp getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(Timestamp fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }
}
