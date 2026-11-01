// Importamos mongoose para gestionar la base de datos MongoDB
const mongoose = require('mongoose');
const dns = require('dns');

// Forzar servidores DNS públicos de Google para resolver registros SRV de MongoDB Atlas
dns.setServers(['8.8.8.8', '8.8.4.4']);

// Función asíncrona para conectar a la base de datos
async function conectarBD() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Se logró conectar a la BD de Mongo: " + mongoose.connection.name);
  } catch (error) {
    console.log("NO se logró conectar a la BD de Mongo: ", error.message);
    process.exit(1); // Detiene el servidor si no hay base de datos
  }
}

module.exports = conectarBD;
