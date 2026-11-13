
const ConfiguracionIA = require('../models/ConfiguracionIA.js');

/*
 * CONTROLADOR DE CONFIGURACIÓN DE GEMINI
 *
 * Estas funciones NO consultan Gemini.
 * Solamente leen y modifican su configuración en MongoDB.
 *
 * Sus rutas estarán protegidas con JWT.
 */

// 1. CONSULTAR CONFIGURACIÓN
async function obtenerConfiguracion(req, res, next) {
  try {
    // Buscamos el documento del Check-in.
    const configuracion = await ConfiguracionIA.findOne({
      nombre: 'checkin'
    });

    // Si todavía no existe, informamos del problema.
    if (!configuracion) {
      return res.status(404).json({
        error: 'No existe la configuración de Check-in.'
      });
    }

    // Enviamos los datos al Panel Admin.
    res.status(200).json(configuracion);

  } catch (error) {
    next(error);
  }
}


// 2. ACTUALIZAR CONFIGURACIÓN
async function actualizarConfiguracion(req, res, next) {
  try {
    // Recibimos los nuevos valores que envía React.
    const { activo, limiteConsultas } = req.body || {};

    // Comprobamos que "activo" sea verdadero o falso.
    if (typeof activo !== 'boolean') {
      return res.status(400).json({
        error: 'El campo activo debe ser true o false.'
      });
    }

    // Comprobamos que el límite sea un entero de 1 a 30.
    // Este máximo es una decisión para nuestra demostración.
    if (
      !Number.isInteger(limiteConsultas) ||
      limiteConsultas < 1 ||
      limiteConsultas > 30
    ) {
      return res.status(400).json({
        error: 'El límite debe ser un número entero entre 1 y 30.'
      });
    }

    // Buscamos la configuración y actualizamos los valores.
    const configuracion = await ConfiguracionIA.findOneAndUpdate(
      { nombre: 'checkin' },
      {
        $set: {
          activo: activo,
          limiteConsultas: limiteConsultas
        }
      },
      {
        returnDocument: 'after',
        runValidators: true
      }
    );

    if (!configuracion) {
      return res.status(404).json({
        error: 'No existe la configuración de Check-in.'
      });
    }

    // Respondemos con la configuración actualizada.
    res.status(200).json(configuracion);

  } catch (error) {
    next(error);
  }
}


// 3. REINICIAR CONTADOR
async function reiniciarConsultas(req, res, next) {
  try {
    // Reiniciamos únicamente el contador.
    // No modificamos si el asistente está activo
    // ni el número máximo de consultas.
    const configuracion = await ConfiguracionIA.findOneAndUpdate(
      { nombre: 'checkin' },
      {
        $set: { consultasUsadas: 0 }
      },
      {
        new: true
      }
    );

    if (!configuracion) {
      return res.status(404).json({
        error: 'No existe la configuración de Check-in.'
      });
    }

    res.status(200).json({
      mensaje: 'Contador reiniciado correctamente.',
      configuracion: configuracion
    });

  } catch (error) {
    next(error);
  }
}


// Exportamos las funciones para utilizarlas en las rutas.
module.exports = {
  obtenerConfiguracion,
  actualizarConfiguracion,
  reiniciarConsultas
};
