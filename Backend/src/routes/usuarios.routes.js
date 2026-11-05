const { Router } = require('express');
const {
  obtenerUsuarios,
  cambiarEstadoUsuario
} = require('../controllers/usuarios.controller.js');

const router = Router();

// Endpoints para la gestión de usuarios (/api/usuarios)
router.get("/", obtenerUsuarios);                  // GET /api/usuarios
router.put("/:id/estado", cambiarEstadoUsuario);   // PUT /api/usuarios/:id/estado

module.exports = router;