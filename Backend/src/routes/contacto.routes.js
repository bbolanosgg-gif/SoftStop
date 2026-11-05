const { Router } = require('express');
const {
  crearMensaje,
  obtenerMensajes,
  marcarMensajeLeido, // NUEVO
  eliminarMensaje     // NUEVO
} = require('../controllers/contacto.controller.js');

const router = Router();

// Endpoints para el formulario de contacto (/api/contacto)
router.get("/", obtenerMensajes);                // GET    /api/contacto
router.post("/", crearMensaje);                  // POST   /api/contacto
router.put("/:id/leido", marcarMensajeLeido);    // PUT    /api/contacto/:id/leido   (NUEVO)
router.delete("/:id", eliminarMensaje);          // DELETE /api/contacto/:id         (NUEVO)

module.exports = router;