const mongoose = require('mongoose');
const crypto = require('crypto');

/**
 * Esquema de usuario para la evidencia de servicios web.
 * El campo passwordHash guarda la contrasena transformada para no persistirla
 * en texto plano dentro de MongoDB.
 */
const userSchema = new mongoose.Schema(
  {
    usuario: {
      type: String,
      required: [true, 'El usuario es obligatorio'],
      trim: true,
      lowercase: true,
      unique: true,
      minlength: 3,
      maxlength: 40
    },
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: 80
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 120
    },
    passwordHash: {
      type: String,
      required: [true, 'La contrasena es obligatoria']
    },
    rol: {
      type: String,
      enum: ['cliente', 'empleado', 'administrador'],
      default: 'cliente'
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

userSchema.statics.hashPassword = function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password)).digest('hex');
};

userSchema.methods.validarPassword = function validarPassword(password) {
  return this.passwordHash === this.constructor.hashPassword(password);
};

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    _id: this._id,
    usuario: this.usuario,
    nombre: this.nombre,
    email: this.email,
    rol: this.rol,
    activo: this.activo,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('Usuario', userSchema, 'usuarios');
