package techstore;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;

public class TechStore {

    private static final String URL = "jdbc:mysql://127.0.0.1:3308/techstore_sql_real?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true";
    private static final String USER = "root";
    private static final String PASSWORD = "TechStore3308";
    private static final Scanner SCANNER = new Scanner(System.in);

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException ex) {
            throw new RuntimeException("No se pudo cargar el driver JDBC", ex);
        }
    }

    public static void main(String[] args) {
        int opcion;

        do {
            mostrarMenu();
            opcion = leerEntero("Selecciona una opcion: ");

            switch (opcion) {
                case 1 -> listarProductos();
                case 2 -> consultarProductoPorId();
                case 3 -> insertarProducto();
                case 4 -> actualizarProducto();
                case 5 -> eliminarProducto();
                case 6 -> System.out.println("Saliendo de TechStore...");
                default -> System.out.println("Opcion no valida.");
            }
        } while (opcion != 6);
    }

    private static void mostrarMenu() {
        System.out.println("\n========================================");
        System.out.println("   TECHSTORE - CRUD DE PRODUCTOS");
        System.out.println("========================================");
        System.out.println("1. Listar productos");
        System.out.println("2. Consultar producto por ID");
        System.out.println("3. Insertar producto");
        System.out.println("4. Actualizar producto");
        System.out.println("5. Eliminar producto");
        System.out.println("6. Salir");
        System.out.println("========================================");
    }

    private static Connection obtenerConexion() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }

    private static void listarProductos() {
        String sql = """
                SELECT p.id_producto, p.codigo_inv, p.id_proveedor, pr.nombre AS proveedor,
                       p.nombre, p.categoria, p.precio, p.stock, p.activo, p.fecha_creacion
                FROM productos p
                INNER JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
                ORDER BY p.id_producto
                """;

        try (
                Connection conexion = obtenerConexion();
                Statement statement = conexion.createStatement();
                ResultSet rs = statement.executeQuery(sql)
        ) {
            System.out.println("\nLISTADO DE PRODUCTOS:");
            System.out.printf("%-10s | %-12s | %-20s | %-28s | %-12s | %-15s | %-8s | %-8s | %-20s%n",
                    "ID", "CODIGO", "PROVEEDOR", "NOMBRE", "CATEGORIA", "PRECIO", "STOCK", "ACTIVO", "FECHA");
            System.out.println("---------------------------------------------------------------------------------------------------------------");

            while (rs.next()) {
                imprimirFilaProducto(rs);
            }
        } catch (SQLException ex) {
            Logger.getLogger(TechStore.class.getName()).log(Level.SEVERE, "Error al listar productos", ex);
        }
    }

    private static void consultarProductoPorId() {
        String idProducto = leerTexto("Ingresa el ID del producto: ");
        ProductoRegistro producto = obtenerProducto(idProducto);

        if (producto != null) {
            System.out.println("\nPRODUCTO ENCONTRADO:");
            imprimirEncabezadoProducto();
            imprimirProducto(producto);
        } else {
            System.out.println("No se encontro un producto con ID: " + idProducto);
        }
    }

    private static void insertarProducto() {
        System.out.println("\nINSERTAR NUEVO PRODUCTO");
        String idProducto = leerTexto("ID producto (ej. p10): ");

        if (existeProducto(idProducto)) {
            System.out.println("Ya existe un producto con ese ID.");
            return;
        }

        String codigoInv = leerTexto("Codigo inventario (ej. INV-1010): ");
        String idProveedor = leerTexto("ID proveedor (PRV001, PRV002, PRV003): ");

        if (!existeProveedor(idProveedor)) {
            System.out.println("El proveedor no existe. Debes usar un ID valido de la tabla proveedores.");
            return;
        }

        String nombre = leerTexto("Nombre del producto: ");
        String categoria = leerCategoria();
        BigDecimal precio = leerDecimal("Precio: ");
        int stock = leerEntero("Stock: ");
        int activo = leerActivo("Activo (1 = si, 0 = no): ");

        String sql = """
                INSERT INTO productos
                (id_producto, codigo_inv, id_proveedor, nombre, categoria, precio, stock, activo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """;

        try (
                Connection conexion = obtenerConexion();
                PreparedStatement ps = conexion.prepareStatement(sql)
        ) {
            ps.setString(1, idProducto);
            ps.setString(2, codigoInv);
            ps.setString(3, idProveedor);
            ps.setString(4, nombre);
            ps.setString(5, categoria);
            ps.setBigDecimal(6, precio);
            ps.setInt(7, stock);
            ps.setInt(8, activo);

            int filas = ps.executeUpdate();
            if (filas > 0) {
                System.out.println("Producto insertado correctamente.");
                consultarProductoPorId(idProducto);
            }
        } catch (SQLException ex) {
            Logger.getLogger(TechStore.class.getName()).log(Level.SEVERE, "Error al insertar producto", ex);
        }
    }

    private static void actualizarProducto() {
        System.out.println("\nACTUALIZAR PRODUCTO");
        String idProducto = leerTexto("ID del producto a actualizar: ");

        ProductoRegistro productoActual = obtenerProducto(idProducto);
        if (productoActual == null) {
            System.out.println("No existe un producto con ese ID.");
            return;
        }

        System.out.println("\nANTES DEL UPDATE:");
        imprimirEncabezadoProducto();
        imprimirProducto(productoActual);

        mostrarMenuActualizacion();
        int opcionCampo = leerEntero("Selecciona el campo a actualizar: ");

        boolean actualizado = switch (opcionCampo) {
            case 1 -> actualizarCampoString(idProducto, "codigo_inv", leerTexto("Nuevo codigo inventario: "));
            case 2 -> {
                String nuevoProveedor = leerTexto("Nuevo ID proveedor (PRV001, PRV002, PRV003): ");
                if (!existeProveedor(nuevoProveedor)) {
                    System.out.println("El proveedor no existe. Cancelando actualizacion.");
                    yield false;
                }
                yield actualizarCampoString(idProducto, "id_proveedor", nuevoProveedor);
            }
            case 3 -> actualizarCampoString(idProducto, "nombre", leerTexto("Nuevo nombre del producto: "));
            case 4 -> actualizarCampoString(idProducto, "categoria", leerCategoria());
            case 5 -> actualizarCampoDecimal(idProducto, "precio", leerDecimal("Nuevo precio: "));
            case 6 -> actualizarCampoEntero(idProducto, "stock", leerEntero("Nuevo stock: "));
            case 7 -> actualizarCampoEntero(idProducto, "activo", leerActivo("Nuevo estado activo (1 = si, 0 = no): "));
            default -> {
                System.out.println("Opcion no valida. Actualizacion cancelada.");
                yield false;
            }
        };

        if (actualizado) {
            System.out.println("Producto actualizado correctamente.");
            System.out.println("\nDESPUES DEL UPDATE:");
            imprimirEncabezadoProducto();
            imprimirProducto(obtenerProducto(idProducto));
        }
    }

    private static void eliminarProducto() {
        System.out.println("\nELIMINAR PRODUCTO");
        String idProducto = leerTexto("ID del producto a eliminar: ");

        if (!existeProducto(idProducto)) {
            System.out.println("No existe un producto con ese ID.");
            return;
        }

        System.out.println("\nREGISTRO A ELIMINAR:");
        consultarProductoPorId(idProducto);

        String confirmacion = leerTexto("Seguro que deseas eliminarlo? (S/N): ");
        if (!confirmacion.equalsIgnoreCase("S")) {
            System.out.println("Eliminacion cancelada.");
            return;
        }

        String sql = "DELETE FROM productos WHERE id_producto = ?";

        try (
                Connection conexion = obtenerConexion();
                PreparedStatement ps = conexion.prepareStatement(sql)
        ) {
            ps.setString(1, idProducto);

            int filas = ps.executeUpdate();
            if (filas > 0) {
                System.out.println("Producto eliminado correctamente.");
            }
        } catch (SQLException ex) {
            Logger.getLogger(TechStore.class.getName()).log(Level.SEVERE, "Error al eliminar producto", ex);
        }
    }

    private static void consultarProductoPorId(String idProducto) {
        ProductoRegistro producto = obtenerProducto(idProducto);

        if (producto != null) {
            imprimirEncabezadoProducto();
            imprimirProducto(producto);
        } else {
            System.out.println("No se encontro un producto con ID: " + idProducto);
        }
    }

    private static void imprimirEncabezadoProducto() {
        System.out.printf("%-10s | %-12s | %-20s | %-28s | %-12s | %-15s | %-8s | %-8s | %-20s%n",
                "ID", "CODIGO", "PROVEEDOR", "NOMBRE", "CATEGORIA", "PRECIO", "STOCK", "ACTIVO", "FECHA");
        System.out.println("---------------------------------------------------------------------------------------------------------------");
    }

    private static void mostrarMenuActualizacion() {
        System.out.println("\nCAMPO A ACTUALIZAR");
        System.out.println("1. Codigo inventario");
        System.out.println("2. ID proveedor");
        System.out.println("3. Nombre");
        System.out.println("4. Categoria");
        System.out.println("5. Precio");
        System.out.println("6. Stock");
        System.out.println("7. Activo");
    }

    private static void imprimirProducto(ProductoRegistro producto) {
        if (producto == null) {
            return;
        }

        String activoTexto = producto.activo == 1 ? "SI" : "NO";
        System.out.printf("%-10s | %-12s | %-20s | %-28s | %-12s | %-15s | %-8d | %-8s | %-20s%n",
                producto.idProducto,
                producto.codigoInv,
                producto.proveedor,
                producto.nombre,
                producto.categoria,
                producto.precio,
                producto.stock,
                activoTexto,
                producto.fechaCreacion);
    }

    private static void imprimirFilaProducto(ResultSet rs) throws SQLException {
        String activoTexto = rs.getInt("activo") == 1 ? "SI" : "NO";
        System.out.printf("%-10s | %-12s | %-20s | %-28s | %-12s | %-15s | %-8s | %-8s | %-20s%n",
                rs.getString("id_producto"),
                rs.getString("codigo_inv"),
                rs.getString("proveedor"),
                rs.getString("nombre"),
                rs.getString("categoria"),
                rs.getBigDecimal("precio"),
                rs.getInt("stock"),
                activoTexto,
                rs.getTimestamp("fecha_creacion"));
    }

    private static ProductoRegistro obtenerProducto(String idProducto) {
        String sql = """
                SELECT p.id_producto, p.codigo_inv, p.id_proveedor, pr.nombre AS proveedor,
                       p.nombre, p.categoria, p.precio, p.stock, p.activo, p.fecha_creacion
                FROM productos p
                INNER JOIN proveedores pr ON p.id_proveedor = pr.id_proveedor
                WHERE p.id_producto = ?
                """;

        try (
                Connection conexion = obtenerConexion();
                PreparedStatement ps = conexion.prepareStatement(sql)
        ) {
            ps.setString(1, idProducto);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new ProductoRegistro(
                            rs.getString("id_producto"),
                            rs.getString("codigo_inv"),
                            rs.getString("id_proveedor"),
                            rs.getString("proveedor"),
                            rs.getString("nombre"),
                            rs.getString("categoria"),
                            rs.getBigDecimal("precio"),
                            rs.getInt("stock"),
                            rs.getInt("activo"),
                            rs.getTimestamp("fecha_creacion")
                    );
                }
                return null;
            }
        } catch (SQLException ex) {
            Logger.getLogger(TechStore.class.getName()).log(Level.SEVERE, "Error al consultar producto", ex);
            return null;
        }
    }

    private static boolean existeProducto(String idProducto) {
        return obtenerProducto(idProducto) != null;
    }

    private static boolean existeProveedor(String idProveedor) {
        String sql = "SELECT 1 FROM proveedores WHERE id_proveedor = ?";

        try (
                Connection conexion = obtenerConexion();
                PreparedStatement ps = conexion.prepareStatement(sql)
        ) {
            ps.setString(1, idProveedor);

            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException ex) {
            Logger.getLogger(TechStore.class.getName()).log(Level.SEVERE, "Error al validar proveedor", ex);
            return false;
        }
    }

    private static boolean actualizarCampoString(String idProducto, String campo, String valor) {
        String sql = "UPDATE productos SET " + campo + " = ? WHERE id_producto = ?";

        try (
                Connection conexion = obtenerConexion();
                PreparedStatement ps = conexion.prepareStatement(sql)
        ) {
            ps.setString(1, valor);
            ps.setString(2, idProducto);
            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            Logger.getLogger(TechStore.class.getName()).log(Level.SEVERE, "Error al actualizar producto", ex);
            return false;
        }
    }

    private static boolean actualizarCampoDecimal(String idProducto, String campo, BigDecimal valor) {
        String sql = "UPDATE productos SET " + campo + " = ? WHERE id_producto = ?";

        try (
                Connection conexion = obtenerConexion();
                PreparedStatement ps = conexion.prepareStatement(sql)
        ) {
            ps.setBigDecimal(1, valor);
            ps.setString(2, idProducto);
            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            Logger.getLogger(TechStore.class.getName()).log(Level.SEVERE, "Error al actualizar producto", ex);
            return false;
        }
    }

    private static boolean actualizarCampoEntero(String idProducto, String campo, int valor) {
        String sql = "UPDATE productos SET " + campo + " = ? WHERE id_producto = ?";

        try (
                Connection conexion = obtenerConexion();
                PreparedStatement ps = conexion.prepareStatement(sql)
        ) {
            ps.setInt(1, valor);
            ps.setString(2, idProducto);
            return ps.executeUpdate() > 0;
        } catch (SQLException ex) {
            Logger.getLogger(TechStore.class.getName()).log(Level.SEVERE, "Error al actualizar producto", ex);
            return false;
        }
    }

    private static String leerTexto(String mensaje) {
        while (true) {
            System.out.print(mensaje);
            String valor = SCANNER.nextLine().trim();

            if (!valor.isEmpty()) {
                return valor;
            }

            System.out.println("El campo no puede estar vacio.");
        }
    }

    private static int leerEntero(String mensaje) {
        while (true) {
            System.out.print(mensaje);
            String valor = SCANNER.nextLine().trim();

            try {
                return Integer.parseInt(valor);
            } catch (NumberFormatException ex) {
                System.out.println("Debes ingresar un numero entero valido.");
            }
        }
    }

    private static BigDecimal leerDecimal(String mensaje) {
        while (true) {
            System.out.print(mensaje);
            String valor = SCANNER.nextLine().trim();

            try {
                return new BigDecimal(valor);
            } catch (NumberFormatException ex) {
                System.out.println("Debes ingresar un valor decimal valido.");
            }
        }
    }

    private static int leerActivo(String mensaje) {
        while (true) {
            int valor = leerEntero(mensaje);
            if (valor == 0 || valor == 1) {
                return valor;
            }
            System.out.println("El estado activo solo puede ser 1 o 0.");
        }
    }

    private static String leerCategoria() {
        while (true) {
            System.out.print("Categoria (laptop, movil, accesorio, componente, periferico): ");
            String categoria = SCANNER.nextLine().trim().toLowerCase();

            if (categoria.equals("laptop")
                    || categoria.equals("movil")
                    || categoria.equals("accesorio")
                    || categoria.equals("componente")
                    || categoria.equals("periferico")) {
                return categoria;
            }

            System.out.println("Categoria no valida. Intenta de nuevo.");
        }
    }

    private static String leerTextoOpcional(String mensaje, String valorActual) {
        System.out.print(mensaje + " [" + valorActual + "]: ");
        String valor = SCANNER.nextLine().trim();
        return valor.isEmpty() ? valorActual : valor;
    }

    private static BigDecimal leerDecimalOpcional(String mensaje, BigDecimal valorActual) {
        while (true) {
            System.out.print(mensaje + " [" + valorActual + "]: ");
            String valor = SCANNER.nextLine().trim();

            if (valor.isEmpty()) {
                return valorActual;
            }

            try {
                return new BigDecimal(valor);
            } catch (NumberFormatException ex) {
                System.out.println("Debes ingresar un valor decimal valido.");
            }
        }
    }

    private static int leerEnteroOpcional(String mensaje, int valorActual) {
        while (true) {
            System.out.print(mensaje + " [" + valorActual + "]: ");
            String valor = SCANNER.nextLine().trim();

            if (valor.isEmpty()) {
                return valorActual;
            }

            try {
                return Integer.parseInt(valor);
            } catch (NumberFormatException ex) {
                System.out.println("Debes ingresar un numero entero valido.");
            }
        }
    }

    private static int leerActivoOpcional(String mensaje, int valorActual) {
        while (true) {
            int valor = leerEnteroOpcional(mensaje, valorActual);
            if (valor == 0 || valor == 1) {
                return valor;
            }
            System.out.println("El estado activo solo puede ser 1 o 0.");
        }
    }

    private static String leerCategoriaOpcional(String valorActual) {
        while (true) {
            System.out.print("Categoria (laptop, movil, accesorio, componente, periferico) [" + valorActual + "]: ");
            String categoria = SCANNER.nextLine().trim().toLowerCase();

            if (categoria.isEmpty()) {
                return valorActual;
            }

            if (categoria.equals("laptop")
                    || categoria.equals("movil")
                    || categoria.equals("accesorio")
                    || categoria.equals("componente")
                    || categoria.equals("periferico")) {
                return categoria;
            }

            System.out.println("Categoria no valida. Intenta de nuevo.");
        }
    }

    private static final class ProductoRegistro {
        private final String idProducto;
        private final String codigoInv;
        private final String idProveedor;
        private final String proveedor;
        private final String nombre;
        private final String categoria;
        private final BigDecimal precio;
        private final int stock;
        private final int activo;
        private final Timestamp fechaCreacion;

        private ProductoRegistro(String idProducto, String codigoInv, String idProveedor, String proveedor,
                String nombre, String categoria, BigDecimal precio, int stock, int activo, Timestamp fechaCreacion) {
            this.idProducto = idProducto;
            this.codigoInv = codigoInv;
            this.idProveedor = idProveedor;
            this.proveedor = proveedor;
            this.nombre = nombre;
            this.categoria = categoria;
            this.precio = precio;
            this.stock = stock;
            this.activo = activo;
            this.fechaCreacion = fechaCreacion;
        }
    }
}
