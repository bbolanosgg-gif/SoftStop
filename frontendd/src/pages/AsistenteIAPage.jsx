import { useState } from 'react';

// Página del Recomendador de Bienestar con IA (Requisito 05 del PDF)
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
    <section className="contenedor">
      <span className="eyebrow">IA Aplicada al Bienestar</span>
      <h1 className="titulo-seccion">Recomendador Inteligente SoftStop</h1>
      <p className="subtitulo-seccion">
        Cuéntanos cómo te sientes en este momento y qué actividad tienes pendiente. Nuestro asistente analizará tu caso y te recomendará la herramienta ideal de nuestro catálogo junto con un micro-paso inmediato.
      </p>

      <div className="grid-2">
        <div className="tarjeta-glass">
          <h3>¿Qué te detiene hoy?</h3>
          <form className="formulario" onSubmit={consultarRecomendador}>
            <div className="campo-form">
              <label>1. Elige el estado que más te identifique</label>
              <select value={estadoAnimo} onChange={(e) => setEstadoAnimo(e.target.value)}>
                <option value="saturado">Me siento saturado / Con mucho ruido mental</option>
                <option value="sin_energia">No tengo energía / Me cuesta empezar</option>
                <option value="organizar">Estoy bien, solo quiero organizar mis pendientes</option>
              </select>
            </div>

            <div className="campo-form">
              <label>2. ¿Qué tarea o materia tienes en mente? (Opcional)</label>
              <input
                type="text"
                value={tareaPendiente}
                onChange={(e) => setTareaPendiente(e.target.value)}
                placeholder="Ej: Estudiar para el parcial de Cálculo..."
              />
            </div>

            <button type="submit" className="btn-morado">
              {cargandoIA ? 'Generando recomendación...' : 'Obtener recomendación →'}
            </button>
          </form>
        </div>

        {/* Resultado generado por el Backend */}
        <div className="tarjeta-glass">
          <span className="eyebrow">Respuesta del Asistente</span>
          {!recomendacion ? (
            <p style={{ color: 'var(--color-suave)', fontSize: '14px' }}>
              Completa los datos a la izquierda y presiona el botón para recibir tu ruta personalizada de hoy.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3>Herramienta sugerida: {recomendacion.herramientaSugerida}</h3>
              <p style={{ fontSize: '14px' }}>{recomendacion.consejoPractica}</p>
              <div style={{ padding: '14px', background: 'rgba(168, 144, 254, 0.15)', borderRadius: '14px' }}>
                <strong>🌱 Tu micro-paso de ahora:</strong>
                <p style={{ fontSize: '13.5px', marginTop: '4px' }}>{recomendacion.microPaso}</p>
              </div>
              <button
                type="button"
                className="btn-acento"
                style={{ alignSelf: 'flex-start', marginTop: '6px' }}
                onClick={() => cambiarPagina('inicio')}
              >
                Ver en el catálogo
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}