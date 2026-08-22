const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Se usa body-parser porque asi lo solicita la evidencia y para dejarlo visible en el video.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Registro simple de peticiones para que en el video se vea el trafico de la API.
app.use((req, res, next) => {
  const stamp = new Date().toISOString();
  console.log(`[${stamp}] ${req.method} ${req.originalUrl}`);
  next();
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'TechStore NoSQL API en linea'
  });
});

app.use('/api/productos', productRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
