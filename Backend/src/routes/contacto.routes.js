const { Router } = require('express');
const { crearMensaje, obtenerMensajes } = require('../controllers/contacto.controller.js');

const router = Router();

// Endpoints para el formulario de contacto (/api/contacto)
router.get("/", obtenerMensajes);
router.post("/", crearMensaje);

module.exports = router;