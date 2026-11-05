import '../styles/IntroSection.css';

// Importación de elementos gráficos desde tu carpeta assets
import floresIzq from '../assets/img/flores-izquierda.png';
import floresDer from '../assets/img/flores-derecha.png';
import cartelFondo from '../assets/img/cartel-fondo.png';

export default function IntroSection() {
  return (
    <section className="intro-section" id="quienes-somos">
      {/* Elementos gráficos decorativos en las esquinas */}
      <img 
        src={floresIzq} 
        alt="" 
        className="intro-decoracion flores-izq" 
        aria-hidden="true" 
      />
      <img 
        src={floresDer} 
        alt="" 
        className="intro-decoracion flores-der" 
        aria-hidden="true" 
      />

      {/* Contenedor principal de dos columnas */}
      <div className="intro-contenedor">
        
        {/* Columna izquierda: Frase principal */}
        <div className="intro-columna-texto">
          <h2 className="intro-titulo">
            A veces, <br />
            avanzar también <br />
            significa <span className="texto-resaltado">hacer <br /> una pausa.</span>
          </h2>
        </div>

        {/* Columna derecha: Cartel gráfico con texto encima */}
        <div className="intro-columna-cartel">
          <div className="cartel-wrapper">
            <img 
              src={cartelFondo} 
              alt="Marco decorativo" 
              className="cartel-imagen-fondo" 
            />
            <p className="cartel-texto">
              SoftStop es un espacio digital pensado para ayudarte a hacer una pausa, recuperar la claridad y retomar tus actividades a tu propio ritmo.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}