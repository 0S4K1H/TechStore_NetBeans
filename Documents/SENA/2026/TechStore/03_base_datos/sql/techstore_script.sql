-- ============================================================
-- EVIDENCIA: GA6-220501096-AA2-EV01
-- PROYECTO: TECHSTORE (modelo relacional coherente con la web)
-- MOTOR: MySQL 8+
-- ============================================================

DROP DATABASE IF EXISTS techstore_sql_real;
CREATE DATABASE techstore_sql_real
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE techstore_sql_real;

-- ============================================================
-- 1) DDL - CREACION DE TABLAS
-- ============================================================

CREATE TABLE usuarios (
  id_usuario VARCHAR(20) PRIMARY KEY,
  username VARCHAR(40) NOT NULL UNIQUE,
  password_demo VARCHAR(120) NOT NULL,
  rol ENUM('cliente','empleado','administrador') NOT NULL,
  nombre VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  ciudad VARCHAR(60) NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE proveedores (
  id_proveedor VARCHAR(10) PRIMARY KEY,
  nombre VARCHAR(80) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE productos (
  id_producto VARCHAR(10) PRIMARY KEY,
  codigo_inv VARCHAR(20) NOT NULL UNIQUE,
  id_proveedor VARCHAR(10) NOT NULL,
  nombre VARCHAR(120) NOT NULL,
  categoria ENUM('laptop','movil','accesorio','componente','periferico') NOT NULL,
  precio DECIMAL(12,2) NOT NULL,
  stock INT NOT NULL,
  activo TINYINT(1) NOT NULL DEFAULT 1,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor)
) ENGINE=InnoDB;

CREATE TABLE carritos (
  id_carrito BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_usuario VARCHAR(20) NOT NULL,
  estado ENUM('activo','cerrado') NOT NULL DEFAULT 'activo',
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE carrito_detalle (
  id_carrito BIGINT NOT NULL,
  id_producto VARCHAR(10) NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (id_carrito, id_producto),
  FOREIGN KEY (id_carrito) REFERENCES carritos(id_carrito),
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
) ENGINE=InnoDB;

CREATE TABLE pedidos (
  id_pedido VARCHAR(12) PRIMARY KEY,
  id_usuario_cliente VARCHAR(20) NOT NULL,
  id_usuario_empleado VARCHAR(20) NULL,
  empleado_asignado VARCHAR(80) NOT NULL DEFAULT 'Sin asignar',
  nombre_cliente VARCHAR(80) NOT NULL,
  email_cliente VARCHAR(120) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  direccion VARCHAR(140) NOT NULL,
  ciudad VARCHAR(60) NOT NULL,
  fecha_pedido DATE NOT NULL,
  fecha_estimada DATE NOT NULL,
  transportadora VARCHAR(60) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  costo_envio DECIMAL(12,2) NOT NULL DEFAULT 0,
  descuento DECIMAL(12,2) NOT NULL DEFAULT 0,
  total DECIMAL(12,2) NOT NULL,
  estado ENUM('pendiente','preparacion','enviado','entregado','cancelado') NOT NULL,
  prioridad ENUM('baja','media','alta') NOT NULL,
  metodo_pago VARCHAR(60) NOT NULL,
  nota VARCHAR(255) NOT NULL DEFAULT '',
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_usuario_cliente) REFERENCES usuarios(id_usuario),
  FOREIGN KEY (id_usuario_empleado) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB;

CREATE TABLE pedido_detalle (
  id_detalle BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_pedido VARCHAR(12) NOT NULL,
  id_producto VARCHAR(10) NOT NULL,
  nombre_producto VARCHAR(120) NOT NULL,
  categoria ENUM('laptop','movil','accesorio','componente','periferico') NOT NULL,
  cantidad INT NOT NULL,
  precio_unitario DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
  FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
) ENGINE=InnoDB;

CREATE TABLE pedido_timeline (
  id_evento BIGINT AUTO_INCREMENT PRIMARY KEY,
  id_pedido VARCHAR(12) NOT NULL,
  fecha_evento DATETIME NOT NULL,
  descripcion VARCHAR(255) NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido)
) ENGINE=InnoDB;

CREATE TABLE tickets_soporte (
  id_ticket VARCHAR(12) PRIMARY KEY,
  id_usuario_cliente VARCHAR(20) NOT NULL,
  asunto VARCHAR(120) NOT NULL,
  mensaje TEXT NOT NULL,
  estado ENUM('abierto','en_proceso','cerrado') NOT NULL DEFAULT 'abierto',
  fecha_creacion DATETIME NOT NULL,
  fecha_cierre DATETIME NULL,
  FOREIGN KEY (id_usuario_cliente) REFERENCES usuarios(id_usuario)
) ENGINE=InnoDB;

-- ============================================================
-- 2) VERIFICACION ESTRUCTURAL
-- ============================================================

