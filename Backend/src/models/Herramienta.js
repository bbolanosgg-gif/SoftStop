const { Schema, model } = require('mongoose');

// Definimos la estructura de cada herramienta del catálogo de SoftStop
const herramientaSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la herramienta es obligatorio'],
      trim: true
    },
    // NUEVO: frase corta que se muestra bajo el título en las cartas de la landing.
    // Ejemplo: "REFLEXIÓN PROFUNDA". No es obligatoria para que las herramientas
    // que ya existen en la base de datos sigan siendo válidas.
    lema: {
      type: String,
      trim: true,
      maxlength: [40, 'El lema no puede tener más de 40 caracteres'],
      default: ''
    },
    descripcion: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
      maxlength: 300
    },
    beneficio: {
      type: String,
      required: [true, 'El beneficio para el estudiante es obligatorio'],
      trim: true
    },
    icono: {
      type: String,
      default: '✨', // Emoji o nombre de ícono sencillo para mostrar en la tarjeta
      trim: true
    },
    estadoDisponibilidad: {
      type: String,
      enum: ['Disponible en catálogo', 'Próximamente'],
      default: 'Disponible en catálogo'
    },
    activa: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
    versionKey: false // Oculta el campo __v de MongoDB
  }
);

module.exports = model('Herramienta', herramientaSchema);