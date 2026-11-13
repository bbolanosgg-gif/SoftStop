
import { useEffect, useState } from 'react';
import Boton from './Boton/Boton';
import flor from '../assets/img/flor.png';
import '../styles/florCheckin.css';

// Componente flotante que aparecerá únicamente en la landing.
export default function FlorCheckin({ apiUrl, cambiarPagina }) {

  // Indica si la nubecita está abierta.
  const [abierto, setAbierto] = useState(false);

  // Indica si el Check-in está habilitado en el backend.
  const [disponible, setDisponible] = useState(false);

  // Mientras consultamos Express, aún no sabemos su estado.
  const [consultando, setConsultando] = useState(true);

  // Al cargar el componente consultamos su disponibilidad.
  useEffect(() => {
    const controlador = new AbortController();

    async function consultarEstado() {
      try {
        const respuesta = await fetch(
          `${apiUrl}/api/ia/estado`,
          { signal: controlador.signal }
        );

        if (!respuesta.ok) {
          throw new Error('No se pudo consultar el estado');
        }

        const datos = await respuesta.json();

        setDisponible(datos.disponible === true);

      } catch (error) {
        // Si el backend falla, dejamos el acceso bloqueado.
        if (error.name !== 'AbortError') {
          setDisponible(false);
        }

      } finally {
        if (!controlador.signal.aborted) {
          setConsultando(false);
        }
      }
    }

    consultarEstado();

    // Cancela la petición si React desmonta el componente.
    return () => controlador.abort();

  }, [apiUrl]);

  return (
    <aside className="FlorCheckin">

      {/* Nube informativa: aparece al pulsar la flor. */}
      {abierto && (
        <div className="FlorCheckin__nube">

          <span className="FlorCheckin__etiqueta">
            UN ESPACIO PARA TI
          </span>

          <h3>¿Necesitas una pausa?</h3>

          <p>
            {consultando
              ? 'Comprobando disponibilidad...'
              : disponible
                ? 'Cuéntanos cómo te sientes y encuentra un espacio para ti.'
                : 'Estamos preparando este espacio para ti. Pronto estará disponible.'}
          </p>

          {/* Solo permitimos entrar cuando Express lo autoriza. */}
          {disponible && (
            <Boton
              variante="primario"
              tamano="sm"
              onClick={() => cambiarPagina('ia')}
            >
              Ir a Check-in
            </Boton>
          )}

        </div>
      )}

      {/* Botón circular reutilizando nuestra imagen flor.png. */}
      <button
        type="button"
        className="FlorCheckin__flor"
        onClick={() => setAbierto(!abierto)}
        aria-label={abierto ? 'Cerrar invitación' : 'Abrir invitación a Check-in'}
        aria-expanded={abierto}
      >
        <img src={flor} alt="" />
      </button>

    </aside>
  );
}