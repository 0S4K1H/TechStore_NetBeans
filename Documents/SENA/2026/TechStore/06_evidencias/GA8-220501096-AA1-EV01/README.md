# Evidencia GA8-220501096-AA1-EV01

## Desarrollar software a partir de la integracion de sus modulos componentes

Proyecto formativo: **TechStore**

TechStore es una aplicacion web para una tienda online de tecnologia. El proyecto integra modulos de catalogo, autenticacion, administracion, usuarios, productos, proveedores, pedidos, carritos, tickets de soporte y reportes.

## Repositorio

Link del repositorio:

https://github.com/0S4K1H/TechStore_NetBeans/tree/codex/techstore-publish

## Video de sustentacion

Link del video:

PENDIENTE_PEGAR_AQUI_EL_LINK_DEL_VIDEO

## Arquitectura aplicada

- **Front-end:** React con componentes funcionales.
- **Back-end:** Java Web con Servlets sobre Apache Tomcat.
- **Base de datos:** MySQL.
- **Comunicacion:** API REST consumida desde React mediante Axios.
- **Seguridad:** sesion HTTP, roles, rutas protegidas y filtros de autorizacion.
- **Versionamiento:** Git y GitHub.

## Modulos integrados

- Autenticacion e inicio de sesion.
- Catalogo publico de productos.
- Panel administrativo.
- Gestion de usuarios.
- Gestion de productos.
- Gestion de proveedores.
- Gestion de pedidos.
- Gestion de carritos.
- Gestion de tickets de soporte.
- Reportes operativos.

## Archivos de esta evidencia

- `GUIA_VIDEO_GA8_EV01.md`: guion completo para grabar la sustentacion.
- `CHECKLIST_ENTREGA.md`: lista de verificacion antes de entregar.
- `LINK_VIDEO_SUSTENTACION.md`: archivo para pegar el enlace final del video.

## Ambientes

### Desarrollo

- IDE principal: NetBeans para el proyecto Java Web.
- Editor complementario: VS Code para React y documentacion.
- Servidor local: Apache Tomcat 10.
- Base de datos local: MySQL `techstore_sql_real`.

### Pruebas

- Navegador web para validar flujos de usuario.
- DevTools Network para validar consumo de API.
- Postman/Newman para validar endpoints.
- MySQL Workbench para verificar persistencia de datos.

## Comando local recomendado

```powershell
cd C:\Users\mateo\Documents\SENA\2026\TechStore\01_web\TechStoreWebServlets
powershell -ExecutionPolicy Bypass -File .\run-local.ps1
```

Aplicacion local:

```text
http://localhost:8080/techstore-web-servlets/ui/
```

