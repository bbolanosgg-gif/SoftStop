const { Router } = require('express');
const { iniciarSesion, registrarUsuario } = require('../controllers/auth.controller.js');

const router = Router();

router.post("/login", iniciarSesion);       // /api/auth/login
router.post("/registro", registrarUsuario); // /api/auth/registro

module.exports = router;