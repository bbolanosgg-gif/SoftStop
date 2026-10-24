// Lee la URL base desde el archivo .env
const API_URL = import.meta.env.VITE_API_URL;

// Función general: hace la petición y devuelve los datos
export async function peticion(ruta, opciones = {}) {
    let respuesta;

    try {
        respuesta = await fetch(API_URL + ruta, {
            ...opciones,
            headers: { 'Content-Type': 'application/json', ...opciones.headers }
        });
    } catch {
        // fetch falla (no responde) solo cuando no hay conexión con el servidor
        throw new Error('No se pudo conectar con el servidor. ¿Está encendido en el puerto 3000?');
    }

    // .catch(() => ({})) evita un error si la respuesta no trae JSON (por ejemplo un 404 o 500 HTML de Express)
    const datos = await respuesta.json().catch(() => ({}));

    // Si el backend respondió con un código de error (400, 404, 500...)
    if (!respuesta.ok) {
        if (datos.error) {
            throw new Error(datos.error);
        }
        if (respuesta.status === 404) {
            throw new Error(`Ruta ${ruta} no encontrada en el backend (404). ¿Reiniciaste el servidor?`);
        }
        if (respuesta.status === 500) {
            throw new Error('Error interno del servidor (500). Revisa la consola del backend.');
        }
        throw new Error(`El servidor respondió con código ${respuesta.status}`);
    }

    return datos;
}

// Funciones específicas: así las pantallas no repiten rutas ni JSON.stringify
export const login = (email, password) =>
    peticion('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });

export const registro = (nombre, email, password) =>
    peticion('/auth/registro', {
        method: 'POST',
        body: JSON.stringify({ nombre, email, password })
    });

export const enviarContacto = (datos) =>
    peticion('/contacto', {
        method: 'POST',
        body: JSON.stringify(datos)
    });
