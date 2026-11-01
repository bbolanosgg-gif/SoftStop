// Tarjeta individual para mostrar una herramienta del catálogo de SoftStop
export default function HerramientaCard({ herramienta, esAdmin, onEliminar }) {
  const esDisponible = herramienta.estadoDisponibilidad === 'Disponible en catálogo';

  return (
    <article className="tarjeta-glass">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="tarjeta-icono">{herramienta.icono || '✨'}</span>
        <span className={esDisponible ? 'badge-estado badge-disponible' : 'badge-estado badge-proximamente'}>
          {herramienta.estadoDisponibilidad}
        </span>
      </div>

      <h3>{herramienta.nombre}</h3>
      <p style={{ fontSize: '13.5px', color: 'var(--color-suave)' }}>
        {herramienta.descripcion}
      </p>

      <p style={{ fontSize: '12.5px', marginTop: '6px' }}>
        <strong>Beneficio: </strong>{herramienta.beneficio}
      </p>

      {/* Si estamos en el Panel Admin, mostramos el botón para eliminar */}
      {esAdmin && (
        <button
          type="button"
          className="btn-acento"
          style={{ marginTop: '12px', alignSelf: 'flex-start', background: 'var(--color-error)' }}
          onClick={() => onEliminar(herramienta._id)}
        >
          Eliminar del catálogo
        </button>
      )}
    </article>
  );
}