const Usuario = require('../models/Usuario.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función para iniciar sesión en el Panel Admin
async function loginAdmin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        error: 'Debes ingresar correo y contraseña.'
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        error: 'Falta configurar JWT_SECRET en el servidor.'
      });
    }

    const correoLimpio = email.trim().toLowerCase();

    // Buscar al administrador
    const usuarioEncontrado = await Usuario.findOne({
      email: correoLimpio
    });

    if (!usuarioEncontrado || usuarioEncontrado.rol !== 'admin') {
      return res.status(401).json({
        error: 'Correo o contraseña incorrectos.'
      });
    }

    // Comprobar la contraseña.
    // También permite actualizar contraseñas antiguas que estaban en texto normal.
    const esHashBcrypt = usuarioEncontrado.password.startsWith('$2');

    let contraseñaCorrecta = false;

    if (esHashBcrypt) {
      contraseñaCorrecta = await bcrypt.compare(
        password,
        usuarioEncontrado.password
      );
    } else {
      contraseñaCorrecta = usuarioEncontrado.password === password;

      // Si la contraseña antigua es correcta, guardarla protegida.
      if (contraseñaCorrecta) {
        usuarioEncontrado.password = await bcrypt.hash(password, 12);
        await usuarioEncontrado.save();
      }
    }

    if (!contraseñaCorrecta) {
      return res.status(401).json({
        error: 'Correo o contraseña incorrectos.'
      });
    }

    // Crear token de autenticación
    const token = jwt.sign(
      {
        id: usuarioEncontrado._id.toString(),
        rol: usuarioEncontrado.rol
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h'
      }
    );

    // Respuesta sin incluir la contraseña
    res.status(200).json({
      mensaje: 'Inicio de sesión exitoso.',
      token,
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