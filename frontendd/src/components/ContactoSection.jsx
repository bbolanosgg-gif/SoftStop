import { useState } from 'react';
import Boton from './Boton/Boton';
import '../styles/contacto.css';

// Importamos la ilustración del castillo desde tu carpeta de imágenes
import castilloImg from '../assets/img/castillo-footer.png';

// Formulario de contacto controlado que guarda las solicitudes en MongoDB
export default function ContactoSection({ apiUrl }) {
  // --- TODA TU LÓGICA DE ESTADOS Y BACKEND QUEDA 100% INTACTA ---
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

  // --- NUEVA ESTRUCTURA VISUAL (JSX) ---
  return (
    <section className="contacto-section" id="contacto">
      <div className="contacto-contenedor">

        {/* COLUMNA IZQUIERDA: Textos + Ilustración del Castillo */}
        <div className="contacto-info">
          <h2 className="contacto-titulo">Contacto</h2>

          <p className="contacto-subtitulo">
            ¿Tienes alguna pregunta? <br />
            Escríbenos, estamos aquí para <br />
            ayudarte
          </p>

          <img
            src={castilloImg}
            alt="Castillo de SoftStop"
            className="contacto-castillo"
          />
        </div>

        {/* COLUMNA DERECHA: Tarjeta con el formulario */}
        <div className="contacto-tarjeta">
          <form className="formulario" onSubmit={manejarEnvioContacto}>

            {/* Campo 1: Nombre */}
            <div className="input-pill">
              <span className="input-icono" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                aria-label="Tu nombre"
              />
            </div>

            {/* Campo 2: Correo electrónico */}
            <div className="input-pill">
              <span className="input-icono" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electrónico"
                aria-label="Tu correo electrónico"
              />
            </div>

            {/* Campo 3: Asunto (Conserva los valores de tu BD) */}
            <div className="input-pill">
              <span className="input-icono" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
              </span>
              <select
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                aria-label="Asunto"
              >
                <option value="duda">Asunto: Duda o soporte</option>
                <option value="sugerencia">Asunto: Sugerencia para SoftStop</option>
                <option value="otro">Asunto: Otro motivo</option>
              </select>
            </div>

            {/* Campo 4: Mensaje */}
            <div className="textarea-box">
              <textarea
                rows="5"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder="Cuéntanos en qué podemos ayudarte hoy..."
                aria-label="Mensaje"
              />
            </div>

            {/* Mensajes de respuesta del Backend */}
            {respuestaTexto && (
              <p className={esError ? 'alerta-error' : 'alerta-exito'}>
                {respuestaTexto}
              </p>
            )}

            {/* Botón de envío */}
            <Boton type="submit" variante="primario" tamano="lg" anchoCompleto>
              Enviar mensaje
            </Boton>

          </form>
        </div>

      </div>
    </section>
  );
}