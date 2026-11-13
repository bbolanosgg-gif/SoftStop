
require('dotenv').config();

// =====================================================
// 1. IMPORTACIONES
// =====================================================

const cors = require('cors');
const express = require('express');

// Función que conecta nuestro backend con MongoDB Atlas.
const conectarBD = require('./config/db.js');

// Rutas de nuestra API.
const herramientasRoutes = require('./routes/herramientas.routes.js');
const contactoRoutes = require('./routes/contacto.routes.js');
const authRoutes = require('./routes/auth.routes.js');
const iaRoutes = require('./routes/ia.routes.js');
const usuariosRoutes = require('./routes/usuarios.routes.js');

// Middleware para manejar los errores del servidor.
const manejarErrores = require('./middlewares/manejarErrores.js');

// Creamos nuestra aplicación de Express.
const app = express();


// =====================================================
// 2. CONFIGURACIÓN DEL SERVIDOR
// =====================================================

/*
 * TRUST PROXY
 *
 * Render recibe las peticiones a través de un proxy.
 *
 * Esta opción permite que Express identifique
 * correctamente la IP del visitante.
 *
 * Por seguridad, todavía no la activamos:
 * debemos comprobar primero la configuración
 * real del proxy utilizado por Render.
 *
 * Cuando confirmemos que hay exactamente un
 * salto de proxy confiable, podremos configurar:
 *
 * app.set('trust proxy', 1);
 */


// =====================================================
// 3. MIDDLEWARES GLOBALES
// =====================================================

// CORS permite que nuestro frontend se comunique
// con el backend desde los orígenes autorizados.
app.use(cors({
  origin: [
    'https://soft-stop.vercel.app',
    'http://localhost:5173'
  ]
}));

// Permite que Express lea información JSON
// enviada desde React mediante req.body.
app.use(express.json());


// =====================================================
// 4. RUTAS DE LA API
// =====================================================

// Herramientas disponibles en el catálogo.
app.use('/api/herramientas', herramientasRoutes);

// Mensajes enviados desde Contacto.
app.use('/api/contacto', contactoRoutes);

// Inicio de sesión y autenticación.
app.use('/api/auth', authRoutes);

// Check-in inteligente y configuración de Gemini.
// IMPORTANTE: se registra UNA SOLA VEZ.
app.use('/api/ia', iaRoutes);

// Administración de usuarios.
app.use('/api/usuarios', usuariosRoutes);


// =====================================================
// 5. RUTA PRINCIPAL
// =====================================================

// Permite comprobar si el backend está funcionando.
app.get('/', (req, res) => {
  res.status(200).json({
    mensaje: 'La ejecución de la API de SoftStop y la BD está funcionando.'
  });
});


// =====================================================
// 6. MANEJO DE ERRORES
// =====================================================

// Se coloca después de las rutas para gestionar
// los errores que se produzcan en los controladores.
app.use(manejarErrores);


// =====================================================
// 7. INICIAR EL SERVIDOR
// =====================================================

// Render proporciona PORT mediante una variable de entorno.
// En local utilizamos el puerto 3000 si no está definido.
const PORT = process.env.PORT || 3000;

// Primero conectamos MongoDB y después encendemos Express.
conectarBD()
  .then(() => {

    // 0.0.0.0 permite que Render reciba conexiones.
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor de SoftStop activo en el puerto ${PORT}`);
    });

  })
  .catch((error) => {

    // Si falla MongoDB, no iniciamos el servidor.
    console.error('Error al iniciar SoftStop:', error.message);
    process.exit(1);

  });
