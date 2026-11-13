
/*
 * CONTROLADOR DEL CHECK-IN INTELIGENTE
 *
 * Recibe un mensaje del estudiante,
 * consulta Gemini y devuelve una recomendación.
 
 */

const ConfiguracionIA = require('../models/ConfiguracionIA.js');

async function checkinInteligente(req, res) {
  try {
    // 1. Comprobamos si la función está habilitada.
    // Por ahora usamos una variable de entorno.
    // Más adelante el Panel Admin controlará esto desde MongoDB.
    if (process.env.CHECKIN_IA_HABILITADO !== "true") {
      return res.status(503).json({
        error: "El Check-in inteligente no está disponible."
      });
    }

    // 2. Recibimos el mensaje enviado por el estudiante.
    const { mensaje } = req.body || {};

    // Comprobamos que sea texto y no esté vacío.
    if (typeof mensaje !== "string" || !mensaje.trim()) {
      return res.status(400).json({
        error: "Por favor, cuéntanos cómo te sientes."
      });
    }

    // Limitamos la cantidad de caracteres.
    if (mensaje.length > 500) {
      return res.status(400).json({
        error: "El mensaje no puede superar 500 caracteres."
      });
    
    }


    // ============================================
    // CONTROL DE CONSULTAS DESDE MONGODB
    // ============================================

    // Buscamos la configuración del Check-in.
    const configuracion = await ConfiguracionIA.findOne({
      nombre: 'checkin'
    });

    // Si no existe o está desactivada, no permitimos
    // realizar solicitudes a Gemini.
    if (!configuracion || !configuracion.activo) {
      return res.status(503).json({
        error: 'El Check-in inteligente está desactivado.'
      });
    }

    // Intentamos reservar UNA consulta.
    // MongoDB solo incrementará el contador si:
    // 1. El asistente continúa activo.
    // 2. Todavía no alcanzamos el límite.
    const reserva = await ConfiguracionIA.findOneAndUpdate(
      {
        nombre: 'checkin',
        activo: true,

        // Comparamos ambos campos directamente en MongoDB.
        $expr: {
          $lt: ['$consultasUsadas', '$limiteConsultas']
        }
      },
      {
        // Incrementa el contador en una unidad.
        $inc: { consultasUsadas: 1 }
      },
      {
        // Devuelve el documento después de actualizarlo.
        returnDocument: 'after'
      }
    );

    // Si no pudimos reservar una consulta, revisamos
    // si el asistente fue desactivado o se agotó el cupo.
    if (!reserva) {
      const actual = await ConfiguracionIA.findOne({
        nombre: 'checkin'
      });

      if (!actual || !actual.activo) {
        return res.status(503).json({
          error: 'El Check-in inteligente está desactivado.'
        });
      }

      return res.status(429).json({
        error: 'Se alcanzó el límite de consultas de esta demostración.'
      });
    }

    // Si llegamos aquí, ya reservamos una consulta.


    // 3. Importamos la biblioteca oficial de Gemini.
    const { GoogleGenAI } = await import("@google/genai");

    // Creamos el cliente usando la clave privada.
    const ia = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    // 4. Instrucciones para el comportamiento de la IA.
    const instrucciones = `
      Eres el asistente Check-in de SoftStop,
      una aplicación de bienestar académico.

      Tu objetivo es escuchar brevemente al estudiante
      y recomendar UNO de estos cinco espacios:

      reset: para hacer una pausa y bajar la tensión.
      think: para organizar tareas y prioridades.
      journal: para expresar pensamientos por escrito.
      journey: para reconocer avances y esfuerzos.
      unstuck: para encontrar una pequeña acción inicial.

      Reglas:
      - Responde en español de manera cálida y breve.
      - No juzgues al estudiante.
      - No exijas productividad.
      - No diagnostiques ni actúes como terapeuta.
      - No inventes funcionalidades de SoftStop.
      - Recomienda solamente uno de los cinco espacios.
      - La orientación no debe superar 60 palabras.
      - Si alguien expresa peligro inmediato o intención
        de hacerse daño, prioriza orientarlo hacia apoyo
        humano urgente, no hacia productividad.

      Devuelve solamente JSON con estas propiedades:
      "mensaje": orientación breve.
      "espacioRecomendado": reset, think, journal,
      journey o unstuck.
    `;

    // 5. Enviamos el mensaje a Gemini.
    const respuesta = await ia.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: mensaje.trim(),
      config: {
        systemInstruction: instrucciones,
        responseMimeType: "application/json",
        temperature: 0.4
      }
    });

    // 6. Convertimos el JSON devuelto por Gemini
    // en un objeto que JavaScript pueda utilizar.
    const resultado = JSON.parse(respuesta.text);

    // Comprobamos que el espacio exista en SoftStop.
    const espaciosValidos = [
      "reset",
      "think",
      "journal",
      "journey",
      "unstuck"
    ];

    if (
      typeof resultado.mensaje !== "string" ||
      !resultado.mensaje.trim() ||
      !espaciosValidos.includes(resultado.espacioRecomendado)
    ) {
      throw new Error("Gemini devolvió una recomendación inválida.");
    }

    // 7. Devolvemos la respuesta a React.
    return res.status(200).json({
      mensaje: resultado.mensaje,
      espacioRecomendado: resultado.espacioRecomendado
    });

  } catch (error) {

  // Guardamos el detalle del error en la terminal
  // para facilitar la depuración.
  console.error('Error en Check-in:', error.message);

  // Algunos errores de Gemini incluyen su código
  // dentro de un objeto JSON en error.message.
  let codigo = error.status || error.code;

  try {
    const detalle = JSON.parse(error.message);
    codigo = detalle.error?.code || codigo;
  } catch {
    // Si no es JSON, conservamos el código anterior.
  }

  // Google no pudo atender la solicitud por alta demanda.
  if (Number(codigo) === 503) {
    return res.status(503).json({
      error: 'Nuestro asistente está teniendo dificultades para responder en este momento. Puedes intentarlo nuevamente más tarde. 💜'
    });
  }

  // Para otros errores, mantenemos una respuesta general.
  return res.status(502).json({
    error: 'No pudimos obtener una recomendación. Inténtalo nuevamente.'
  });
}
}

// Exportamos nuestra única función de IA.
module.exports = {
  checkinInteligente
};