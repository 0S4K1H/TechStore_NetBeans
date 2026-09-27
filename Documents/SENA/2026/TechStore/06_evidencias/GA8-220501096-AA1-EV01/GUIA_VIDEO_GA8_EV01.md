# Guion video GA8-220501096-AA1-EV01

## 1. Presentacion

Decir:

> Buenos dias. Mi nombre es Mateo Gonzalez y voy a sustentar la evidencia GA8-220501096-AA1-EV01, desarrollar software a partir de la integracion de sus modulos componentes. El proyecto que presento es TechStore, una aplicacion web para una tienda online de tecnologia.

Mostrar:

- Repositorio GitHub.
- Carpeta principal del proyecto.
- Carpeta `06_evidencias/GA8-220501096-AA1-EV01`.

Decir:

> En el repositorio se encuentran los archivos del proyecto, el codigo fuente, la base de datos, la documentacion y el archivo donde se deja el enlace del video de sustentacion.

## 2. Objetivo de la evidencia aplicado a TechStore

Decir:

> Esta evidencia solicita codificar e integrar los modulos del proyecto con base en los requerimientos del sistema. En TechStore esto se aplica integrando el front-end en React, el back-end en Java Servlets, la base de datos MySQL y las reglas de seguridad por rol.

Mostrar:

- `README.md` de la evidencia.
- Lista de modulos integrados.

Decir:

> Los modulos integrados son autenticacion, catalogo publico, panel administrativo, usuarios, productos, proveedores, pedidos, carritos, tickets de soporte y reportes.

## 3. Requerimientos del sistema

Mostrar:

- Aplicacion en navegador.
- Menu publico.
- Panel administrativo.

Decir:

> Los requerimientos principales del sistema son permitir que un cliente consulte productos, use carrito y registre solicitudes de soporte. Para el administrador, el sistema debe permitir gestionar usuarios, productos, proveedores, pedidos, carritos, tickets y reportes. Todo esto debe estar conectado a base de datos real.

## 4. Arquitectura por capas

Abrir en VS Code o NetBeans:

- `01_web/TechStoreReact`
- `01_web/TechStoreWebServlets`
- `03_base_datos/sql`

Decir:

> La aplicacion esta organizada por capas. La primera capa es el front-end en React, donde estan las pantallas y componentes visuales. La segunda capa es el back-end Java Web, donde estan los Servlets que funcionan como API. La tercera capa es la capa DAO, que se encarga de acceder a MySQL. Finalmente esta la base de datos, donde se guardan usuarios, productos, proveedores, pedidos, carritos y tickets.

Resumen para decir:

> El flujo general es: React envia solicitudes con Axios, los Servlets reciben la solicitud, validan la sesion y el rol, llaman al DAO y el DAO consulta o modifica MySQL.

## 5. Librerias y frameworks

Mostrar:

- `01_web/TechStoreReact/package.json`
- `01_web/TechStoreWebServlets/pom.xml`

Decir:

> En el front-end uso React para construir interfaces por componentes, Vite para compilar el proyecto y Axios para consumir la API. En el back-end uso Java Servlets, Jakarta Servlet, MySQL Connector y HikariCP para manejar conexiones a la base de datos de forma eficiente.

## 6. Componentes reutilizables en React

Abrir:

- `01_web/TechStoreReact/src/lib/api.js`
- `01_web/TechStoreReact/src/providers/AuthProvider.jsx`
- `01_web/TechStoreReact/src/components/admin/EntityCrudPage.jsx`
- `01_web/TechStoreReact/src/hooks/useEntityCrud.js`

Decir:

> En React se aplico reutilizacion de componentes. Por ejemplo, `EntityCrudPage` permite construir pantallas CRUD con una estructura comun. El hook `useEntityCrud` centraliza la logica para listar, crear, actualizar y eliminar registros. Esto evita repetir codigo en usuarios, productos y proveedores.

Explicar `api.js`:

> En `api.js` esta la conexion central con el back-end. Se crea una instancia de Axios con la URL base de la API y `withCredentials: true`, lo que permite mantener la sesion HTTP. Tambien se definen objetos como `authApi`, `productosApi`, `proveedoresApi` y `usuariosApi`.

## 7. Rutas y mapa de navegacion

Abrir:

- `01_web/TechStoreReact/src/routes/AppRoutes.jsx`

Decir:

> En `AppRoutes.jsx` se define el mapa de navegacion de la aplicacion. Aqui se separan rutas publicas, rutas autenticadas y rutas internas. Esto permite controlar que un cliente vea solo su zona y que el administrador entre al panel interno.

Mostrar:

- Ruta de tienda.
- Ruta de login.
- Ruta de dashboard.
- Rutas administrativas.

Decir:

> Esta parte cumple con el mapa de navegacion solicitado, porque muestra como se conectan las pantallas y como se protege el acceso a cada modulo.

## 8. Seguridad

Abrir en React:

- `01_web/TechStoreReact/src/lib/access.js`
- `01_web/TechStoreReact/src/providers/AuthProvider.jsx`

Abrir en Java:

- `01_web/TechStoreWebServlets/src/main/java/com/techstore/web/filter/AuthFilter.java`
- `01_web/TechStoreWebServlets/src/main/java/com/techstore/web/api/AuthApiServlet.java`

Decir:

> La seguridad se maneja en dos niveles. En React se protegen las rutas para que la interfaz solo muestre las opciones permitidas. En Java se valida realmente la sesion y el rol antes de permitir operaciones sensibles.

Decir:

