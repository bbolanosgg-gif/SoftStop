
/*
 * CREAR CONFIGURACIÓN INICIAL DE GEMINI
 *
 * Este archivo se ejecuta una sola vez para crear
 * la configuración del Check-in en MongoDB.
 *
 * Si ya existe, no la modifica.
 */

// 1. Cargar las variables privadas del archivo .env.
// dotenv busca el .env de la carpeta Backend,
// desde donde ejecutaremos este archivo.
require('dotenv').config();

// 2. Importar Mongoose para conectarnos a MongoDB.
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

// 3. Importar el modelo que creamos anteriormente.
const ConfiguracionIA = require('../models/ConfiguracionIA.js');

// 4. Función que crea la configuración si aún no existe.
async function crearConfiguracionIA() {

  try {

    // Nos conectamos a MongoDB Atlas.
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Conectado a MongoDB');

    // Buscamos la configuración llamada "checkin".
    let configuracion = await ConfiguracionIA.findOne({
      nombre: 'checkin'
    });

    // Si no existe, la creamos con los valores iniciales.
    if (!configuracion) {

      configuracion = await ConfiguracionIA.create({
        nombre: 'checkin',
        activo: false,
        limiteConsultas: 10,
        consultasUsadas: 0
      });

      console.log('Configuración de IA creada correctamente.');

    } else {

      // Si ya existe, no sobrescribimos sus valores.
      console.log('La configuración de IA ya existe.');

    }

    // Mostramos los valores para comprobarlos.
    console.log({
      nombre: configuracion.nombre,
      activo: configuracion.activo,
      limiteConsultas: configuracion.limiteConsultas,
      consultasUsadas: configuracion.consultasUsadas
    });

  } catch (error) {

    // Mostramos el error si no podemos conectarnos
    // o guardar la configuración.
    console.error(
      'Error al crear configuración:',
      error.message
    );

    process.exitCode = 1;

  } finally {

    // Cerramos la conexión porque este archivo
    // es un script de inicialización, no un servidor.
    await mongoose.disconnect();

  }
}

// Ejecutamos la función.
crearConfiguracionIA();
