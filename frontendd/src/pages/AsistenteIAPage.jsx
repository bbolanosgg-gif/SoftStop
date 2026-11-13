import { useEffect, useRef, useState } from 'react';
import Boton from '../components/Boton/Boton';
import BotonVolver from '../components/BotonVolver';

// Imágenes que ya tienes en src/assets/img/.

import flor from '../assets/img/flor.png';
import libro from '../assets/img/Libro.png';
import '../styles/asistente.css';

// Descripción de los espacios existentes en el catálogo de SoftStop.
// No son enlaces: las páginas individuales todavía están en desarrollo.
const ESPACIOS = {
  reset: {
    nombre: 'Reset',
    icono: '☾',
    descripcion: 'Una pausa para respirar y volver al presente.'
  },
  think: {
    nombre: 'Think',
    icono: '✧',
    descripcion: 'Un espacio para ordenar ideas y recuperar claridad.'
  },
  journal: {
    nombre: 'Journal',
    icono: '✎',
    descripcion: 'Un lugar para poner en palabras lo que llevas dentro.'
  },
  journey: {
    nombre: 'Journey',
    icono: '❀',
    descripcion: 'Una oportunidad para reconocer tus pequeños avances.'
  },
  unstuck: {
    nombre: 'Unstuck',
    icono: '↗',
    descripcion: 'Ayuda para encontrar una primera acción posible.'
  }
};

// Al hacer clic, estos ejemplos solamente llenan el campo de texto.
// La consulta se hace únicamente cuando el usuario pulsa Enviar.
const SUGERENCIAS = [
  'Tengo demasiadas cosas en la cabeza.',
  'No sé por dónde empezar.',
  'Necesito hacer una pausa.'
];

