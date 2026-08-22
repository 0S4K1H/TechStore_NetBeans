const mongoose = require('mongoose');

/**
 * Conecta la API a MongoDB.
 * La base de datos se crea automaticamente cuando se inserta el primer documento.
 */
const connectDatabase = async () => {
  const mongoUri =
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/techstore_nosql';

  mongoose.set('strictQuery', true);

  try {
    await mongoose.connect(mongoUri);
    console.log(
      `MongoDB conectado en ${mongoose.connection.host}:${mongoose.connection.port}/${mongoose.connection.name}`
    );
  } catch (error) {
    console.error('No fue posible conectar MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDatabase;
