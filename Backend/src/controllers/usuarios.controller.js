const Usuario = require('../models/Usuario.js');

// 1. Obtener la lista de usuarios para mostrarla en el Panel Admin
// GET /api/usuarios
async function obtenerUsuarios(req, res, next) {
  try {
    // Solo listamos a los usuarios con rol "cliente".
    // Así el admin nunca puede desactivarse a sí mismo y quedarse sin acceso.
    //
    // .select('-passwordHash') le dice a Mongoose: "trae todos los campos
    // EXCEPTO passwordHash" (el menos significa excluir).
    // Así la contraseña cifrada nunca viaja hasta el navegador.
    const usuarios = await Usuario.find({ rol: 'cliente' })
      .select('-passwordHash')
      .sort({ createdAt: -1 }); // los más recientes primero

    res.status(200).json(usuarios);
  } catch (error) {
    next(error); // lo atrapa el middleware manejarErrores
  }
}

// 2. Cambiar el estado de un usuario (activo / inactivo)
// PUT /api/usuarios/:id/estado
async function cambiarEstadoUsuario(req, res, next) {
  try {
    const { estado } = req.body;

    // Validación básica con if, como en tus otros controladores
    if (estado !== 'activo' && estado !== 'inactivo') {
      return res.status(400).json({
        error: "El estado debe ser 'activo' o 'inactivo'."
      });
    }

    // Buscamos por ID Y que sea cliente. Si alguien intentara desactivar
    // a un admin enviando su ID, no lo encontraría y respondería 404.
    const usuarioActualizado = await Usuario.findOneAndUpdate(
      { _id: req.params.id, rol: 'cliente' },
      { estado },
      { returnDocument: 'after', runValidators: true }
    ).select('-passwordHash');

    if (!usuarioActualizado) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.status(200).json(usuarioActualizado);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  obtenerUsuarios,
  cambiarEstadoUsuario
};