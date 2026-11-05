const { Schema, model } = require('mongoose');

// Esquema de usuario para el acceso al Panel Admin
const usuarioSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'La contraseña es obligatoria']
    },
    rol: {
      type: String,
      enum: ['admin', 'cliente'], // solo se aceptan estos dos valores
      default: 'cliente'
    },
    // El administrador puede activar o desactivar cuentas.
    // En vez de borrar al usuario, solo cambiamos este estado.
    estado: {
      type: String,
      enum: ['activo', 'inactivo'],
      default: 'activo'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = model('Usuario', usuarioSchema);