const { Router } = require('express');

const {
  crearMensaje,
  obtenerMensajes
} = require('../controllers/contacto.controller.js');

const verificarToken = require('../middlewares/auth.middleware.js');

const router = Router();

// Ruta pública: cualquier visitante puede enviar un mensaje.
router.post('/', crearMensaje);

// Ruta privada: solamente un administrador autenticado puede consultar.
router.get('/', verificarToken, obtenerMensajes);

module.exports = router;