import logo from '../assets/img/logo.png';
import '../styles/footer.css';

// Si tienes la flor rosada de la derecha como imagen en src/assets/img/, 
// puedes importarla aquí (ej: import florFooter from '../assets/img/flor-footer.png';)

export default function Footer({ cambiarPagina, irASeccion }) {
  
  // Función inteligente para sustentar: 
  // Si el usuario está en "Login" o "Asistente IA" y toca un enlace del Footer,
  // primero lo devuelve a 'inicio' y luego hace el scroll suave a la sección.
  function navegarASeccion(idSeccion) {
    if (cambiarPagina) {
      cambiarPagina('inicio');
    }
    setTimeout(() => {
      if (irASeccion) {
        irASeccion(idSeccion);
      }
    }, 50);
  }

  return (
    <footer className="footer">
      <div className="footer-contenedor">
        
        {/* COLUMNA 1: Marca espaciada + Logo redondo */}
        <div className="footer-col footer-col-marca">
          <button 
            type="button" 
            className="footer-marca-btn"
            onClick={() => cambiarPagina && cambiarPagina('inicio')}
          >
            <span className="footer-marca-texto">SoftStop</span>
            <img src={logo} alt="Logo de SoftStop" className="footer-logo" />
          </button>
        </div>

        {/* COLUMNA 2: Espacios */}
        <div className="footer-col">
          <h4 className="footer-titulo">ESPACIOS</h4>
          <ul className="footer-lista">
            <li><button type="button" onClick={() => navegarASeccion('espacios')}>Think</button></li>
            <li><button type="button" onClick={() => navegarASeccion('espacios')}>Reset</button></li>
            <li><button type="button" onClick={() => navegarASeccion('espacios')}>Journey</button></li>
            <li><button type="button" onClick={() => navegarASeccion('espacios')}>Journaling</button></li>
            <li><button type="button" onClick={() => navegarASeccion('espacios')}>Check-in</button></li>
          </ul>
        </div>

        {/* COLUMNA 3: Contacto + Redes Sociales */}
        <div className="footer-col footer-col-contacto">
          <h4 className="footer-titulo">CONTACTO</h4>
          <ul className="footer-lista footer-lista-contacto">
            <li><button type="button" onClick={() => navegarASeccion('quienes-somos')}>Sobre nosotros</button></li>
            <li><button type="button" onClick={() => navegarASeccion('contacto')}>Contacto</button></li>
          </ul>

          {/* Puntitos decorativos e íconos de Instagram y GitHub */}
          <div className="footer-redes-wrapper">
            
            <div className="footer-redes">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"></rect>
                  <circle cx="12" cy="12" r="4"></circle>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor"></circle>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* COLUMNA 4: Frase inspiracional + Flor de cerezo */}
        <div className="footer-col footer-col-frase">
          <p className="footer-frase">
            Tu espacio para <br /> reconectar contigo
          </p>
          <span className="footer-flor" aria-hidden="true">🌸</span>
        </div>

      </div>
    </footer>
  );
}