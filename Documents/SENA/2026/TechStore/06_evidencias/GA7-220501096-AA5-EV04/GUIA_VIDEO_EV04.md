# Guion video - GA7-220501096-AA5-EV04 API del proyecto

## 1. Presentacion inicial

Decir:

> Buenos dias. Mi nombre es Mateo Gonzalez y voy a sustentar la evidencia GA7-220501096-AA5-EV04, API del proyecto. En esta evidencia realizo pruebas de los servicios REST del proyecto TechStore usando Postman.

Mostrar:

- El repositorio de GitHub.
- La carpeta `06_evidencias/GA7-220501096-AA5-EV04`.
- Los archivos `README.md`, `ENDPOINTS_API.md` y la coleccion Postman.

Decir:

> En el repositorio dejo los archivos del proyecto, la documentacion de endpoints y la coleccion de Postman usada para probar la API.

## 2. Aclaracion de arquitectura

Mostrar en VS Code:

- `01_web/TechStoreReact/src/lib/api.js`
- `01_web/TechStoreWebServlets/src/main/java/com/techstore/web/api`

Decir:

> TechStore esta construido con React en el front-end, Java Servlets en el back-end y MySQL como base de datos. React consume la API mediante Axios, y los Servlets reciben las solicitudes HTTP, validan la sesion y llaman a los DAO para consultar o modificar MySQL.

Decir:

> Aunque en evidencias anteriores se mencionaban otras tecnologias, para este proyecto formativo estoy probando la API real de TechStore, que esta integrada con Tomcat y MySQL.

## 3. Mostrar conexion desde React

Abrir:

`01_web/TechStoreReact/src/lib/api.js`

Decir:

> Aqui esta la conexion del front-end con la API. La constante `API_URL` define la ruta base del back-end: `http://localhost:8080/TechStoreWeb/api`. Luego se crea una instancia de Axios con `baseURL`, `Content-Type` en JSON y `withCredentials: true`.

Decir:

> `withCredentials` es importante porque permite que el navegador y Postman trabajen con la sesion HTTP mediante la cookie `JSESSIONID`. Eso permite iniciar sesion una vez y despues ejecutar endpoints protegidos.

Mostrar:

- `authApi.login`
- `authApi.session`
- `authApi.logout`
- `resource(basePath)`

Decir:

> La funcion `resource` organiza los CRUD generales. Por eso productos, proveedores, usuarios y tickets comparten una estructura consistente: listar, consultar por ID, crear, actualizar y eliminar.

## 4. Mostrar los endpoints en Java

Abrir en NetBeans:

- `AuthApiServlet.java`
- `UsuarioApiServlet.java`
- `ProductoApiServlet.java`
- `ProveedorApiServlet.java`

Decir:

> En Java cada Servlet representa un modulo de la API. Por ejemplo, `AuthApiServlet` atiende `/api/auth/*`, `UsuarioApiServlet` atiende `/api/usuarios/*`, `ProductoApiServlet` atiende `/api/productos/*` y `ProveedorApiServlet` atiende `/api/proveedores/*`.

Mostrar:

- `@WebServlet("/api/auth/*")`
- `doGet`
- `doPost`
- `doPut`
- `doDelete`

Decir:

> Los metodos HTTP se separan segun la accion REST: `GET` consulta, `POST` crea, `PUT` actualiza y `DELETE` elimina o inactiva registros.

## 5. Ejecutar el proyecto

Mostrar NetBeans o terminal.

Si usas NetBeans:

Decir:

> Ahora ejecuto el proyecto en Tomcat para que la API quede disponible localmente.

Si usas terminal:

```powershell
cd C:\Users\mateo\Documents\SENA\2026\TechStore\01_web\TechStoreWebServlets
powershell -ExecutionPolicy Bypass -File .\run-local.ps1
```

Mostrar en navegador:

`http://localhost:8080/techstore-web-servlets/ui/`

Decir:

> La aplicacion esta disponible localmente. Ahora voy a probar directamente los endpoints en Postman.

## 6. Preparar Postman

Mostrar:

- Postman abierto.
- Boton `Import`.
- Archivo `TechStore-AA5-EV04.postman_collection.json`.
- Archivo `TechStore-AA5-EV04.postman_environment.json`.
- Ambiente seleccionado: `TechStore AA5 EV04 - Local`.

Decir:

> Importo la coleccion y el ambiente. El ambiente contiene la variable `baseUrl`, que apunta a `http://localhost:8080/TechStoreWeb/api`. Asi, si la URL cambia, no debo modificar cada peticion, solo la variable del ambiente.

## 7. Prueba de autenticacion

Ejecutar:

`Auth / Login administrador`

Decir:

> Primero pruebo el endpoint de inicio de sesion. Envio un `POST` a `/auth/login` con el usuario `admin` y la contrasena `12345`.

Mostrar:

- Status `200 OK`.
- Respuesta JSON con usuario y rol.

Decir:

