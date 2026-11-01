const { Router } = require('express');
const { loginAdmin } = require('../controllers/auth.controller.js');

const router = Router();

// Endpoint para iniciar sesión (/api/auth/login)
router.post("/login", loginAdmin);

module.exports = router;