# TechStore Solutions S.A.S.

Carpeta central del proyecto TechStore.

## Estructura general

- `00_diseno_inicial/`
  Maqueta original del sitio web, documentos iniciales, assets visuales, scripts de apoyo y referencia de la versión HTML previa.

- `01_web/`
  Aplicación web funcional unificada: React como UI visible y Java/JSP/Servlets como backend/API.
  Módulos principales: `productos`, `proveedores`, `usuarios`, `tickets`, `pedidos` y `carritos`.

- `02_java_jdbc/`
  Evidencia de consola y ejercicios Java JDBC complementarios.

- `03_base_datos/sql/`
  Script relacional principal de TechStore.

- `04_base_datos/nosql/`
  Evidencia y soportes NoSQL / MongoDB.

- `05_documentacion/`
  Informes técnicos, plantillas y documentos finales.

- `06_evidencias/`
  Capturas, pruebas, verificaciones y soportes para el video.

- `07_instaladores/`
  JDK, NetBeans, Tomcat, driver JDBC y utilidades de instalación.

- `08_videos/`
  Videos o enlaces de sustentación.

- `09_mysql_portable/`
  Instancia portátil de MySQL usada para el proyecto.

## Fuente de verdad del trabajo

- La version HTML de referencia para las evidencias vive en `00_diseno_inicial/html/`.
- La version funcional del sistema vive en `01_web/TechStoreWebServlets/`.
- Si una pagina cambia en el HTML de referencia, se debe actualizar tambien su copia canonical dentro de `TechStore/00_diseno_inicial/html/` para evitar duplicados o versiones distintas.

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
4. Guardar cada captura o prueba en `06_evidencias/`.
5. Registrar el video final en `08_videos/`.

## Regla del proyecto

Todo archivo nuevo de TechStore debe guardarse dentro de esta carpeta para evitar dispersión del material.
