import { useState } from 'react';

// Formulario de contacto controlado que guarda las solicitudes en MongoDB
export default function ContactoSection({ apiUrl }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [asunto, setAsunto] = useState('duda');
  const [mensaje, setMensaje] = useState('');
  const [respuestaTexto, setRespuestaTexto] = useState('');
  const [esError, setEsError] = useState(false);

  async function manejarEnvioContacto(event) {
    event.preventDefault();
    setRespuestaTexto('');
    setEsError(false);

    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      setEsError(true);
      setRespuestaTexto('Por favor completa todos los campos obligatorios.');
      return;
    }

    try {
      const respuesta = await fetch(`${apiUrl}/api/contacto`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          asunto: asunto,
          mensaje: mensaje.trim()
        })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setEsError(true);
        setRespuestaTexto(datos.error || 'No se pudo enviar el mensaje.');
        return;
      }

      // Limpiamos los campos después de guardar en la base de datos
      setNombre('');
      setEmail('');
      setAsunto('duda');
      setMensaje('');
      setRespuestaTexto('¡Mensaje enviado con éxito! Te responderemos pronto 🤍');
    } catch (error) {
      setEsError(true);
      setRespuestaTexto('Error de conexión con el servidor Backend.');
    }
  }

  return (
    <section className="contenedor" id="contacto">
      <div className="grid-2">
        <div>
          <span className="eyebrow">Contacto Real</span>
          <h2 className="titulo-seccion">Estamos aquí para escucharte</h2>
          <p className="subtitulo-seccion">
            Si tienes dudas sobre SoftStop, sugerencias para nuevas herramientas de calma o comentarios académicos, escríbenos. Tu mensaje quedará registrado en nuestra base de datos.
          </p>
          <div className="tarjeta-glass">
            <p><strong>💬 Respuesta cercana:</strong> Revisamos cada sugerencia desde nuestro panel de administración.</p>
            <p><strong>🔒 Privacidad:</strong> Tus datos se emplean únicamente para dar seguimiento a tu solicitud.</p>
          </div>
        </div>

        <div className="tarjeta-glass">
          <h3>Envíanos un mensaje</h3>
          <form className="formulario" onSubmit={manejarEnvioContacto}>
            <div className="campo-form">
              <label>Nombre completo *</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
              />
            </div>

            <div className="campo-form">
              <label>Correo electrónico *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.edu.co"
              />
            </div>

            <div className="campo-form">
              <label>Asunto *</label>
              <select value={asunto} onChange={(e) => setAsunto(e.target.value)}>
                <option value="duda">Duda o soporte</option>
                <option value="sugerencia">Sugerencia para SoftStop</option>
                <option value="otro">Otro motivo</option>
              </select>
            </div>

            <div className="campo-form">
              <label>Mensaje *</label>
              <textarea
                rows="4"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Cuéntanos en qué podemos ayudarte hoy..."
              />
            </div>

            {respuestaTexto && (
              <p className={esError ? 'alerta-error' : 'alerta-exito'}>
                {respuestaTexto}
              </p>
            )}

            <button type="submit" className="btn-morado">
              Enviar mensaje →
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}