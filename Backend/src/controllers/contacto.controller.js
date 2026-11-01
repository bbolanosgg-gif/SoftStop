const Mensaje = require('../models/Mensaje.js');

// 1. Guardar un mensaje enviado desde el formulario público de Contacto
async function crearMensaje(req, res, next) {
  try {
    const { nombre, email, asunto, mensaje } = req.body;

    // Validación básica con condicional if como se vio en clase
    if (!nombre || !email || !asunto || !mensaje) {
      return res.status(400).json({
        error: "Todos los campos (nombre, email, asunto y mensaje) son obligatorios."
      });
    }

    const nuevoMensaje = await Mensaje.create({
      nombre,
      email,
      asunto,
      mensaje
    });

    res.status(201).json({
      mensaje: "Tu mensaje fue recibido con éxito.",
      datos: nuevoMensaje
    });
  } catch (error) {
    next(error);
  }
}

// 2. Obtener todos los mensajes para mostrarlos en el Panel Admin
async function obtenerMensajes(req, res, next) {
  try {
    const mensajes = await Mensaje.find().sort({ createdAt: -1 });
    res.status(200).json(mensajes);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  crearMensaje,
  obtenerMensajes
};