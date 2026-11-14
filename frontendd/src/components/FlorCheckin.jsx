import { useEffect, useRef, useState } from 'react';

// Ajusta SOLO esta ruta si tu imagen está en otra carpeta o tiene otro nombre.
// Respeta mayúsculas y minúsculas: "flor.png" no es igual a "Flor.png".
import flor from '../assets/img/flor.png';

import '../styles/florCheckin.css';

// Este componente se muestra en la LandingPage de SoftStop.
// La bienvenida aparece a los 2 segundos, incluso si Gemini está desactivado.
export default function FlorCheckin({ apiUrl, cambiarPagina }) {
  // Controla si vemos la tarjeta de bienvenida.
  const [mostrarNube, setMostrarNube] = useState(false);

  // null = consultando; true = disponible; false = no disponible.
  const [iaDisponible, setIaDisponible] = useState(null);

  // Conservamos el identificador del temporizador para poder cancelarlo.
  const temporizadorRef = useRef(null);

  // 1. MOSTRAR LA BIENVENIDA DESPUÉS DE DOS SEGUNDOS.
  // Este efecto no depende de MongoDB ni de la respuesta de Gemini.
  useEffect(() => {
    temporizadorRef.current = window.setTimeout(() => {
      setMostrarNube(true);
      temporizadorRef.current = null;
    }, 2000);

    // Evita que quede un temporizador activo al salir de la landing.
    return () => window.clearTimeout(temporizadorRef.current);
  }, []);

  // 2. COMPROBAR POR SEPARADO SI EL CHECK-IN SE PUEDE USAR.
  // Solo la disponibilidad del botón depende de esta petición.
  useEffect(() => {
    const controlador = new AbortController();

    async function consultarEstado() {
      try {
        const respuesta = await fetch(`${apiUrl}/api/ia/estado`, {
          signal: controlador.signal,
        });

        if (!respuesta.ok) {
          throw new Error(`Error HTTP ${respuesta.status} en /api/ia/estado`);
        }

        const datos = await respuesta.json();
        setIaDisponible(datos.disponible === true);
      } catch (error) {
        // Al salir de la página, React cancela la petición: no es un error real.
        if (error.name === 'AbortError') return;

        console.warn('No se pudo consultar el estado del Check-in:', error);
        setIaDisponible(false);
      }
    }

    consultarEstado();
    return () => controlador.abort();
  }, [apiUrl]);

  // 3. LA FLOR TAMBIÉN PERMITE ABRIR O CERRAR LA BIENVENIDA MANUALMENTE.
  function alternarNube() {
    // Si se pulsa antes de los 2 segundos, no la volvemos a abrir por accidente.
    window.clearTimeout(temporizadorRef.current);
    temporizadorRef.current = null;
    setMostrarNube((anterior) => !anterior);
  }

  // 4. IR A LA PÁGINA DEL CHECK-IN.
  // En App.jsx la página 'ia' ya corresponde a AsistenteIAPage.
  function entrarAlCheckin() {
    if (iaDisponible === true) {
      cambiarPagina('ia');
    }
  }

  return (
    <aside className="FlorCheckin" aria-label="Invitación a Check-in de SoftStop">
      {/* Solo se agrega al HTML cuando mostrarNube es true. */}
      {mostrarNube && (
        <div className="FlorCheckin__nube" id="flor-checkin-invitacion" aria-live="polite">
          <button
            type="button"
            className="FlorCheckin__cerrar"
            aria-label="Cerrar mensaje de bienvenida"
            onClick={() => setMostrarNube(false)}
          >
            ×
          </button>

          <span className="FlorCheckin__etiqueta">UN ESPACIO PARA TI</span>
          <h3>¡Qué bueno verte por aquí!</h3>
          <p>
            Antes de comenzar, ¿cómo te sientes hoy? Cuéntaselo a Check-in
            y descubre un espacio pensado para acompañarte.
          </p>

          {iaDisponible === true && (
            <button
              type="button"
              className="FlorCheckin__cta"
              onClick={entrarAlCheckin}
            >
              Hacer mi Check-in <span aria-hidden="true">→</span>
            </button>
          )}

          {iaDisponible === null && (
            <p className="FlorCheckin__estado">Comprobando disponibilidad...</p>
          )}

          {iaDisponible === false && (
            <p className="FlorCheckin__estado">
              Check-in está descansando por ahora. Pronto podrás volver a visitarlo. 💜
            </p>
          )}
        </div>
      )}

      {/* Conservamos la flor y sus animaciones definidas en florCheckin.css. */}
      <button
        type="button"
        className="FlorCheckin__flor"
        onClick={alternarNube}
        aria-label={mostrarNube ? 'Ocultar bienvenida' : 'Mostrar bienvenida'}
        aria-expanded={mostrarNube}
        aria-controls="flor-checkin-invitacion"
      >
        <img src={flor} alt="" />
      </button>
    </aside>
  );
}
