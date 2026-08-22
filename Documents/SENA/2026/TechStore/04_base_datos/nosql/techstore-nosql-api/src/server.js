require('dotenv').config();

const app = require('./app');
const connectDatabase = require('./config/db');

const PORT = process.env.PORT || 4000;

const bootstrap = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Servidor TechStore NoSQL listo en http://localhost:${PORT}`);
  });
};

bootstrap().catch((error) => {
  console.error('Error al iniciar la aplicacion:', error);
  process.exit(1);
});
