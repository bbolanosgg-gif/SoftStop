
const { Router } = require('express');

const {
  obtenerUsuarios,
  cambiarEstadoUsuario
} = require('../controllers/usuarios.controller.js');

// Middleware que comprueba el JWT y el rol administrador.
const verificarToken = require('../middlewares/auth.middleware.js');

const router = Router();

// Solo el administrador puede consultar usuarios.
router.get("/", verificarToken, obtenerUsuarios);

// Solo el administrador puede activar o desactivar usuarios.
router.put("/:id/estado", verificarToken, cambiarEstadoUsuario);

module.exports = router;
