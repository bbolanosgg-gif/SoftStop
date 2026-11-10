// Tarjeta individual para mostrar una herramienta del catálogo de SoftStop.
// Se usa en dos lugares:
//   - En la landing pública (esAdmin = false): solo muestra la información.
//   - En el Panel Admin (esAdmin = true): además muestra los botones de gestión.
//
// Props (los datos y funciones que le llegan desde la página que la usa):
//   herramienta       -> el objeto con los datos (viene de MongoDB)
//   esAdmin           -> true si estamos en el Panel Admin
//   onEditar          -> función que se ejecuta al presionar "Editar"
//   onAlternarVisible -> función que se ejecuta al presionar el botón de ocultar/mostrar
//   onEliminar        -> función que se ejecuta al presionar "Eliminar"

import Boton from './Boton/Boton';

export default function HerramientaCard({
  herramienta,
  esAdmin,
  onEditar,
  onAlternarVisible,
  onEliminar
}) {
  const esDisponible = herramienta.estadoDisponibilidad === 'Disponible en catálogo';

  // Una herramienta está visible salvo que "activa" sea false.
  // Usamos "!== false" para que las herramientas viejas, que quizá no
  // tengan el campo "activa", también cuenten como visibles.
  const estaVisible = herramienta.activa !== false;

  return (
    <article
      className="tarjeta-glass"
      // En el panel, una herramienta oculta se ve más tenue para distinguirla
      style={{ opacity: esAdmin && !estaVisible ? 0.55 : 1 }}
    >
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

      {/* Los botones de gestión solo se dibujan en el Panel Admin */}
      {esAdmin && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          {/* Ojo: mostrar/ocultar. El texto cambia según el estado actual */}
          <Boton
            variante="contorno"
            tamano="sm"
            icono={estaVisible ? '🙈' : '👁️'}
            onClick={() => onAlternarVisible(herramienta)}
          >
            {estaVisible ? 'Ocultar' : 'Mostrar'}
          </Boton>

          {/* Lápiz: le pasamos la herramienta completa para llenar el formulario */}
          <Boton
            variante="contorno"
            tamano="sm"
            icono="✏️"
            onClick={() => onEditar(herramienta)}
          >
            Editar
          </Boton>

          {/* Papelera: solo necesita el ID para saber cuál borrar */}
          <Boton
            variante="peligro"
            tamano="sm"
            icono="🗑️"
            onClick={() => onEliminar(herramienta._id)}
          >
            Eliminar
          </Boton>
        </div>
      )}
    </article>
  );
}