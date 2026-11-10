require('dotenv').config(); // Carga las variables de entorno desde el archivo .env
const cors = require('cors');
const express = require('express');
const conectarBD = require('./config/db.js');

// Importamos las rutas de nuestra API
const herramientasRoutes = require('./routes/herramientas.routes.js');
const contactoRoutes = require('./routes/contacto.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const iaRoutes = require('./routes/ia.routes.js');
const usuariosRoutes = require('./routes/usuarios.routes.js'); // NUEVO

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
app.use('/api/usuarios', usuariosRoutes); 

// Middleware para manejo de errores
app.use(manejarErrores);

const PORT = process.env.PORT || 3000;

// Primero conectamos a MongoDB y luego encendemos el servidor
conectarBD()
  .then(() => {
    // Iniciamos Express después de conectar la base de datos.
    // 0.0.0.0 permite recibir conexiones desde Render.
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor de SoftStop activo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    // Si MongoDB falla, mostramos el error y detenemos el servidor.
    console.error('Error al iniciar SoftStop:', error.message);
    process.exit(1);
  });