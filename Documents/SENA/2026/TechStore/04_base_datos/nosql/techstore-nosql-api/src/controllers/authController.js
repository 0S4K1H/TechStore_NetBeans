const User = require('../models/User');

const normalizeAuthBody = (body) => ({
  usuario: typeof body.usuario === 'string' ? body.usuario.trim().toLowerCase() : body.usuario,
  nombre: typeof body.nombre === 'string' ? body.nombre.trim() : body.nombre,
  email: typeof body.email === 'string' ? body.email.trim().toLowerCase() : body.email,
  password: typeof body.password === 'string' ? body.password.trim() : body.password,
  rol: typeof body.rol === 'string' ? body.rol.trim().toLowerCase() : body.rol
});

/**
 * POST /api/auth/register
 * Registra un usuario nuevo en MongoDB.
 */
const register = async (req, res, next) => {
  try {
    const payload = normalizeAuthBody(req.body);

    if (!payload.usuario || !payload.nombre || !payload.email || !payload.password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario, nombre, correo y contrasena son obligatorios'
      });
    }

    const user = await User.create({
      usuario: payload.usuario,
      nombre: payload.nombre,
      email: payload.email,
      passwordHash: User.hashPassword(payload.password),
      rol: payload.rol || 'cliente',
      activo: true
    });

    return res.status(201).json({
      success: true,
      message: 'Usuario registrado correctamente',
      data: user.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Recibe usuario y contrasena. Si coinciden, devuelve autenticacion satisfactoria.
 */
const login = async (req, res, next) => {
  try {
    const payload = normalizeAuthBody(req.body);

    if (!payload.usuario || !payload.password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contrasena son obligatorios'
      });
    }

    const user = await User.findOne({
      activo: true,
      $or: [{ usuario: payload.usuario }, { email: payload.usuario }]
    });

    if (!user || !user.validarPassword(payload.password)) {
      return res.status(401).json({
        success: false,
        message: 'Error en la autenticacion'
      });
    }

    return res.json({
      success: true,
      message: 'Autenticacion satisfactoria',
      data: user.toPublicJSON()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};
