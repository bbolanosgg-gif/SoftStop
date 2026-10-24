const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// true solo si el valor es un texto (string). Lo usamos para rechazar objetos raros.
const esTexto = (valor) => typeof valor === 'string';

router.post('/registro', async (req, res) => {
    try {
        // "?? {}" significa: si req.body no existe, usa un objeto vacío.
        
        const { nombre, email, password } = req.body ?? {};

        if (!esTexto(nombre) || !esTexto(email) || !esTexto(password)) {
            return res.status(400).json({ error: "Debes enviar nombre, email y password" });
        }

        const nombreLimpio = nombre.trim();
        const emailLimpio = email.trim().toLowerCase();

        if (!nombreLimpio || !emailLimpio || !password) {
            return res.status(400).json({ error: "Debes enviar nombre, email y password" });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres" });
        }

        const existe = await User.findOne({ email: emailLimpio });

        if (existe) {
            return res.status(409).json({ error: "Ese correo ya está registrado" });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const nuevoUsuario = await User.create({
            nombre: nombreLimpio,
            email: emailLimpio,
            passwordHash
        });

        res.status(201).json({
            id: nuevoUsuario._id,
            nombre: nuevoUsuario.nombre,
            email: nuevoUsuario.email
        });
    } catch (error) {
        // 11000 = MongoDB rechazó un valor repetido en un campo "unique".
        // Pasa si dos registros con el mismo correo llegan casi a la vez.
        if (error.code === 11000) {
            return res.status(409).json({ error: "Ese correo ya está registrado" });
        }
        console.error('Error en /auth/registro:', error.message);
        res.status(500).json({ error: "Error del servidor" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body ?? {};

        if (!esTexto(email) || !esTexto(password)) {
            return res.status(400).json({ error: "Debes enviar email y password" });
        }

        const emailLimpio = email.trim().toLowerCase();

        if (!emailLimpio || !password) {
            return res.status(400).json({ error: "Debes enviar email y password" });
        }

        const usuario = await User.findOne({ email: emailLimpio });
        const coincide = usuario && await bcrypt.compare(password, usuario.passwordHash);

        if (!coincide) {
            return res.status(401).json({ error: "Correo o contraseña incorrectos" });
        }

        res.json({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email
        });
    } catch (error) {
        console.error('Error en /auth/login:', error.message);
        res.status(500).json({ error: "Error del servidor" });
    }
});

module.exports = router;