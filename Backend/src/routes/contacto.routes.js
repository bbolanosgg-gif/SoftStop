const express = require('express');
const Mensaje = require('../models/Mensaje');

const router = express.Router();

const ASUNTOS = ['duda', 'sugerencia', 'otro'];
const esTexto = (valor) => typeof valor === 'string';
const emailValido = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// POST /contacto  (pública: cualquier visitante puede escribirnos)
router.post('/', async (req, res) => {
    try {
        const { nombre, email, asunto, mensaje } = req.body ?? {};

        // Los cuatro campos deben existir y ser texto
        if (![nombre, email, asunto, mensaje].every(esTexto)) {
            return res.status(400).json({ error: 'Debes enviar nombre, email, asunto y mensaje' });
        }

        // Armamos un objeto NUEVO con solo lo que permitimos (ver nota abajo)
        const datos = {
            nombre: nombre.trim(),
            email: email.trim().toLowerCase(),
            asunto,
            mensaje: mensaje.trim()
        };

        if (!datos.nombre || datos.nombre.length > 100) {
            return res.status(400).json({ error: 'El nombre es obligatorio (máximo 100 caracteres)' });
        }
        if (!emailValido(datos.email) || datos.email.length > 150) {
            return res.status(400).json({ error: 'El correo no es válido' });
        }
        if (!ASUNTOS.includes(datos.asunto)) {
            return res.status(400).json({ error: 'El asunto no es válido' });
        }
        if (datos.mensaje.length < 10 || datos.mensaje.length > 2000) {
            return res.status(400).json({ error: 'El mensaje debe tener entre 10 y 2000 caracteres' });
        }

        await Mensaje.create(datos);

        res.status(201).json({ mensaje: 'Mensaje recibido' });
    } catch (error) {
        console.error('Error en /contacto:', error.message);
        res.status(500).json({ error: 'Error del servidor' });
    }
});

module.exports = router;