require('dotenv').config();
require('node:dns').setServers(['8.8.8.8', '1.1.1.1']);
const cors = require('cors');

const express = require('express');
const connectDB = require('./src/config/db.js');
const authRoutes = require('./src/routes/auth.routes.js');
const contactoRoutes = require('./src/routes/contacto.routes.js');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200)
        .json({ mensaje: 'La ejecución del servidor está en marcha' });
});

app.use('/auth', authRoutes);
app.use('/contacto', contactoRoutes);

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
    app.listen(PORT, () => console.log(`Servidor en marcha en el puerto ${PORT}`))
});
