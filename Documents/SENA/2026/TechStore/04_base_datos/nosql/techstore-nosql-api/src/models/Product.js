const mongoose = require('mongoose');

/**
 * Esquema de producto para la evidencia NoSQL.
 * El modelo usa validaciones para demostrar que la informacion
 * queda controlada antes de guardarse en MongoDB.
 */
const productSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: [true, 'El SKU es obligatorio'],
      trim: true,
      uppercase: true,
      unique: true,
      maxlength: 40
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: 3,
      maxlength: 120
    },
    descripcion: {
      type: String,
      trim: true,
      default: ''
    },
    marca: {
      type: String,
      required: [true, 'La marca es obligatoria'],
      trim: true,
      maxlength: 60
    },
    categoria: {
      type: String,
      required: [true, 'La categoria es obligatoria'],
      enum: ['portatiles', 'moviles', 'accesorios', 'componentes', 'perifericos'],
      lowercase: true,
      trim: true
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo']
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0
    },
    imagen: {
      type: String,
      trim: true,
      default: ''
    },
    activo: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = mongoose.model('Producto', productSchema, 'productos');
