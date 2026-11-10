
const mongoose = require('mongoose');
const dns = require('dns');

// Utilizamos los servidores DNS públicos de Google.
// Esto puede solucionar problemas al resolver
// los registros SRV de MongoDB Atlas.
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Establece la conexión con MongoDB Atlas.
async function conectarBD() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Falta configurar MONGODB_URI');
  }

  try {
    await mongoose.connect(uri);

    console.log(
      'Conectado a MongoDB:',
      mongoose.connection.name
    );

  } catch (error) {
    throw new Error(
      `No se pudo conectar a MongoDB: ${error.message}`
    );
  }
}

module.exports = conectarBD;
