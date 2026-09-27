# Evidencia GA7-220501096-AA5-EV04 - API del proyecto

## Proyecto

TechStore es una tienda online desarrollada con front-end en React, back-end en Java Servlets desplegado en Apache Tomcat y base de datos MySQL.

Para esta evidencia se realiza el testing de las API REST del proyecto usando Postman. Las pruebas evidencian autenticacion, consulta de sesion y operaciones CRUD sobre modulos administrativos del sistema.

## Repositorio

Link del repositorio:

https://github.com/0S4K1H/TechStore_NetBeans/tree/codex/techstore-publish

## Video sustentacion

Link del video:

PENDIENTE_PEGAR_AQUI_EL_LINK_DEL_VIDEO

## Archivos de esta evidencia

- `postman/TechStore-AA5-EV04.postman_collection.json`: coleccion Postman con pruebas de API.
- `postman/TechStore-AA5-EV04.postman_environment.json`: ambiente Postman con la URL base local.
- `ENDPOINTS_API.md`: listado documentado de endpoints del proyecto.
- `GUIA_VIDEO_EV04.md`: guion detallado para grabar la sustentacion.
- `PANTALLAZOS_TESTING.md`: lista de capturas recomendadas para documentar el testing.
- `LINK_VIDEO_SUSTENTACION.md`: archivo para pegar el enlace final del video.

## Requisitos para ejecutar

- Apache Tomcat ejecutando el proyecto TechStore.
- MySQL activo con la base de datos `techstore_sql_real`.
- Postman instalado.
- URL local de la API: `http://localhost:8080/TechStoreWeb/api`.

## Flujo de prueba recomendado

1. Iniciar el proyecto desde NetBeans o desde `run-local.ps1`.
2. Abrir Postman.
3. Importar el ambiente `TechStore-AA5-EV04.postman_environment.json`.
4. Importar la coleccion `TechStore-AA5-EV04.postman_collection.json`.
5. Seleccionar el ambiente `TechStore AA5 EV04 - Local`.
6. Ejecutar primero `Auth / Login administrador`.
7. Ejecutar las carpetas de CRUD en orden: Usuarios, Proveedores, Productos y Proveedores - limpieza final.
8. Validar los cambios en MySQL Workbench.