> El Servlet de autenticacion crea la sesion cuando el usuario inicia sesion. El filtro `AuthFilter` revisa si el usuario esta autenticado y si tiene permiso para acceder a rutas como usuarios, proveedores o productos.

## 9. Back-end por paquetes

Mostrar en NetBeans:

- Paquete `api`
- Paquete `dao`
- Paquete `model`
- Paquete `util`
- Paquete `filter`

Decir:

> El back-end esta dividido por paquetes con responsabilidades claras. El paquete `api` contiene los Servlets REST. El paquete `dao` contiene las clases de acceso a datos. El paquete `model` contiene las entidades del sistema. El paquete `util` contiene utilidades como conexion, JSON, roles y contrasenas. El paquete `filter` contiene los filtros de seguridad.

## 10. Ejemplo modulo usuarios

Abrir:

- `01_web/TechStoreReact/src/pages/admin/UsuariosPage.jsx`
- `01_web/TechStoreWebServlets/src/main/java/com/techstore/web/api/UsuarioApiServlet.java`
- `01_web/TechStoreWebServlets/src/main/java/com/techstore/web/dao/UsuarioDAO.java`

Decir:

> Voy a mostrar el modulo de usuarios como ejemplo completo de integracion. En React se define la pantalla y el formulario. Luego React consume `usuariosApi`, que envia solicitudes HTTP al Servlet `UsuarioApiServlet`. El Servlet valida el rol administrador y llama a `UsuarioDAO`, que finalmente ejecuta las consultas SQL contra MySQL.

Decir:

> En este modulo el ID interno del usuario se genera automaticamente desde el back-end. Esto evita repeticion de IDs y mejora la integridad de la informacion.

## 11. Ejemplo modulo productos

Abrir:

- `01_web/TechStoreReact/src/pages/admin/ProductosPage.jsx`
- `01_web/TechStoreWebServlets/src/main/java/com/techstore/web/api/ProductoApiServlet.java`
- `01_web/TechStoreWebServlets/src/main/java/com/techstore/web/dao/ProductoDAO.java`

Decir:

> El modulo de productos permite crear, consultar, actualizar e inactivar productos. El back-end genera automaticamente el `idProducto` y el `codigoInv`. Tambien valida que el producto tenga proveedor, nombre, categoria, precio y stock validos.

## 12. Conexion a base de datos

Abrir:

- `01_web/TechStoreWebServlets/src/main/java/com/techstore/web/util/Conexion.java`

Decir:

> La conexion a MySQL se centraliza en la clase `Conexion`. Aqui se define la URL de la base de datos `techstore_sql_real`, el usuario, la contrasena y el pool de conexiones HikariCP. Esto permite reutilizar conexiones y no abrir una conexion nueva manualmente por cada solicitud.

Mostrar MySQL Workbench:

- Conexion `TechStore_3308`.
- Base de datos `techstore_sql_real`.

Decir:

> Esta es la misma base de datos que consume el back-end, por eso puedo validar directamente si los cambios se guardan.

## 13. Ejecucion real de la aplicacion

Abrir navegador:

```text
http://localhost:8080/techstore-web-servlets/ui/
```

Decir:

> Ahora muestro la aplicacion ejecutandose. Esta interfaz visible es React, pero esta desplegada junto con el back-end en Tomcat.

Hacer:

- Entrar a login.
- Iniciar sesion con `admin / 12345`.
- Entrar al panel administrativo.

Decir:

> Inicio sesion como administrador para acceder a los modulos internos.

## 14. Prueba funcional en vivo

Elegir una prueba simple: producto o proveedor.

Recomendado: proveedor.

Hacer:

- Ir a Proveedores.
- Crear proveedor: `Proveedor GA8 Evidencia`.
- Editar nombre o correo.
- Eliminar proveedor.

Decir:

> Esta prueba demuestra que el modulo esta integrado desde la interfaz hasta la base de datos. La accion nace en React, pasa por Axios, llega al Servlet, usa el DAO y se refleja en MySQL.

Validar en MySQL:

```sql
USE techstore_sql_real;

SELECT *
FROM proveedores
WHERE nombre LIKE '%GA8%';
```

Decir:

> Con esta consulta valido que el registro fue creado o eliminado en la base de datos real.

## 15. Pruebas de API y calidad

Mostrar:

- Carpeta `06_evidencias/GA7-220501096-AA5-EV04`
- Coleccion Postman si aplica.
- Resultado Newman si lo quieres mencionar.

Decir:

> Como apoyo de pruebas, el proyecto tambien cuenta con pruebas de API en Postman. Esto permite validar los endpoints REST de autenticacion, usuarios, proveedores, productos, pedidos, carritos y tickets.

## 16. Versionamiento

Mostrar:

- GitHub.
- Rama `codex/techstore-publish`.
- Commits recientes.

Decir:

> El proyecto usa Git y GitHub como control de versiones. Cada avance se sube al repositorio, permitiendo trazabilidad del desarrollo y respaldo del codigo fuente.

## 17. Cierre

Decir:

> Con esta sustentacion demostre la integracion de los modulos componentes de TechStore. El sistema integra React, Java Servlets, API REST, DAO, MySQL, seguridad por roles, rutas protegidas, componentes reutilizables, pruebas funcionales y versionamiento en GitHub. Esto cumple con el objetivo de desarrollar software a partir de la integracion de sus modulos componentes.

## Duracion recomendada

- Presentacion y arquitectura: 3 minutos.
- Codigo React: 4 minutos.
- Codigo Java y base de datos: 5 minutos.
- Prueba en vivo: 4 minutos.
- Versionamiento y cierre: 2 minutos.

Duracion total sugerida: 15 a 18 minutos.

