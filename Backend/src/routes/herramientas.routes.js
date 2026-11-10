
const { Router } = require('express');

const {
  obtenerHerramientas,
  crearHerramienta,
  actualizarHerramienta,
  eliminarHerramienta
} = require('../controllers/herramientas.controller.js');

// Middleware que verifica si el usuario es administrador.
const verificarToken = require('../middlewares/auth.middleware.js');

const router = Router();

// PÚBLICA: cualquier visitante puede consultar el catálogo.
router.get("/", obtenerHerramientas);

// PRIVADAS: requieren un token válido de administrador.
router.post("/", verificarToken, crearHerramienta);

router.put("/:id", verificarToken, actualizarHerramienta);

router.delete("/:id", verificarToken, eliminarHerramienta);

module.exports = router;
