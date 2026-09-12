# TechStore NoSQL API

API REST de evidencia para la actividad GA7-220501096-AA5-EV01.

## Objetivo

Demostrar la construccion de un servicio web con:

- `Express.js`
- `Mongoose`
- `body-parser`
- `nodemon`

La API expone registro e inicio de sesion sobre la coleccion `usuarios`, y operaciones CRUD sobre la coleccion `productos` de MongoDB.

## Estructura

- `src/server.js`: arranque de la aplicacion.
- `src/app.js`: configuracion de Express y rutas.
- `src/config/db.js`: conexion a MongoDB.
- `src/models/Product.js`: esquema y validaciones.
- `src/models/User.js`: esquema de usuarios para registro e inicio de sesion.
- `src/controllers/authController.js`: logica de registro y autenticacion.
- `src/controllers/productController.js`: logica CRUD.
- `src/routes/authRoutes.js`: rutas REST de autenticacion.
- `src/routes/productRoutes.js`: rutas REST.
- `src/middleware/errorHandler.js`: respuestas de error limpias.
- `postman/TechStore-NoSQL.postman_collection.json`: coleccion de pruebas.

## Requisitos previos

- Node.js 22+
- MongoDB corriendo localmente
- Postman

## Configuracion

1. Instala dependencias:

```bash
npm install
```

2. Crea el archivo `.env` con base en `.env.example`:

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/techstore_nosql
```

3. Ejecuta la API en modo desarrollo:

```bash
npm run dev
```

## Endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/productos`
- `GET /api/productos/:id`
- `POST /api/productos`
- `PUT /api/productos/:id`
- `DELETE /api/productos/:id`

## Flujo recomendado para el video

1. Mostrar la estructura del proyecto en VS Code o NetBeans.
2. Abrir `package.json` y destacar `express`, `mongoose`, `body-parser` y `nodemon`.
3. Abrir `src/models/User.js` y explicar el registro/login.
4. Abrir `src/controllers/authController.js` y demostrar autenticacion satisfactoria/error.
5. Abrir `src/models/Product.js` y explicar las validaciones.
6. Abrir `src/controllers/productController.js` y explicar cada CRUD.
7. Ejecutar `npm run dev` y mostrar el arranque de MongoDB y del servidor.
8. En Postman:
   - probar `GET /api/health`
   - registrar usuario con `POST /api/auth/register`
   - iniciar sesion correcto con `POST /api/auth/login`
   - iniciar sesion incorrecto para demostrar el error
   - crear un producto con `POST /api/productos`
   - consultar `GET /api/productos`
   - consultar `GET /api/productos/:id`
   - actualizar `PUT /api/productos/:id`
   - eliminar `DELETE /api/productos/:id`
7. Validar en MongoDB Compass o en `mongosh` que el documento se crea, se modifica y desaparece.

## Validacion en MongoDB

Si quieres revisar por consola:

```bash
mongosh "mongodb://127.0.0.1:27017/techstore_nosql"
use techstore_nosql
db.productos.find().pretty()
db.usuarios.find({}, { passwordHash: 0 }).pretty()
```

## Idea para la sustentacion

Frase base:

> "Esta API fue construida con Express y Mongoose para separar la capa de rutas, la logica de negocio y el esquema de datos. Postman permite demostrar cada operacion CRUD y MongoDB valida que la informacion realmente persiste en la base de datos."
