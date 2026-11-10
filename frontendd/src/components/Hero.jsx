import Boton from './Boton/Boton';
import '../styles/hero.css';

// Primera pantalla: título, subtítulo y botones
// sobre la imagen de fondo.
export default function Hero({
  cambiarPagina,
  irASeccion
}) {
  return (
    <section className="hero" id="inicio">

      <div className="hero-contenido">

        <h1 className="hero-titulo">
          El mundo afuera va demasiado{' '}

          <span className="hero-resalte">
            rápido
          </span>
        </h1>

        <p className="hero-subtitulo">
          Aquí, puedes ir a tu propio ritmo
        </p>

        <div className="hero-botones">

          <Boton
            variante="primario"
            tamano="sm"
            onClick={() => irASeccion?.('espacios')}
          >
            Conocer los espacios
          </Boton>

          <Boton
            variante="secundario"
            tamano="sm"
            onClick={() => cambiarPagina?.('ia')}
          >
            Iniciar mi Check-in
          </Boton>

        </div>

      </div>

    </section>
  );
}
