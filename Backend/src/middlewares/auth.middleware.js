const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
    const autorizacion = req.headers.authorization;

    if (!autorizacion || !autorizacion.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Debes iniciar sesión para acceder.'
        });
    }

    const token = autorizacion.split(' ')[1];

    try {
        const datosUsuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        if (datosUsuario.rol !== 'admin') {
            return res.status(403).json({
                error: 'No tienes permiso para acceder.'
            });
        }

        req.usuario = datosUsuario;

        next();

    } catch (error) {
        return res.status(401).json({
            error: 'La sesión no es válida o ha expirado.'
        });
    }
}

module.exports = verificarToken;