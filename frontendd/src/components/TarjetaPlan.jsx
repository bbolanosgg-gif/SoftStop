import Boton from './Boton/Boton';

// Componente reutilizable para presentar un plan de precios.
// Recibe sus datos mediante props y adapta su aspecto visual con la prop 'variante'.
export default function TarjetaPlan({
  nombre,
  precio,
  precioSecundario,
  etiqueta,
  descripcion,
  beneficios = [],
  textoBoton,
  variante = 'free',
  alHacerClic,
  deshabilitado = false
}) {
  return (
    <article className={`tarjeta-plan tarjeta-plan--${variante}`}>
      {/* 1. Cabecera: Nombre del plan y distintivo opcional */}
      <div className="tarjeta-plan__cabecera">
        <div className="tarjeta-plan__titulo-wrap">
          <h3 className="tarjeta-plan__nombre">{nombre}</h3>
          {etiqueta && (
            <span className="tarjeta-plan__etiqueta">{etiqueta}</span>
          )}
        </div>
        <p className="tarjeta-plan__descripcion">{descripcion}</p>
      </div>

      {/* 2. Sección de precios */}
      <div className="tarjeta-plan__precios">
        <div className="tarjeta-plan__precio-principal">{precio}</div>
        {precioSecundario && (
          <p className="tarjeta-plan__precio-secundario">{precioSecundario}</p>
        )}
      </div>

      {/* Línea divisoria sutil */}
      <div className="tarjeta-plan__divisor" />

      {/* 3. Lista de beneficios incluidos */}
      <div className="tarjeta-plan__cuerpo">
        <p className="tarjeta-plan__beneficios-titulo">Incluye:</p>
        <ul className="tarjeta-plan__beneficios">
          {beneficios.map((beneficio, indice) => (
            <li key={indice} className="tarjeta-plan__beneficio-item">
              <span className="tarjeta-plan__icono-check" aria-hidden="true">✓</span>
              <span>{beneficio}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 4. Pie de la tarjeta: Botón reutilizable */}
      <div className="tarjeta-plan__pie">
        <Boton
          variante={variante === 'plus' ? 'secundario' : 'primario'}
          tamano="md"
          anchoCompleto
          disabled={deshabilitado}
          onClick={alHacerClic}
        >
          {textoBoton}
        </Boton>
      </div>
    </article>
  );
}
