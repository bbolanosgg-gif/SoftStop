require('dotenv').config();
const bcrypt = require('bcrypt');
const conectarBD = require('../config/db.js');
const Usuario = require('../models/Usuario.js');

async function crearAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log('Faltan ADMIN_EMAIL o ADMIN_PASSWORD en el archivo .env');
    process.exit(1);
  }

  await conectarBD();

  const existe = await Usuario.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (existe) {
    console.log('El admin ya existe. No se crea de nuevo.');
    process.exit(0);
  }

  await Usuario.create({
    nombre: 'Administradora SoftStop',
    email: ADMIN_EMAIL,
    passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
    rol: 'admin'
  });

  console.log('Admin creado correctamente.');
  process.exit(0);
}

crearAdmin();