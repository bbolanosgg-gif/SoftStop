const Mensaje = require('../models/Mensaje.js');

// 1. Guardar un mensaje enviado desde el formulario público de Contacto
async function crearMensaje(req, res, next) {
  try {
    const { nombre, email, asunto, mensaje } = req.body;

    // Validación básica con condicional if como se vio en clase
    if (
  !nombre?.trim() ||
  !email?.trim() ||
  !asunto?.trim() ||
  !mensaje?.trim()
) {
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

// 3. NUEVO: Marcar un mensaje como leído o como no leído
// PUT /api/contacto/:id/leido
async function marcarMensajeLeido(req, res, next) {
  try {
    const { leido } = req.body;

    // "leido" debe ser true o false (un booleano)
    if (typeof leido !== 'boolean') {
      return res.status(400).json({
        error: "El campo 'leido' debe ser true o false."
      });
    }

    const mensajeActualizado = await Mensaje.findByIdAndUpdate(
      req.params.id,
      { leido },
      { returnDocument: 'after', runValidators: true }
    );

    if (!mensajeActualizado) {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }

    res.status(200).json(mensajeActualizado);
  } catch (error) {
    next(error);
  }
}

// 4. NUEVO: Eliminar un mensaje por su ID
// DELETE /api/contacto/:id
async function eliminarMensaje(req, res, next) {
  try {
    const mensajeEliminado = await Mensaje.findByIdAndDelete(req.params.id);

    if (!mensajeEliminado) {
      return res.status(404).json({ error: "Mensaje no encontrado" });
    }

    res.status(200).json({ mensaje: "Mensaje eliminado correctamente" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  crearMensaje,
  obtenerMensajes,
  marcarMensajeLeido, // NUEVO
  eliminarMensaje     // NUEVO
};