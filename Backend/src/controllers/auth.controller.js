const Usuario = require('../models/Usuario.js');

// Función para iniciar sesión en el Panel Admin
async function loginAdmin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Debes ingresar correo y contraseña." });
    }

    const correoLimpio = email.trim().toLowerCase();

    // Verificamos si ya existe algún usuario en la colección; si no, creamos el admin base
    const totalUsuarios = await Usuario.countDocuments();
    if (totalUsuarios === 0) {
      await Usuario.create({
        nombre: "Administradora SoftStop",
        email: "admin@softstop.com",
        password: "admin1234",
        rol: "admin"
      });
    }

    // Buscamos el usuario por correo
    const usuarioEncontrado = await Usuario.findOne({ email: correoLimpio });

    // Comparamos la contraseña con un condicional sencillo
    if (!usuarioEncontrado || usuarioEncontrado.password !== password) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    // Devolvemos los datos básicos sin enviar la contraseña
    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      usuario: {
        id: usuarioEncontrado._id,
        nombre: usuarioEncontrado.nombre,
        email: usuarioEncontrado.email,
        rol: usuarioEncontrado.rol
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  loginAdmin
};