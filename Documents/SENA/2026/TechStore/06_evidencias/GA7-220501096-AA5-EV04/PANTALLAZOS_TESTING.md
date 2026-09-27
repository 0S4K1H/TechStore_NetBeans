# Pantallazos sugeridos para documentar el testing

Para cumplir el punto "Documentar con pantallazos el testing realizado", tomar capturas durante el video o despues de ejecutar Postman.

## Capturas minimas recomendadas

1. Postman con el ambiente `TechStore AA5 EV04 - Local` seleccionado.
2. `POST /auth/login` con estado `200 OK`.
3. `GET /auth/session` mostrando la sesion activa.
4. `POST /usuarios` con estado `201 Created` y `idUsuario` generado.
5. `PUT /usuarios/{id}` con estado `200 OK`.
6. `DELETE /usuarios/{id}` con estado `200 OK`.
7. `POST /proveedores` con estado `201 Created`.
8. `POST /productos` con estado `201 Created`, `idProducto` y `codigoInv`.
9. `PUT /productos/{id}` con estado `200 OK`.
10. `DELETE /productos/{id}` con estado `200 OK`.
11. Postman Runner o Newman mostrando ejecucion completa sin fallos.
12. MySQL Workbench mostrando consultas de validacion sobre `usuarios`, `productos` y `proveedores`.

## Frase para explicar las capturas

> Estos pantallazos evidencian que cada endpoint fue probado con Postman, mostrando metodo HTTP, URL, cuerpo JSON, codigo de respuesta y respuesta del servidor. Tambien incluyo la validacion en MySQL para confirmar que las operaciones afectan la base de datos real del proyecto.
