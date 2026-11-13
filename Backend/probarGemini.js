
/*
 * PRIMERA PRUEBA DE GEMINI - SOFTSTOP
 *
 * Objetivo:
 * Enviar un mensaje desde Node.js a Gemini
 * y mostrar la respuesta en la terminal.
 */

// 1. Cargamos las variables privadas del archivo .env.
require('dotenv').config();

// 2. Función principal de nuestra prueba.
async function probarGemini() {
  try {

    // Importamos la biblioteca oficial de Google.
    const { GoogleGenAI } = await import('@google/genai');

    // Verificamos que la clave esté configurada.
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Falta GEMINI_API_KEY en el archivo .env');
    }

    // 3. Creamos el cliente que se comunica con Gemini.
    const ia = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    // 4. Enviamos una solicitud al modelo.
    const respuesta = await ia.models.generateContent({

      // Modelo seleccionado para SoftStop.
      model: 'gemini-3.1-flash-lite',

      // Mensaje que queremos que Gemini interprete.
      contents: `
        Soy estudiante universitario.
        Tengo muchos trabajos pendientes y no sé por dónde empezar.

        Recomiéndame brevemente una acción pequeña
        que pueda hacer ahora.
      `

    });

    // 5. Mostramos únicamente la respuesta generada.
    console.log('\nRespuesta de Gemini:\n');
    console.log(respuesta.text);

  } catch (error) {

    // Si ocurre un problema, lo mostramos en la terminal.
    console.error('No se pudo completar la prueba.');
    console.error(error.message);
  }
}

// Ejecutamos la prueba una sola vez.
probarGemini();
