# TechStore Web Servlets

Módulo web del proyecto **TechStore Solutions S.A.S.** desarrollado para la evidencia **GA7-220501096-AA2-EV02**.

## Alcance

- Formularios HTML dentro de JSP.
- Servlets con métodos `doGet` y `doPost`.
- Persistencia JDBC sobre MySQL.
- Módulos funcionales de productos, proveedores, usuarios, tickets, pedidos y carritos.

## Base de datos

- Servidor: `127.0.0.1`
- Puerto: `3308`
- Base de datos: `techstore_sql_real`
- Usuario: `root`
- Contraseña: `TechStore3308`

## Estructura principal

- `com.techstore.web.util.Conexion`
- `com.techstore.web.model.Producto`
- `com.techstore.web.model.Proveedor`
- `com.techstore.web.model.Pedido`
- `com.techstore.web.model.Carrito`
- `com.techstore.web.dao.ProductoDAO`
- `com.techstore.web.dao.ProveedorDAO`
- `com.techstore.web.dao.UsuarioDAO`
- `com.techstore.web.dao.PedidoDAO`
- `com.techstore.web.dao.CarritoDAO`
- `com.techstore.web.servlet.ProductoServlet`
- `com.techstore.web.servlet.ProveedorServlet`
- `com.techstore.web.servlet.UsuarioServlet`
- `com.techstore.web.servlet.PedidoServlet`
- `com.techstore.web.servlet.CarritoServlet`

## Vistas JSP

- `index.jsp`
- `WEB-INF/jsp/productos.jsp`
- `WEB-INF/jsp/producto-form.jsp`
- `WEB-INF/jsp/proveedores.jsp`
- `WEB-INF/jsp/proveedor-form.jsp`
- `WEB-INF/jsp/usuarios.jsp`
- `WEB-INF/jsp/usuario-form.jsp`
- `WEB-INF/jsp/pedidos.jsp`
- `WEB-INF/jsp/pedido-form.jsp`
- `WEB-INF/jsp/carritos.jsp`
- `WEB-INF/jsp/carrito-form.jsp`

## Rutas

- `/TechStoreWeb/`
- `/TechStoreWeb/productos?accion=listar`
- `/TechStoreWeb/productos?accion=nuevo`
- `/TechStoreWeb/productos?accion=editar&id=p1`
- `/TechStoreWeb/proveedores?accion=listar`
- `/TechStoreWeb/usuarios?accion=listar`
- `/TechStoreWeb/pedidos?accion=listar`
- `/TechStoreWeb/pedidos?accion=nuevo`
- `/TechStoreWeb/carritos?accion=listar`
- `/TechStoreWeb/carritos?accion=nuevo`

## Ejecución local

1. Descomprime Tomcat en `C:\Users\mateo\Documents\SENA\2026\TechStore\07_instaladores\apache-tomcat-10.1.57`.
2. Asegura que MySQL TechStore esté activo en `3308`.
3. Ejecuta `run-local.ps1`.
4. Abre `http://localhost:8080/TechStoreWeb/`.
