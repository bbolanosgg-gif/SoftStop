
const { Router } = require('express');

// =====================================================
// 1. IMPORTACIONES
// =====================================================

// Middleware que limita las solicitudes repetidas
// para evitar abusos del asistente.
const limiteIA = require('../middlewares/limiteIA.middleware.js');

// Modelo de MongoDB donde guardamos:
// - Si Gemini está activo.
// - El límite de consultas.
// - Las consultas utilizadas.
const ConfiguracionIA = require('../models/ConfiguracionIA.js');

// Controlador que recibe el mensaje y consulta Gemini.
const {
  checkinInteligente
} = require('../controllers/ia.controller.js');

// Controladores para administrar Gemini desde el Panel Admin.
const {
  obtenerConfiguracion,
  actualizarConfiguracion,
  reiniciarConsultas
} = require('../controllers/configuracionIA.controller.js');

// Middleware que verifica el JWT y el rol administrador.
const verificarToken = require('../middlewares/auth.middleware.js');

// Creamos el enrutador de Express.
const router = Router();


// =====================================================
// 2. RUTA PÚBLICA: CONSULTAR DISPONIBILIDAD
// =====================================================

/*
 * GET /api/ia/estado
 *
 * Esta ruta será utilizada por la flor flotante
 * que aparecerá en la landing de SoftStop.
 *
 * No necesita JWT porque cualquier visitante
 * debe poder consultar si Check-in está disponible.
 *
 * IMPORTANTE:
 * Solamente devuelve true o false.
 * No permite modificar MongoDB.
 */

router.get('/estado', async (req, res) => {

  try {

    // Buscamos en MongoDB la configuración del Check-in.
    const configuracion = await ConfiguracionIA.findOne({
      nombre: 'checkin'
    });

    /*
     * Para considerar disponible al asistente,
     * deben cumplirse estas tres condiciones:
     *
     * 1. La variable del servidor permite utilizar Gemini.
     * 2. El administrador activó Check-in en MongoDB.
     * 3. Todavía quedan consultas disponibles.
     */

    const disponible =
      process.env.CHECKIN_IA_HABILITADO === 'true' &&
      configuracion?.activo === true &&
      configuracion.consultasUsadas < configuracion.limiteConsultas;

    // Devolvemos únicamente el estado público.
    return res.status(200).json({
      disponible: disponible
    });

  } catch (error) {

    // Registramos el error en la terminal de Express.
    console.error(
      'Error al consultar disponibilidad de IA:',
      error.message
    );

    // Si no podemos consultar MongoDB,
    // informamos que el asistente no está disponible.
    return res.status(503).json({
      disponible: false
    });

  }

});


// =====================================================
// 3. RUTA PÚBLICA: CHAT CON GEMINI
// =====================================================

/*
 * POST /api/ia/checkin
 *
 * Recibe los mensajes escritos por los estudiantes.
 *
 * Primero ejecuta limiteIA para controlar
 * las solicitudes repetidas por IP.
 *
 * Después ejecuta checkinInteligente, que verifica
 * en MongoDB si Gemini está habilitado y
 * si todavía quedan consultas disponibles.
 *
 * No requiere inicio de sesión.
 */

router.post(
  '/checkin',
  limiteIA,
  checkinInteligente
);


// =====================================================
// 4. RUTAS PRIVADAS DEL ADMINISTRADOR
// =====================================================

/*
 * Estas rutas SÍ requieren JWT.
 *
 * El middleware verificarToken comprueba
 * que la solicitud provenga de un administrador.
 */


// GET: consultar la configuración completa de Gemini.
// Se utiliza para mostrar los datos en el Panel Admin.
router.get(
  '/configuracion',
  verificarToken,
  obtenerConfiguracion
);


// PUT: activar/desactivar Gemini y cambiar el límite.
// Los cambios se guardan en MongoDB.
router.put(
  '/configuracion',
  verificarToken,
  actualizarConfiguracion
);


// PUT: reiniciar el contador de consultas utilizadas.
// No modifica el límite ni el estado de activación.
router.put(
  '/configuracion/reiniciar',
  verificarToken,
  reiniciarConsultas
);


// =====================================================
// 5. EXPORTACIÓN
// =====================================================

// Exportamos las rutas para que index.js
// pueda utilizarlas mediante app.use().
module.exports = router;
