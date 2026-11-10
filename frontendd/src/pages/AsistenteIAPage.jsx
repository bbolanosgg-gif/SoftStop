import { useState } from 'react';
import Boton from '../components/Boton/Boton';
import BotonVolver from '../components/BotonVolver';
import '../styles/asistente.css';

// Página del Recomendador de Bienestar con IA (Requisito 05 del curso)
export default function AsistenteIAPage({ apiUrl, cambiarPagina }) {
  const [estadoAnimo, setEstadoAnimo] = useState('saturado');
  const [tareaPendiente, setTareaPendiente] = useState('');
  const [recomendacion, setRecomendacion] = useState(null);
  const [cargandoIA, setCargandoIA] = useState(false);

  async function consultarRecomendador(event) {
    event.preventDefault();
    setCargandoIA(true);

    try {
      const respuesta = await fetch(`${apiUrl}/api/ia/recomendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estadoAnimo: estadoAnimo,
          tareaPendiente: tareaPendiente
        })
      });

      const datos = await respuesta.json();
      if (respuesta.ok) {
        setRecomendacion(datos);
      }
    } catch (error) {
      console.log('Error al consultar la IA:', error);
    } finally {
      setCargandoIA(false);
    }
  }

  return (
    <section className="asistente-pagina">
      {/* Botón para volver rápidamente a la landing */}
      <div className="asistente-volver-wrap">
        <BotonVolver alClick={() => cambiarPagina('inicio')} />
      </div>

      <header className="asistente-encabezado">
        <span className="asistente-eyebrow">IA Aplicada al Bienestar</span>
        <h1 className="asistente-titulo">Recomendador Inteligente SoftStop</h1>
        <p className="asistente-descripcion">
          Cuéntanos cómo te sientes en este momento y qué actividad tienes pendiente. Nuestro asistente analizará tu caso y te recomendará la herramienta ideal de nuestro catálogo junto con un micro-paso inmediato.
        </p>
      </header>

      <div className="asistente-grid">
        {/* Columna Izquierda: Formulario de entrada */}
        <div className="asistente-tarjeta">
          <h2 className="asistente-tarjeta-titulo">¿Qué te detiene hoy?</h2>

          <form className="asistente-form" onSubmit={consultarRecomendador}>
            <div className="asistente-campo">
              <label htmlFor="ia-estado-animo">1. Elige el estado que más te identifique</label>
              <select
                id="ia-estado-animo"
                value={estadoAnimo}
                onChange={(e) => setEstadoAnimo(e.target.value)}
              >
                <option value="saturado">Me siento saturado / Con mucho ruido mental</option>
                <option value="sin_energia">No tengo energía / Me cuesta empezar</option>
                <option value="organizar">Estoy bien, solo quiero organizar mis pendientes</option>
              </select>
            </div>

            <div className="asistente-campo">
              <label htmlFor="ia-tarea-pendiente">2. ¿Qué tarea o materia tienes en mente? (Opcional)</label>
              <input
                id="ia-tarea-pendiente"
                type="text"
                value={tareaPendiente}
                onChange={(e) => setTareaPendiente(e.target.value)}
                placeholder="Ej: Estudiar para el parcial de Cálculo..."
              />
            </div>

            <Boton
              type="submit"
              variante="primario"
              tamano="lg"
              anchoCompleto
              disabled={cargandoIA}
            >
              {cargandoIA ? 'Generando recomendación...' : 'Obtener recomendación →'}
            </Boton>
          </form>
        </div>

        {/* Columna Derecha: Resultado generado por la IA */}
        <div className="asistente-tarjeta">
          <span className="asistente-eyebrow">Respuesta del Asistente</span>

          {!recomendacion ? (
            <div className="asistente-resultado-vacio">
              <span className="asistente-icono-espera" aria-hidden="true">🌱</span>
              <p>
                Completa los datos a la izquierda y presiona el botón para recibir tu ruta personalizada de hoy.
              </p>
            </div>
          ) : (
            <div className="asistente-resultado-contenido">
              <span className="asistente-herramienta-badge">
                ✨ {recomendacion.herramientaSugerida}
              </span>

              <p className="asistente-consejo">{recomendacion.consejoPractica}</p>

              <div className="asistente-micropaso">
                <strong className="asistente-micropaso-titulo">🌱 Tu micro-paso de ahora:</strong>
                <p className="asistente-micropaso-texto">{recomendacion.microPaso}</p>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                <Boton
                  type="button"
                  variante="secundario"
                  tamano="md"
                  onClick={() => cambiarPagina('inicio')}
                >
                  Ver en el catálogo
                </Boton>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
