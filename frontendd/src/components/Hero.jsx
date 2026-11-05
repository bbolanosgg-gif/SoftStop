
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

          <button
            className="btn btn-principal"
            onClick={() => irASeccion?.('quienes-somos')}
          >
            Empezar
          </button>

          <button
            className="btn btn-secundario"
            onClick={() => cambiarPagina?.('ia')}
          >
            Recomendador IA
          </button>

        </div>

      </div>

    </section>
  );
}
