# Endpoints API TechStore

Base URL local:

```text
http://localhost:8080/TechStoreWeb/api
```

## Autenticacion

| Metodo | Endpoint | Descripcion | Acceso |
|---|---|---|---|
| POST | `/auth/login` | Inicia sesion con usuario/correo y contrasena. | Publico |
| POST | `/auth/register` | Registra una cuenta de cliente. | Publico |
| GET | `/auth/session` | Consulta la sesion activa. | Publico; devuelve `null` si no hay sesion |
| POST | `/auth/logout` | Cierra la sesion activa. | Usuario autenticado |

Ejemplo login:

```json
{
  "identifier": "admin",
  "password": "12345"
}
```

## Usuarios

| Metodo | Endpoint | Descripcion | Acceso |
|---|---|---|---|
| GET | `/usuarios` | Lista usuarios activos. Acepta busqueda con `?q=`. | Administrador, empleado |
| GET | `/usuarios/{id}` | Consulta un usuario por ID. | Administrador, empleado |
| POST | `/usuarios` | Crea un usuario. El ID se genera automaticamente como `USR###`. | Administrador |
| PUT | `/usuarios/{id}` | Actualiza un usuario existente. | Administrador |
| DELETE | `/usuarios/{id}` | Inactiva un usuario. | Administrador |

Ejemplo crear usuario:

```json
{
  "username": "ev04_user_001",
  "passwordDemo": "12345",
  "rol": "cliente",
  "nombre": "Usuario Evidencia EV04",
  "email": "ev04_user_001@techstore.demo",
  "ciudad": "Armenia",
  "activo": 1
}
```

## Proveedores

| Metodo | Endpoint | Descripcion | Acceso |
|---|---|---|---|
| GET | `/proveedores` | Lista proveedores. Acepta busqueda con `?q=`. | Administrador |
| GET | `/proveedores/{id}` | Consulta un proveedor por ID. | Administrador |
| POST | `/proveedores` | Crea proveedor. El ID se genera automaticamente. | Administrador |
| PUT | `/proveedores/{id}` | Actualiza proveedor. | Administrador |
| DELETE | `/proveedores/{id}` | Elimina proveedor si no tiene productos asociados. | Administrador |

Ejemplo crear proveedor:

```json
{
  "nombre": "Proveedor Evidencia EV04",
  "email": "proveedor.ev04@techstore.demo"
}
```

## Productos

| Metodo | Endpoint | Descripcion | Acceso |
|---|---|---|---|
| GET | `/productos` | Lista productos activos. Acepta busqueda con `?q=`. | Publico |
| GET | `/productos/{id}` | Consulta un producto por ID. | Publico |
| POST | `/productos` | Crea producto. El ID y codigo de inventario se generan automaticamente. | Administrador, empleado |
| PUT | `/productos/{id}` | Actualiza producto. | Administrador, empleado |
| DELETE | `/productos/{id}` | Inactiva producto. | Administrador, empleado |

Ejemplo crear producto:

```json
{
  "idProveedor": "PRV001",
  "nombre": "Producto Evidencia EV04",
  "categoria": "accesorio",
  "precio": 150000,
  "stock": 10,
  "activo": 1
}
```

## Pedidos

| Metodo | Endpoint | Descripcion | Acceso |
|---|---|---|---|
| GET | `/pedidos` | Lista pedidos. Clientes ven solo sus pedidos. | Autenticado |
| GET | `/pedidos/{id}` | Consulta pedido por ID. | Autenticado |
| GET | `/pedidos/{id}/items` | Consulta detalle de productos del pedido. | Autenticado |
| GET | `/pedidos/{id}/timeline` | Consulta trazabilidad del pedido. | Autenticado |
| POST | `/pedidos` | Crea pedido. | Autenticado |
| PUT | `/pedidos/{id}` | Actualiza pedido. | Administrador, empleado |
| DELETE | `/pedidos/{id}` | Cancela pedido. | Administrador, empleado |

## Carritos

| Metodo | Endpoint | Descripcion | Acceso |
|---|---|---|---|
| GET | `/carritos` | Lista carritos. Clientes ven solo sus carritos. | Autenticado |
| GET | `/carritos/{id}` | Consulta carrito por ID. | Autenticado |
| GET | `/carritos/{id}/items` | Consulta items del carrito. | Autenticado |
| POST | `/carritos` | Crea carrito. | Autenticado |
| POST | `/carritos/{id}/items` | Agrega producto al carrito. | Autenticado |
| PUT | `/carritos/{id}/items/{idProducto}` | Actualiza cantidad de un producto. | Autenticado |
| DELETE | `/carritos/{id}/items/{idProducto}` | Elimina un producto del carrito. | Autenticado |
| POST | `/carritos/{id}/checkout` | Convierte carrito en pedido. | Autenticado |
| DELETE | `/carritos/{id}` | Cierra o elimina carrito. | Autenticado |

## Tickets

| Metodo | Endpoint | Descripcion | Acceso |
|---|---|---|---|
| GET | `/tickets` | Lista tickets. Clientes ven solo los propios. | Autenticado |
| GET | `/tickets/{id}` | Consulta ticket por ID. | Autenticado |
| POST | `/tickets` | Crea ticket de soporte. | Autenticado |
| PUT | `/tickets/{id}` | Actualiza ticket. | Administrador, empleado |
| DELETE | `/tickets/{id}` | Cierra ticket. | Administrador, empleado |

## Validaciones importantes

- Los endpoints administrativos requieren sesion activa y rol autorizado.
- Postman conserva la cookie `JSESSIONID` despues de ejecutar login.
- Usuarios eliminados quedan inactivos y no aparecen en listados.
- Productos eliminados quedan inactivos y no aparecen en listados.
- Proveedores con productos asociados no se eliminan; la API devuelve conflicto para proteger integridad.
