const { Router } = require('express');
const { recomendarHerramienta } = require('../controllers/ia.controller.js');

const router = Router();

// Endpoint para el recomendador de IA (/api/ia/recomendar)
router.post("/recomendar", recomendarHerramienta);

module.exports = router;