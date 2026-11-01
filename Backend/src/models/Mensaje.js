const { Schema, model } = require('mongoose');

// Esquema para guardar las solicitudes del formulario de contacto
const mensajeSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      trim: true,
      lowercase: true
    },
    asunto: {
      type: String,
      required: [true, 'El asunto es obligatorio'],
      enum: ['duda', 'sugerencia', 'otro']
    },
    mensaje: {
      type: String,
      required: [true, 'El contenido del mensaje es obligatorio'],
      trim: true,
      maxlength: 1000
    },
    leido: {
      type: Boolean,
      default: false // Permite al administrador marcar si ya revisó el mensaje
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

module.exports = model('Mensaje', mensajeSchema);