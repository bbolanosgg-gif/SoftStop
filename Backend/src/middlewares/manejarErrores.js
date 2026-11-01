// Middleware centralizado para capturar errores en las peticiones
function manejarErrores(err, req, res, next) {
  // 1. Errores cuando faltan datos obligatorios en el Schema de Mongoose
  if (err.name === "ValidationError") {
    const errores = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      error: "Datos inválidos",
      detalle: errores
    });
  }

  // 2. Error cuando se envía un ID en la URL que no tiene el formato de MongoDB
  if (err.name === "CastError") {
    return res.status(400).json({
      error: "El valor " + err.value + " no es un ID válido."
    });
  }

  // 3. Cualquier otro error inesperado del servidor
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
}

module.exports = manejarErrores;