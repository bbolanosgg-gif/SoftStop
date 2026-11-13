
const mongoose = require('mongoose');

// Creamos el esquema que define cómo se guardará
// la configuración del asistente de IA en MongoDB.
const configuracionIAEsquema = new mongoose.Schema({

  // Identifica a qué función pertenece esta configuración.
  // Usaremos "checkin" porque es nuestro único asistente.
  nombre: {
    type: String,
    required: true,
    unique: true,
    default: 'checkin'
  },

  // Indica si el asistente está disponible para los visitantes.
  // Inicia apagado para evitar consultas no autorizadas.
  activo: {
    type: Boolean,
    default: false
  },

  // Cantidad máxima de consultas que permitiremos.
  limiteConsultas: {
    type: Number,
    default: 10,
    min: 1
  },

  // Cantidad de consultas que ya se han reservado.
  consultasUsadas: {
    type: Number,
    default: 0,
    min: 0
  }

});

// Creamos el modelo a partir del esquema.
// Mongoose utilizará la colección "configuracionias".
const ConfiguracionIA = mongoose.model(
  'ConfiguracionIA',
  configuracionIAEsquema
);

// Exportamos el modelo para utilizarlo en los controladores.
module.exports = ConfiguracionIA;
