const mongoose = require('mongoose');

const mensajeSchema = new mongoose.Schema(
    {
        nombre:  { type: String, required: true, trim: true, maxlength: 100 },
        email:   { type: String, required: true, trim: true, lowercase: true, maxlength: 150 },
        // enum: solo se aceptan estas tres opciones (son las del <select> del formulario)
        asunto:  { type: String, required: true, enum: ['duda', 'sugerencia', 'otro'] },
        mensaje: { type: String, required: true, trim: true, maxlength: 2000 },
        // Para que el admin pueda marcar mensajes como leídos más adelante
        leido:   { type: Boolean, default: false }
    },
    { timestamps: true } // createdAt = cuándo llegó el mensaje
);

module.exports = mongoose.model('Mensaje', mensajeSchema);