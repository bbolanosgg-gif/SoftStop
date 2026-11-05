const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario.js');

// Arma el objeto que SÍ se puede enviar al frontend.
// Así nunca se filtra el passwordHash por accidente y no repetimos código.
function datosPublicos(usuario) {
  return {
    id: usuario._id,
    nombre: usuario.nombre,
    email: usuario.email,
    rol: usuario.rol
  };
}

// POST /api/auth/login
async function iniciarSesion(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Debes ingresar correo y contraseña." });
    }

    const usuario = await Usuario.findOne({ email: email.trim().toLowerCase() });

    // Mismo mensaje si falla el correo o la contraseña:
    // no le damos pistas a un atacante sobre qué correos existen.
    if (!usuario) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    // compare() cifra lo escrito y lo compara con el hash guardado
    const passwordCorrecta = await bcrypt.compare(password, usuario.passwordHash);
    if (!passwordCorrecta) {
      return res.status(401).json({ error: "Correo o contraseña incorrectos." });
    }

    // NUEVO: si el administrador desactivó la cuenta, no se permite entrar.
    // Usamos "=== 'inactivo'" para que los usuarios antiguos, que no tienen
    // el campo "estado", sigan pudiendo iniciar sesión sin problema.
    // 403 = prohibido: la persona existe y su contraseña es correcta,
    // pero no tiene permiso de entrar.
    if (usuario.estado === 'inactivo') {
      return res.status(403).json({
        error: "Tu cuenta está desactivada. Contacta a la administración."
      });
    }

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso",
      usuario: datosPublicos(usuario)
    });
  } catch (error) {
    next(error); // lo atrapa el middleware manejarErrores
  }
}

// POST /api/auth/registro
async function registrarUsuario(req, res, next) {
  try {
    // Solo leemos estos 3 campos. Si alguien manda "rol" en el JSON, se ignora.
    const { nombre, email, password } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ error: "Nombre, correo y contraseña son obligatorios." });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres." });
    }

    const correoLimpio = email.trim().toLowerCase();

    // 409 = conflicto: ya existe
    const yaExiste = await Usuario.findOne({ email: correoLimpio });
    if (yaExiste) {
      return res.status(409).json({ error: "Ya existe una cuenta con ese correo." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // El rol lo decide el servidor, nunca el formulario
    const nuevoUsuario = await Usuario.create({
      nombre: nombre.trim(),
      email: correoLimpio,
      passwordHash,
      rol: "cliente"
    });

    // 201 = creado
    res.status(201).json({
      mensaje: "Cuenta creada correctamente",
      usuario: datosPublicos(nuevoUsuario)
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { iniciarSesion, registrarUsuario };