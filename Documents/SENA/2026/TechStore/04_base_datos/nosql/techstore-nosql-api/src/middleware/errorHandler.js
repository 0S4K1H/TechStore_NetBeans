/**
 * Respuesta para rutas inexistentes.
 */
const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Ruta no encontrada: ${req.originalUrl}`
  });
};

/**
 * Convertimos errores comunes de Mongoose en mensajes claros para el video y Postman.
 */
const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'El identificador enviado no es valido'
    });
  }

  if (err.code === 11000) {
    const duplicatedField = Object.keys(err.keyValue || {})[0] || 'campo';
    return res.status(400).json({
      success: false,
      message: `Ya existe un registro con el mismo valor en ${duplicatedField}`
    });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'La informacion enviada no cumple las reglas del modelo',
      errors: Object.values(err.errors).map((item) => item.message)
    });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  console.error('Error no controlado:', err);
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
};

module.exports = {
  notFound,
  errorHandler
};
