
const { Router } = require('express');

const {
  crearMensaje,
  obtenerMensajes,
  marcarMensajeLeido,
  eliminarMensaje
} = require('../controllers/contacto.controller.js');

// Middleware para comprobar el JWT y el rol administrador.
const verificarToken = require('../middlewares/auth.middleware.js');

const router = Router();

// PÚBLICA: permite enviar mensajes desde Contacto.
router.post("/", crearMensaje);

// PRIVADAS: solamente para administradores.
router.get("/", verificarToken, obtenerMensajes);

router.put("/:id/leido", verificarToken, marcarMensajeLeido);

router.delete("/:id", verificarToken, eliminarMensaje);

module.exports = router;
