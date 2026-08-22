const Product = require('../models/Product');

const normalizeProductBody = (body) => ({
  ...body,
  sku: typeof body.sku === 'string' ? body.sku.trim().toUpperCase() : body.sku,
  nombre: typeof body.nombre === 'string' ? body.nombre.trim() : body.nombre,
  descripcion:
    typeof body.descripcion === 'string' ? body.descripcion.trim() : body.descripcion,
  marca: typeof body.marca === 'string' ? body.marca.trim() : body.marca,
  categoria:
    typeof body.categoria === 'string' ? body.categoria.trim().toLowerCase() : body.categoria,
  imagen: typeof body.imagen === 'string' ? body.imagen.trim() : body.imagen
});

/**
 * GET /api/productos
 * Devuelve todos los productos registrados.
 */
const listProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/productos/:id
 * Busca un producto por su identificador de MongoDB.
 */
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    return res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/productos
 * Crea un nuevo producto en la coleccion.
 */
const createProduct = async (req, res, next) => {
  try {
    const payload = normalizeProductBody(req.body);
    const product = await Product.create(payload);

    return res.status(201).json({
      success: true,
      message: 'Producto creado correctamente',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/productos/:id
 * Actualiza los campos enviados del producto.
 */
const updateProduct = async (req, res, next) => {
  try {
    const payload = normalizeProductBody(req.body);

    const product = await Product.findByIdAndUpdate(req.params.id, payload, {
      returnDocument: 'after',
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    return res.json({
      success: true,
      message: 'Producto actualizado correctamente',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/productos/:id
 * Elimina un producto de la coleccion.
 */
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    return res.json({
      success: true,
      message: 'Producto eliminado correctamente',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