export default function AsistenteIAPage({ apiUrl, cambiarPagina }) {
  // Mensaje que el estudiante está escribiendo.
  const [mensaje, setMensaje] = useState('');

  // Historial visible de ESTA pantalla. No se guarda en MongoDB.
  const [mensajes, setMensajes] = useState([]);

  // Nos permite mostrar "Pensando..." y desactivar el botón.
  const [cargandoIA, setCargandoIA] = useState(false);

  // Avisos que devuelve Express (por ejemplo, 429 o 503).
  const [aviso, setAviso] = useState('');

  // Bloquea clics duplicados antes de que React vuelva a renderizar.
  const enviandoRef = useRef(false);

  // Referencia al final del chat para bajar al último mensaje.
  const finalChatRef = useRef(null);

  useEffect(() => {
    finalChatRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [mensajes, cargandoIA]);

  function nuevaConversacion() {
    // Evitamos borrar el chat mientras hay una petición en curso.
    if (enviandoRef.current) return;
    setMensajes([]);
    setMensaje('');
    setAviso('');
  }

  async function enviarMensaje(event) {
    event.preventDefault();

    const texto = mensaje.trim();

    // Valida el formulario ANTES de gastar una consulta de Gemini.
    if (!texto || texto.length > 500 || enviandoRef.current) return;

    enviandoRef.current = true;
    setCargandoIA(true);
    setAviso('');

    // Mostramos inmediatamente el mensaje del estudiante.
    setMensajes((anteriores) => [
      ...anteriores,
      { id: `${Date.now()}-usuario`, autor: 'usuario', texto }
    ]);
    setMensaje('');

    try {
      // La clave secreta de Gemini NO se envía desde React.
      // React habla con Express y Express se comunica con Google.
      const respuesta = await fetch(`${apiUrl}/api/ia/checkin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: texto })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        // Mensaje especial para las restricciones del backend.
        if (respuesta.status === 429) {
          throw new Error(datos.error || 'Se alcanzó el límite de consultas.');
        }
        if (respuesta.status === 503) {
          throw new Error(datos.error || 'El Check-in no está disponible por ahora.');
        }
        throw new Error(datos.error || 'No pudimos obtener una respuesta.');
      }

      // El controlador devuelve { mensaje, espacioRecomendado }.
      // Nunca utilizamos los campos del recomendador antiguo.
      setMensajes((anteriores) => [
        ...anteriores,
        {
          id: `${Date.now()}-softstop`,
          autor: 'softstop',
          texto: datos.mensaje,
          espacio: ESPACIOS[datos.espacioRecomendado] || null
        }
      ]);
    } catch (error) {
      // Si falla la conexión, conservamos el mensaje visible,
      // pero indicamos que no hubo respuesta del asistente.
      setAviso(error.message || 'Ocurrió un problema de conexión.');
    } finally {
      // Se ejecuta con éxito o error; permite escribir de nuevo.
      enviandoRef.current = false;
      setCargandoIA(false);
    }
  }

  return (
    <main className="asistente-pagina">
      <div className="asistente-contenedor">
        {/* El Header y el Footer de la landing NO se renderizan aquí. */}
        <div className="asistente-barra-superior">
          <BotonVolver alClick={() => cambiarPagina('inicio')} />
          
        </div>

        <div className="asistente-grid">
          {/* IZQUIERDA: orientación breve, no formulario duplicado. */}
          <aside className="asistente-lateral">
            
            <h1 className="asistente-titulo">No tienes que resolverlo todo ahora.</h1>
            <p className="asistente-descripcion">
              A veces, poner en palabras lo que pasa es suficiente para descubrir por dónde empezar.
            </p>

            {/* Reutilizamos la ilustración existente, sin animaciones. */}
            <img
              className="asistente-libro"
              src={libro}
              alt="Libro ilustrado con flores en tonos suaves"
            />

            <div className="asistente-lateral-pie">
              <span className="asistente-lateral-icono" aria-hidden="true">✧</span>
              <p>Tu ritmo también es una forma de avanzar.</p>
            </div>
          </aside>

          {/* DERECHA: chat real conectado a Express. */}
          <section className="asistente-chat" aria-label="Conversación con Check-in">
            <div className="asistente-chat-cabecera">
              <div className="asistente-chat-identidad">
                <span className="asistente-avatar" aria-hidden="true">
                  <img src={flor} alt="" />
                </span>
                <div>
                  <h2>Check-in</h2>
                  <p>Un pequeño espacio para escucharte.</p>
                </div>
              </div>
              <Boton
                variante="contorno"
                tamano="sm"
                type="button"
                onClick={nuevaConversacion}
                disabled={cargandoIA}
              >
                Nueva conversación
              </Boton>
            </div>

            <div className="asistente-chat-mensajes" role="log" aria-live="polite" aria-relevant="additions">
              {mensajes.length === 0 && (
                <div className="asistente-bienvenida">
                  
                  <h3>¿Qué está pasando por tu mente hoy?</h3>
                  <p>Podemos empezar por lo que sientes, por una tarea pendiente o simplemente por esa pausa que necesitas.</p>

                  <div className="asistente-sugerencias" aria-label="Ideas para comenzar">
                    {SUGERENCIAS.map((sugerencia) => (
                      <button
                        type="button"
                        className="asistente-sugerencia"
                        key={sugerencia}
                        onClick={() => setMensaje(sugerencia)}
                        disabled={cargandoIA}
                      >
                        {sugerencia}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mensajes.map((item) => (
                <div
                  key={item.id}
                  className={`asistente-mensaje asistente-mensaje--${item.autor}`}
                >
                  {item.autor === 'softstop' && (
                    <span className="asistente-mensaje-autor">✳ SoftStop</span>
                  )}
                  <p>{item.texto}</p>
                  {item.espacio && (
                    <div className="asistente-recomendacion">
                      <span className="asistente-recomendacion-icono" aria-hidden="true">{item.espacio.icono}</span>
                      <div>
                        <span className="asistente-recomendacion-label">Espacio sugerido</span>
                        <strong>{item.espacio.nombre}</strong>
                        <p>{item.espacio.descripcion}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {cargandoIA && (
                <div className="asistente-mensaje asistente-mensaje--softstop asistente-pensando" role="status">
                  <span className="asistente-mensaje-autor">✳ SoftStop</span>
                  <span className="asistente-puntos" aria-label="Preparando una respuesta">
                    <i /><i /><i />
                  </span>
                  <span>Preparando una orientación para ti...</span>
                </div>
              )}
              <div ref={finalChatRef} />
            </div>

            {/* El aviso permanece visible, incluso si el chat tiene mensajes. */}
            {aviso && <p className="asistente-aviso" role="alert">{aviso}</p>}

            <form className="asistente-chat-form" onSubmit={enviarMensaje}>
              <label htmlFor="checkin-mensaje" className="asistente-label-oculto">
                Cuéntanos cómo te sientes
              </label>
              <div className="asistente-input-contenedor">
                <textarea
                  id="checkin-mensaje"
                  rows={2}
                  maxLength={500}
                  placeholder="Escribe cómo te sientes..."
                  value={mensaje}
                  disabled={cargandoIA}
                  onChange={(event) => setMensaje(event.target.value)}
                  onKeyDown={(event) => {
                    // Enter envía; Shift + Enter permite un salto de línea.
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                />
                <Boton
                  variante="primario"
                  tamano="md"
                  type="submit"
                  disabled={cargandoIA || !mensaje.trim()}
                  aria-label={cargandoIA ? 'Esperando respuesta' : 'Enviar mensaje'}
                >
                  {cargandoIA ? 'Pensando...' : 'Enviar ↗'}
                </Boton>
              </div>
              <div className="asistente-form-pie">
                <span>{mensaje.length}/500 caracteres</span>
                <span>Una pausa digital, no atención profesional.</span>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}
