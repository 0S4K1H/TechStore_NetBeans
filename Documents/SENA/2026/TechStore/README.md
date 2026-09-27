# TechStore Solutions S.A.S.

Repositorio central del proyecto TechStore.

## Estructura general

- `00_diseno_inicial/`
  Maqueta original del sitio web, assets visuales y referencia de la version HTML previa.

- `01_web/`
  Aplicación web funcional unificada: React como UI visible y Java/JSP/Servlets como backend/API.
  Módulos principales: `productos`, `proveedores`, `usuarios`, `tickets`, `pedidos` y `carritos`.

- `02_java_jdbc/`
  Modulo de consola Java JDBC complementario.

- `03_base_datos/sql/`
  Script relacional principal de TechStore.

- `07_instaladores/`
  JDK, NetBeans, Tomcat, driver JDBC y utilidades de instalación.

- `09_mysql_portable/`
  Instancia portátil de MySQL usada para el proyecto.

## Fuente de verdad del proyecto

- La version HTML de referencia vive en `00_diseno_inicial/html/`.
- La version funcional del sistema vive en `01_web/TechStoreWebServlets/`.
- Si una pagina cambia en el HTML de referencia, se debe actualizar tambien su equivalente funcional en la aplicacion web.

## Base de datos activa

- Nombre: `techstore_sql_real`
- Host: `127.0.0.1`
- Puerto: `3308`
- Usuario: `root`
- Contraseña: `TechStore3308`

## Recomendación de trabajo

1. Revisar primero `00_diseno_inicial/` para entender la maqueta original.
2. Luego trabajar `01_web/` como versión funcional final.
3. Mantener `03_base_datos/` sincronizada con la web.

## Regla del proyecto

Todo archivo nuevo de TechStore debe guardarse dentro de esta carpeta para evitar dispersión del material.
