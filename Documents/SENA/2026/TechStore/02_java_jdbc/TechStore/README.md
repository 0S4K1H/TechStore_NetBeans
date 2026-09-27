# TechStore JDBC de consola

Proyecto Java de consola usado como modulo complementario de conexion JDBC.

## Qué demuestra

- Carga explícita del driver `com.mysql.cj.jdbc.Driver`.
- Conexión a `techstore_sql_real` con `DriverManager`.
- CRUD de productos desde consola.
- Consultas con `PreparedStatement`, `Statement` y `ResultSet`.
- Validación de inserción, actualización y eliminación.

## Ejecución

Abrir el proyecto en NetBeans y ejecutar la clase principal `techstore.TechStore`.

## Base de datos

- Host: `127.0.0.1`
- Puerto: `3308`
- Base: `techstore_sql_real`
- Usuario: `root`
- Contraseña: `TechStore3308`