SHOW TABLES;
DESCRIBE usuarios;
DESCRIBE proveedores;
DESCRIBE productos;
DESCRIBE carritos;
DESCRIBE carrito_detalle;
DESCRIBE pedidos;
DESCRIBE pedido_detalle;
DESCRIBE pedido_timeline;
DESCRIBE tickets_soporte;

-- ============================================================
-- 3) DML - CARGA INICIAL
-- ============================================================

INSERT INTO usuarios (id_usuario, username, password_demo, rol, nombre, email, ciudad) VALUES
('u_cliente','cliente','12345','cliente','Cliente TechStore','cliente@techstore.com','Bogota'),
('u_empleado','empleado','12345','empleado','Ana Torres','ana@techstore.demo','Bogota'),
('u_admin','admin','12345','administrador','Mateo Cardenas','mateo@techstore.com','Bogota'),
('u_lgomez','lgomez','12345','cliente','Laura Gomez','laura@techstore.demo','Medellin'),
('u_nmejia','nmejia','12345','cliente','Nicolas Mejia','nicolas@techstore.demo','Bucaramanga'),
('u_carlos','carlos','12345','empleado','Carlos Ruiz','carlos@techstore.demo','Bogota'),
('u_luisa','luisa','12345','empleado','Luisa Gomez','luisa@techstore.demo','Bogota'),
('u_miguel','miguel','12345','empleado','Miguel Vega','miguel@techstore.demo','Bogota');

INSERT INTO proveedores (id_proveedor, nombre, email) VALUES
('PRV001','Lenovo Colombia','contacto@lenovo.demo'),
('PRV002','Samsung Distribuciones','ventas@samsung.demo'),
('PRV003','TechParts SAS','comercial@techparts.demo');

INSERT INTO productos (id_producto, codigo_inv, id_proveedor, nombre, categoria, precio, stock, activo) VALUES
('p1','INV-1001','PRV001','Laptop Lenovo IdeaPad','laptop',2300000.00,12,1),
('p2','INV-1002','PRV002','Smartphone Galaxy A55','movil',1480000.00,9,1),
('p3','INV-1003','PRV003','Teclado mecanico RGB','accesorio',220000.00,14,1),
('p4','INV-1004','PRV003','Audifonos inalambricos','accesorio',310000.00,10,1),
('p5','INV-1005','PRV003','Tarjeta grafica RTX 4060','componente',1850000.00,3,1),
('p6','INV-1006','PRV002','Monitor Samsung 24 pulgadas','periferico',650000.00,5,1),
('p7','INV-1007','PRV003','Disco SSD 1TB','componente',420000.00,16,1),
('p8','INV-1008','PRV003','Mouse gaming','periferico',70000.00,22,1),
('p9','INV-1009','PRV002','Impresora HP LaserJet','periferico',820000.00,2,0);

INSERT INTO carritos (id_usuario, estado) VALUES
('u_cliente','activo');

