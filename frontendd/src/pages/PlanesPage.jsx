import BotonVolver from '../components/BotonVolver';
import TarjetaPlan from '../components/TarjetaPlan';
import '../styles/planes.css';

// Página de Planes y Precios de SoftStop.
// Muestra una propuesta transparente de acompañamiento sin implementar pasarelas de pago.
export default function PlanesPage({ cambiarPagina }) {
  // 1. Beneficios incluidos en el plan Free (versión actual disponible)
  const beneficiosFree = [
    'Check-in básico.',
    'Ejercicios esenciales de Reset.',
    'Organización básica con Think.',
    'Diario personal con Journal.',
    'Registro de avances con Journey.'
  ];

  // 2. Beneficios propuestos para el plan Plus (propuesta futura)
  const beneficiosPlus = [
    'Todo lo incluido en Free.',
    'Más orientaciones personalizadas con IA.',
    'Planes de acción adaptados a tus prioridades.',
    'Reflexiones y resúmenes del diario.',
    'Seguimiento más detallado de tus avances.'
  ];

  return (
    <div className="planes-pantalla">
      {/* Botón superior para regresar a la Landing Page */}
      <BotonVolver alClick={() => cambiarPagina('inicio')} />

      {/* Encabezado con título y subtítulo */}
      <header className="planes-encabezado">
        <h1 className="planes-titulo">Un espacio a tu ritmo</h1>
        <p className="planes-subtitulo">
          Comienza gratis y, cuando lo necesites, elige un acompañamiento más personalizado que se ajuste a ti
        </p>
      </header>

      {/* Contenedor de las dos tarjetas de precios */}
      <div className="planes-grid">
        {/* Tarjeta 1: Plan Free */}
        <TarjetaPlan
          nombre="Free"
          precio="Gratis"
          precioSecundario="Acceso libre y sin costo"
          etiqueta="Actual"
          descripcion="Un espacio para comenzar a tu ritmo."
          beneficios={beneficiosFree}
          textoBoton="Comenzar gratis"
          variante="free"
          alHacerClic={() => cambiarPagina('inicio')}
        />

        {/* Tarjeta 2: Plan Plus (propuesta futura) */}
        <TarjetaPlan
          nombre="Plus"
          precio="$9.900 COP/mes"
          precioSecundario="o $89.900 COP/año (propuesta)"
          etiqueta="Propuesta futura"
          descripcion="Un acompañamiento más personalizado para ti."
          beneficios={beneficiosPlus}
          textoBoton="Próximamente"
          variante="plus"
          deshabilitado={true}
        />
      </div>
    </div>
  );
}
