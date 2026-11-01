import { useState, useEffect } from 'react';
import HerramientaCard from '../components/HerramientaCard';

// Panel de Administración para gestionar herramientas del catálogo y ver mensajes
export default function AdminPage({ apiUrl, herramientas, recargarHerramientas }) {
  const [mensajes, setMensajes] = useState([]);
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [beneficio, setBeneficio] = useState('');
  const [icono, setIcono] = useState('🌸');
  const [estadoDisponibilidad, setEstadoDisponibilidad] = useState('Disponible en catálogo');
  const [aviso, setAviso] = useState('');

  // Cargamos los mensajes de contacto guardados en MongoDB
  async function cargarMensajes() {
    try {
      const respuesta = await fetch(`${apiUrl}/api/contacto`);
      const datos = await respuesta.json();
      if (respuesta.ok) {
        setMensajes(datos);
      }
    } catch (error) {
      console.log('Error cargando mensajes:', error);
    }
  }

  useEffect(() => {
    cargarMensajes();
  }, []);

  // Crear nueva herramienta en el catálogo
  async function crearNuevaHerramienta(event) {
    event.preventDefault();
    setAviso('');

    if (!nombre.trim() || !descripcion.trim() || !beneficio.trim()) {
      setAviso('Completa todos los campos de la herramienta.');
      return;
    }

    try {
      const respuesta = await fetch(`${apiUrl}/api/herramientas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre,
          descripcion,
          beneficio,
          icono,
          estadoDisponibilidad
        })
      });

      if (respuesta.ok) {
        setNombre('');
        setDescripcion('');
        setBeneficio('');
        setAviso('¡Herramienta agregada al catálogo!');
        recargarHerramientas();
      }
    } catch (error) {
      setAviso('Error al guardar la herramienta.');
    }
  }

  // Eliminar una herramienta por su ID
  async function eliminarHerramienta(id) {
    try {
      const respuesta = await fetch(`${apiUrl}/api/herramientas/${id}`, {
        method: 'DELETE'
      });
      if (respuesta.ok) {
        recargarHerramientas();
      }
    } catch (error) {
      console.log('Error al eliminar:', error);
    }
  }

  return (
    <section className="contenedor">
      <span className="eyebrow">Panel Admin · SoftStop</span>
      <h1 className="titulo-seccion">Gestión Interna de la Plataforma</h1>

      <div className="grid-2" style={{ marginBottom: '48px' }}>
        {/* Formulario para agregar tarjetas al catálogo */}
        <div className="tarjeta-glass">
          <h3>Agregar herramienta al catálogo</h3>
          <form className="formulario" onSubmit={crearNuevaHerramienta}>
            <div className="campo-form">
              <label>Nombre de la herramienta</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej: Audio de Calma"
              />
            </div>

            <div className="campo-form">
              <label>Descripción breve</label>
              <textarea
                rows="2"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Explica en qué consiste..."
              />
            </div>

            <div className="campo-form">
              <label>Beneficio para el estudiante</label>
              <input
                type="text"
                value={beneficio}
                onChange={(e) => setBeneficio(e.target.value)}
                placeholder="Ej: Ayuda a descansar la vista entre bloques"
              />
            </div>

            <div className="campo-form">
              <label>Icono (Emoji) y Disponibilidad</label>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  style={{ width: '70px', textAlign: 'center' }}
                  value={icono}
                  onChange={(e) => setIcono(e.target.value)}
                />
                <select
                  value={estadoDisponibilidad}
                  onChange={(e) => setEstadoDisponibilidad(e.target.value)}
                >
                  <option value="Disponible en catálogo">Disponible en catálogo</option>
                  <option value="Próximamente">Próximamente</option>
                </select>
              </div>
            </div>

            {aviso && <p className="alerta-exito">{aviso}</p>}

            <button type="submit" className="btn-morado">
              + Guardar en el catálogo
            </button>
          </form>
        </div>

        {/* Bandeja de mensajes recibidos desde Contacto */}
        <div className="tarjeta-glass">
          <h3>Mensajes de Contacto ({mensajes.length})</h3>
          {mensajes.length === 0 ? (
            <p style={{ fontSize: '13.5px', color: 'var(--color-suave)' }}>
              Aún no se han recibido mensajes desde el formulario público.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '360px', overflowY: 'auto' }}>
              {mensajes.map((m) => (
                <div
                  key={m._id}
                  style={{ padding: '12px', background: 'rgba(251, 244, 234, 0.8)', borderRadius: '12px', fontSize: '13px' }}
                >
                  <strong>{m.nombre}</strong> ({m.email}) · <span className="badge-estado badge-proximamente">{m.asunto}</span>
                  <p style={{ marginTop: '6px' }}>{m.mensaje}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Catálogo actual con opción de eliminar */}
      <h2 className="titulo-seccion" style={{ fontSize: '26px' }}>
        Herramientas actuales en la Base de Datos ({herramientas.length})
      </h2>
      <div className="grid-3">
        {herramientas.map((item) => (
          <HerramientaCard
            key={item._id}
            herramienta={item}
            esAdmin={true}
            onEliminar={eliminarHerramienta}
          />
        ))}
      </div>
    </section>
  );
}