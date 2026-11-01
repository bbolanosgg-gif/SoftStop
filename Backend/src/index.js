require('dotenv').config(); // Carga las variables de entorno desde el archivo .env
const cors = require('cors');
const express = require('express');
const conectarBD = require('./config/db.js');

// Importamos las rutas de nuestra API
const herramientasRoutes = require('./routes/herramientas.routes.js');
const contactoRoutes = require('./routes/contacto.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const iaRoutes = require('./routes/ia.routes.js');

// Importamos el middleware de errores
const manejarErrores = require('./middlewares/manejarErrores.js');

const app = express();

// Middlewares globales
app.use(cors()); // Permite que el Frontend en React se comunique con este Backend
app.use(express.json()); // Permite leer datos en formato JSON enviados en req.body

// Endpoint raíz de verificación
app.get("/", (req, res) => {
  res.status(200).json({
    mensaje: "La ejecución de la API de SoftStop y la BD está funcionando."
  });
});

// Enlazamos las rutas con sus prefijos
app.use('/api/herramientas', herramientasRoutes);
app.use('/api/contacto', contactoRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ia', iaRoutes);

// Middleware para manejo de errores (siempre va al final de las rutas)
app.use(manejarErrores);

const PORT = process.env.PORT || 3000;

// Primero conectamos a MongoDB y luego encendemos el servidor
conectarBD().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor de SoftStop corriendo en http://localhost:${PORT}`);
  });
});