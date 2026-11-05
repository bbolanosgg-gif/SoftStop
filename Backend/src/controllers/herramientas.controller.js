const Herramienta = require('../models/Herramienta.js');
const herramientasIniciales = require('../data/herramientasIniciales.js');

// 1. Obtener todas las herramientas del catálogo
async function obtenerHerramientas(req, res, next) {
  try {
    let lista = await Herramienta.find().sort({ nombre: 1 });

    // Si la base de datos está vacía la primera vez, insertamos las herramientas base de SoftStop
    if (lista.length === 0) {
      lista = await Herramienta.insertMany(herramientasIniciales);
    }

    res.status(200).json(lista);
  } catch (error) {
    next(error);
  }
}

// 2. Crear una nueva herramienta desde el Panel Admin
async function crearHerramienta(req, res, next) {
  try {
    const nuevaHerramienta = await Herramienta.create(req.body);
    res.status(201).json(nuevaHerramienta);
  } catch (error) {
    next(error);
  }
}

// 3. Actualizar una herramienta existente por su ID.
// Sirve para dos cosas del Panel Admin:
//   - Editar los datos (nombre, descripción, etc.) con el formulario
//   - Mostrar u ocultar la herramienta (enviando solo { activa: true/false })
async function actualizarHerramienta(req, res, next) {
  try {
    const herramientaActualizada = await Herramienta.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,          // Devuelve el documento ya actualizado
        runValidators: true // Aplica las reglas del esquema (required, enum, maxlength...)
      }
    );

    if (!herramientaActualizada) {
      return res.status(404).json({ error: "Herramienta no encontrada" });
    }

    res.status(200).json(herramientaActualizada);
  } catch (error) {
    next(error); // Si falla una validación, manejarErrores responde con un 400
  }
}

// 4. Eliminar una herramienta por su ID
async function eliminarHerramienta(req, res, next) {
  try {
    const herramientaEliminada = await Herramienta.findByIdAndDelete(req.params.id);

    if (!herramientaEliminada) {
      return res.status(404).json({ error: "Herramienta no encontrada" });
    }

    res.status(200).json({ mensaje: "Herramienta eliminada correctamente" });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  obtenerHerramientas,
  crearHerramienta,
  actualizarHerramienta,
  eliminarHerramienta
};