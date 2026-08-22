# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: Administrador, gestiona el sistema completo (productos, proveedores, usuarios, pedidos, carritos, tickets de soporte) via CRUD.
Confirmado por código (`AuthFilter`, `UsuarioDAO`), no reconfirmado explícitamente por el usuario en la entrevista: la app también sirve roles Empleado (procesa pedidos/carritos/tickets del día a día) y Cliente (navega catálogo, arma carrito, genera pedido) — marcado como inferencia a confirmar si el trabajo de diseño los toca directamente.

## Product Purpose

Sistema de gestión para TechStore Solutions S.A.S. — tienda de tecnología. Cubre inventario (productos, proveedores), gestión de usuarios/roles, ciclo de pedidos y carritos, y soporte (tickets). Es negocio real, no solo ejercicio académico (confirmado por el usuario), aunque nace en contexto de formación SENA con entregables de evidencia/sustentación.

## Positioning

[No definido — el usuario no confirmó un mecanismo o posicionamiento diferenciador frente a otras soluciones de gestión de tienda. No inventar.]

## Operating Context

- Stack Java EE clásico: JSP + Servlets + JDBC (Jakarta Servlet API), sin framework frontend moderno.
- Autenticación con `jbcrypt` (hash de contraseñas), sesiones vía `AuthFilter`.
- Base de datos: `techstore_sql_real`, MySQL en `127.0.0.1:3308` (instancia portátil, `mysql-connector-j`).
- Despliegue local: Tomcat vía `catalina.bat run`, build con `build.ps1` (Maven).
- Documentación y evidencias de sustentación viven en `05_documentacion/` y `06_evidencias/` del repo raíz — fuera del alcance de este módulo web pero parte del entregable general.

## Capabilities and Constraints

- Módulos confirmados por código: Productos, Proveedores, Usuarios, Pedidos, Carritos, Tickets de soporte (`*Servlet.java` + `*DAO.java` por módulo).
- Restricción innegociable (confirmada por usuario): mantener el stack JSP/Servlets/JDBC — no migrar a un framework moderno (React, Spring, etc.). Es requisito del curso usar Java EE clásico.
- No se confirmaron restricciones sobre el esquema de base de datos ni sobre preservar evidencias/capturas existentes — el usuario no marcó esas opciones explícitamente; tratar como abiertas, no como bloqueo.

## Evidence on Hand

- Código funcional real en `01_web/TechStoreWebServlets/` (JSPs en `src/main/webapp/`, servlets, DAOs, filtro de auth).
- Script SQL principal en `03_base_datos/sql/`.
- Sin evidencia de un sistema de diseño o guía visual documentada aún (no hay DESIGN.md, `hasVisualImplementation` reportó false en el escaneo automático pese a existir CSS/JSP reales — revisar con `/impeccable document`).

## Product Principles

- Mantener consistencia con el stack Java EE clásico ya construido; el rediseño trabaja sobre JSP/Servlets, no lo reemplaza.
- Priorizar flujos CRUD claros para el administrador como usuario primario confirmado.
- No inventar posicionamiento, testimonios ni métricas de negocio no confirmadas por el usuario.
