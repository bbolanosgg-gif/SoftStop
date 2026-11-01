import { useState } from 'react';
import HerramientaCard from './HerramientaCard';

// Sección que muestra el catálogo de herramientas de SoftStop con filtro sencillo
export default function CatalogoSection({ herramientas, cargando }) {
  const [filtro, setFiltro] = useState('todas');

  // Filtramos las herramientas usando .filter() como se vio en clase
  const herramientasFiltradas = herramientas.filter((item) => {
    if (filtro === 'todas') return true;
    return item.estadoDisponibilidad === filtro;
  });

  return (
    <section className="contenedor" id="catalogo">
      <span className="eyebrow">Catálogo de Bienestar</span>
      <h2 className="titulo-seccion">Espacios de calma y enfoque</h2>
      <p className="subtitulo-seccion">
        Conoce las herramientas que integran la propuesta de SoftStop. Identificamos cuáles hacen parte de nuestro catálogo actual y cuáles están proyectadas como mejoras futuras.
      </p>

      {/* Botones para filtrar el catálogo */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '26px', flexWrap: 'wrap' }}>
        <button
          type="button"
          className={filtro === 'todas' ? 'btn-morado' : 'nav-btn'}
          onClick={() => setFiltro('todas')}
        >
          Todas ({herramientas.length})
        </button>
        <button
          type="button"
          className={filtro === 'Disponible en catálogo' ? 'btn-morado' : 'nav-btn'}
          onClick={() => setFiltro('Disponible en catálogo')}
        >
          Disponibles en catálogo
        </button>
        <button
          type="button"
          className={filtro === 'Próximamente' ? 'btn-morado' : 'nav-btn'}
          onClick={() => setFiltro('Próximamente')}
        >
          Próximamente (Mejoras futuras)
        </button>
      </div>

      {cargando ? (
        <p>Cargando herramientas del catálogo...</p>
      ) : herramientasFiltradas.length === 0 ? (
        <p>No hay herramientas registradas para este filtro.</p>
      ) : (
        <div className="grid-3">
          {herramientasFiltradas.map((item) => (
            <HerramientaCard
              key={item._id}
              herramienta={item}
              esAdmin={false}
            />
          ))}
        </div>
      )}
    </section>
  );
}