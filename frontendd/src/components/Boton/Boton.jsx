import './Boton.css';

function Boton({
  variante = 'primario',
  tamano = 'md',
  anchoCompleto = false,
  icono,
  type = 'button',
  children,
  ...resto
}) {
  const clases = [
    'Boton',
    `Boton--${variante}`,
    `Boton--${tamano}`,
    anchoCompleto && 'Boton--completo',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button type={type} className={clases} {...resto}>
      {icono && <span className="Boton__icono">{icono}</span>}
      {children}
    </button>
  );
}

export default Boton;