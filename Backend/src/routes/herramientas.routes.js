const { Router } = require('express');
const {
  obtenerHerramientas,
  crearHerramienta,
  actualizarHerramienta,
  eliminarHerramienta
} = require('../controllers/herramientas.controller.js');

const router = Router();

// Endpoints para el catálogo de herramientas (/api/herramientas)
router.get("/", obtenerHerramientas);
router.post("/", crearHerramienta);
router.put("/:id", actualizarHerramienta);
router.delete("/:id", eliminarHerramienta);

module.exports = router;