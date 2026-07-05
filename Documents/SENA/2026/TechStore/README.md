# TechStore

Carpeta central del proyecto TechStore Solutions S.A.S.

## Estructura

- `01_web/`
  Web del proyecto.

- `02_java_jdbc/`
  Proyecto Java con JDBC para la evidencia GA7.

- `03_base_datos/sql/`
  Script SQL, modelo relacional y soportes de base de datos.

- `04_base_datos/nosql/`
  Evidencia MongoDB y soportes NoSQL.

- `05_documentacion/`
  Informes, plantillas y documentos finales.

- `06_evidencias/`
  Capturas, pruebas y soportes de ejecución.

- `07_instaladores/`
  JDK, NetBeans, driver JDBC y demás instaladores.

- `08_videos/`
  Videos de sustentación y grabaciones de entrega.

## Base de datos activa para JDBC

- Nombre: `techstore_sql_real`
- Host: `127.0.0.1`
- Puerto: `3308`
- Usuario: `root`
- Contraseña: `TechStore3308`

## Instancia local TechStore

- Inicio: `09_mysql_portable/start-techstore-mysql.bat`
- Cierre: `09_mysql_portable/stop-techstore-mysql.bat`

## Flujo recomendado para la evidencia GA7

1. Ejecutar el script SQL ubicado en `03_base_datos/sql/techstore_script.sql`.
2. Confirmar que la base `techstore_sql_real` y la tabla `productos` existen.
3. Abrir el proyecto Java en NetBeans.
4. Verificar que el archivo `mysql-connector-j-9.7.0.jar` está en `07_instaladores/` y agregado al proyecto.
5. Ejecutar `src/techstore/TechStore.java`.
6. Ejecutar `TechStore.java` o abrir Workbench contra `127.0.0.1:3308`.
7. Tomar captura del resultado en consola y de la consulta en MySQL Workbench.

## Regla de trabajo

Todo lo nuevo de TechStore debe guardarse aquí para no dispersar archivos por otras carpetas de `SENA/2026`.