INSERT INTO carrito_detalle (id_carrito, id_producto, cantidad, precio_unitario) VALUES
(1,'p2',1,1480000.00),
(1,'p8',2,70000.00);

INSERT INTO pedidos (
  id_pedido, id_usuario_cliente, id_usuario_empleado, empleado_asignado,
  nombre_cliente, email_cliente, telefono, direccion, ciudad,
  fecha_pedido, fecha_estimada, transportadora,
  subtotal, costo_envio, descuento, total,
  estado, prioridad, metodo_pago, nota
) VALUES
('TS-903218','u_cliente','u_carlos','Carlos Ruiz','Cliente TechStore','cliente@techstore.com','3001234567','Calle 80 # 15-22','Bogota','2026-03-03','2026-03-07','TechExpress',1880000.00,25000.00,25000.00,1880000.00,'preparacion','alta','Billetera digital','Llamar antes de entregar'),
('TS-458120','u_cliente','u_empleado','Ana Torres','Cliente TechStore','cliente@techstore.com','3001234567','Calle 12 #45-67','Bogota','2026-02-24','2026-02-27','TechExpress',3170000.00,0.00,0.00,3170000.00,'enviado','alta','Tarjeta credito','Entregar en recepcion'),
('TS-120044','u_cliente','u_luisa','Luisa Gomez','Cliente TechStore','cliente@techstore.com','3001234567','Cra 18 # 90-11','Bogota','2026-02-10','2026-02-13','EnviaTech',650000.00,25000.00,25000.00,650000.00,'entregado','baja','Tarjeta debito',''),
('TS-331907','u_lgomez','u_carlos','Carlos Ruiz','Laura Gomez','laura@techstore.demo','3015558899','Cra 81 #20-11','Medellin','2026-02-21','2026-02-25','EnviaTech',1790000.00,0.00,0.00,1790000.00,'entregado','media','Transferencia',''),
('TS-740512','u_nmejia','u_miguel','Miguel Vega','Nicolas Mejia','nicolas@techstore.demo','3028004455','Calle 90 #10-52','Bucaramanga','2026-02-19','2026-02-23','TechExpress',420000.00,25000.00,25000.00,420000.00,'cancelado','media','Contraentrega','Cancelado por el cliente');

INSERT INTO pedido_detalle (id_pedido, id_producto, nombre_producto, categoria, cantidad, precio_unitario, subtotal) VALUES
('TS-903218','p5','Tarjeta grafica RTX 4060','componente',1,1850000.00,1850000.00),
('TS-903218','p8','Mouse gaming','periferico',1,70000.00,70000.00),
('TS-458120','p1','Laptop Lenovo IdeaPad','laptop',1,2300000.00,2300000.00),
('TS-458120','p3','Teclado mecanico RGB','accesorio',1,220000.00,220000.00),
('TS-458120','p6','Monitor Samsung 24 pulgadas','periferico',1,650000.00,650000.00),
('TS-120044','p6','Monitor Samsung 24 pulgadas','periferico',1,650000.00,650000.00),
('TS-331907','p2','Smartphone Galaxy A55','movil',1,1480000.00,1480000.00),
('TS-331907','p4','Audifonos inalambricos','accesorio',1,310000.00,310000.00),
('TS-740512','p7','Disco SSD 1TB','componente',1,420000.00,420000.00);

