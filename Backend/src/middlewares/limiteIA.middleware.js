
const { rateLimit } = require('express-rate-limit');

// Limitamos cuántas solicitudes puede enviar
// una misma dirección IP al Check-in de SoftStop.
const limiteIA = rateLimit({

  // Duración del intervalo: 1 minuto.
  windowMs: 60 * 1000,

  // Cada dirección IP puede enviar como máximo
  // 3 solicitudes durante ese minuto.
  limit: 3,

  // Devuelve información del límite en
  // las cabeceras HTTP de la respuesta.
  standardHeaders: 'draft-7',
  legacyHeaders: false,

  // Respuesta que recibirá el visitante
  // cuando supere las 3 solicitudes.
  message: {
    error: 'Has enviado varios mensajes seguidos. Inténtalo nuevamente en un minuto.'
  }
});

module.exports = limiteIA;
