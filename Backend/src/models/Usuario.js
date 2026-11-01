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
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria']
    },
    rol: {
      type: String,
      default: 'admin'
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = model('Usuario', usuarioSchema);