INSERT INTO pedido_timeline (id_pedido, fecha_evento, descripcion) VALUES
('TS-903218','2026-03-03 09:12:00','Pago aprobado y pedido registrado.'),
('TS-903218','2026-03-03 13:40:00','Pedido confirmado por bodega.'),
('TS-903218','2026-03-04 08:20:00','Pedido en preparacion para despacho.'),
('TS-458120','2026-02-24 09:15:00','Pago aprobado y pedido registrado.'),
('TS-458120','2026-02-24 13:00:00','Pedido confirmado por bodega.'),
('TS-458120','2026-02-25 08:40:00','Pedido despachado hacia centro logistico.'),
('TS-458120','2026-02-26 07:20:00','Pedido en ruta para entrega.'),
('TS-120044','2026-02-10 10:18:00','Pago aprobado y pedido registrado.'),
('TS-120044','2026-02-10 15:52:00','Pedido despachado.'),
('TS-120044','2026-02-11 08:00:00','Pedido en camino.'),
('TS-120044','2026-02-12 14:27:00','Pedido entregado al cliente.'),
('TS-331907','2026-02-21 11:05:00','Pago aprobado y pedido registrado.'),
('TS-331907','2026-02-21 16:30:00','Producto en proceso de empaque.'),
('TS-331907','2026-02-22 07:55:00','Pedido despachado.'),
('TS-331907','2026-02-23 17:10:00','Pedido entregado al cliente.'),
('TS-740512','2026-02-19 09:00:00','Pago autorizado y pedido creado.'),
('TS-740512','2026-02-19 12:10:00','Pedido cancelado por solicitud del cliente.');

INSERT INTO tickets_soporte (id_ticket, id_usuario_cliente, asunto, mensaje, estado, fecha_creacion, fecha_cierre) VALUES
('TK-440210','u_cliente','Seguimiento pedido TS-458120','Necesito confirmar si el pedido llega hoy.','abierto','2026-02-26 16:10:00',NULL);

-- ============================================================
-- 4) CONSULTAS DE VALIDACION
-- ============================================================

SELECT * FROM usuarios;
SELECT * FROM proveedores;
SELECT * FROM productos;
SELECT * FROM carritos;
SELECT * FROM carrito_detalle;
SELECT * FROM pedidos;
SELECT * FROM pedido_detalle;
SELECT * FROM pedido_timeline;
SELECT * FROM tickets_soporte;

-- Consulta relacional de pedidos + cliente + items
SELECT
  p.id_pedido,
  p.fecha_pedido,
  p.estado,
  p.total,
  u.nombre AS cliente,
  d.nombre_producto,
  d.cantidad,
  d.subtotal
FROM pedidos p
JOIN usuarios u ON u.id_usuario = p.id_usuario_cliente
JOIN pedido_detalle d ON d.id_pedido = p.id_pedido
ORDER BY p.fecha_pedido DESC, p.id_pedido, d.id_detalle;

-- ============================================================
-- 5) UPDATE (ANTES Y DESPUES) - primer y ultimo producto
-- ============================================================

-- Antes:
SELECT * FROM productos ORDER BY id_producto ASC LIMIT 1;
SELECT * FROM productos ORDER BY id_producto DESC LIMIT 1;

-- Cambios:
UPDATE productos SET stock = stock + 3 WHERE id_producto = 'p1';
UPDATE productos SET activo = 1 WHERE id_producto = 'p9';

-- Despues:
SELECT * FROM productos ORDER BY id_producto ASC LIMIT 1;
SELECT * FROM productos ORDER BY id_producto DESC LIMIT 1;

-- ============================================================
-- 6) CONTEO POR TABLA
-- ============================================================

SELECT 'usuarios' AS tabla, COUNT(*) AS total FROM usuarios
UNION ALL SELECT 'proveedores', COUNT(*) FROM proveedores
UNION ALL SELECT 'productos', COUNT(*) FROM productos
UNION ALL SELECT 'carritos', COUNT(*) FROM carritos
UNION ALL SELECT 'carrito_detalle', COUNT(*) FROM carrito_detalle
UNION ALL SELECT 'pedidos', COUNT(*) FROM pedidos
UNION ALL SELECT 'pedido_detalle', COUNT(*) FROM pedido_detalle
UNION ALL SELECT 'pedido_timeline', COUNT(*) FROM pedido_timeline
UNION ALL SELECT 'tickets_soporte', COUNT(*) FROM tickets_soporte;