> La respuesta indica que la autenticacion fue correcta y que el rol es administrador. Esto es importante porque los endpoints de usuarios y proveedores requieren permisos administrativos.

Ejecutar:

`Auth / Consultar sesion`

Decir:

> Ahora ejecuto `GET /auth/session`. Esta prueba confirma que Postman conserva la sesion mediante la cookie generada por Tomcat.

Mostrar:

- Respuesta con el usuario autenticado.

## 8. CRUD de usuarios

Ejecutar:

`Usuarios / Listar usuarios`

Decir:

> Primero consulto los usuarios activos con `GET /usuarios`.

Ejecutar:

`Usuarios / Crear usuario`

Decir:

> Ahora creo un usuario de prueba. No envio `idUsuario`, porque el back-end genera automaticamente el ID con formato `USR###`. Esto evita repeticiones y mantiene el control de claves en la base de datos.

Mostrar:

- Status `201 Created`.
- Campo `idUsuario`.

Decir:

> La respuesta muestra el usuario creado y el ID generado automaticamente. La coleccion guarda ese ID en una variable para usarlo en las siguientes pruebas.

Ejecutar:

`Usuarios / Consultar usuario creado`

Decir:

> Consulto el usuario por ID con `GET /usuarios/{id}` para validar que quedo registrado.

Ejecutar:

`Usuarios / Actualizar usuario`

Decir:

> Actualizo la ciudad del usuario usando `PUT /usuarios/{id}`. Con esto demuestro la operacion de actualizar.

Ejecutar:

`Usuarios / Eliminar usuario`

Decir:

> Elimino el usuario con `DELETE /usuarios/{id}`. En este proyecto la eliminacion se maneja como inactivacion para conservar trazabilidad.

Ejecutar:

`Usuarios / Buscar usuario eliminado`

Decir:

> Finalmente busco el usuario eliminado. Como la API filtra registros activos, el usuario ya no aparece en el listado.

## 9. CRUD de proveedor y producto

Ejecutar:

`Proveedores / Crear proveedor`

Decir:

> Creo un proveedor de prueba. La API genera el ID automaticamente.

Ejecutar:

`Productos / Crear producto`

Decir:

> Ahora creo un producto asociado al proveedor base `PRV001`. No envio `idProducto` ni `codigoInv`, porque el back-end genera ambos valores automaticamente.

Mostrar:

- `idProducto`
- `codigoInv`
- `idProveedor`

Ejecutar:

`Productos / Actualizar producto`

Decir:

> Actualizo precio y stock del producto con `PUT /productos/{id}`.

Ejecutar:

`Productos / Eliminar producto`

Decir:

> Inactivo el producto usando `DELETE /productos/{id}`. Luego puedo buscarlo y confirmar que ya no aparece como activo.

Ejecutar:

`Proveedores - limpieza final / Actualizar proveedor`

Decir:

> Actualizo el proveedor para demostrar la operacion `PUT` en otro modulo.

Ejecutar:

`Proveedores - limpieza final / Eliminar proveedor`

Decir:

> Finalmente elimino el proveedor de prueba. El CRUD de proveedor se prueba separado del producto para respetar la integridad de la base de datos: si un proveedor tiene productos asociados, el sistema no debe eliminarlo.

## 10. Consultas adicionales de API

Ejecutar:

- `Pedidos / Listar pedidos`
- `Carritos / Listar carritos`
- `Tickets / Listar tickets`

Decir:

> Tambien pruebo endpoints de consulta de pedidos, carritos y tickets. Estos endpoints requieren sesion activa y devuelven informacion segun el rol del usuario autenticado.

## 11. Validacion en MySQL Workbench

Conectarse a:

`TechStore_3308`

Ejecutar:

```sql
USE techstore_sql_real;

SELECT id_usuario, username, rol, nombre, email, ciudad, activo
FROM usuarios
WHERE username LIKE 'ev04_user_%'
ORDER BY fecha_registro DESC;

SELECT id_producto, codigo_inv, nombre, precio, stock, activo
FROM productos
WHERE nombre LIKE '%EV04%'
ORDER BY fecha_creacion DESC;

SELECT id_proveedor, nombre, email
FROM proveedores
WHERE nombre LIKE '%EV04%';
```

Decir:

> Con estas consultas verifico que la informacion realmente llega a MySQL. No solo estoy viendo una respuesta visual en Postman; estoy confirmando que el back-end afecta la base de datos del proyecto.

## 12. Cierre

Decir:

> Con esta sustentacion demostre el testing de la API del proyecto TechStore usando Postman. Se probaron autenticacion, sesion, consulta de endpoints y operaciones CRUD de usuarios, proveedores y productos. Tambien valide que los datos se registran, actualizan y eliminan correctamente en MySQL. En el repositorio dejo los archivos del proyecto, la coleccion de Postman, el ambiente y la documentacion de endpoints solicitada para la evidencia GA7-220501096-AA5-EV04.
