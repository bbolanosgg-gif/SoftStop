import { Link } from 'react-router-dom'
import rocaImg from '../../assets/img/roca-cerezos.webp'

function FooterLanding() {
  return (
    <footer className="LandingFooter">
      <img
        className="FooterRoca"
        src={rocaImg}
        alt=""
        aria-hidden="true"
        loading="lazy"
      />

      <div className="FooterContenido">
        <p className="FooterMarca">SOFTSTOP</p>

        <div className="FooterColumnas">
          <div className="FooterColumna">
            <h4>ESPACIOS</h4>
            <a href="#espacios">Reset</a>
            <a href="#espacios">Unstuck</a>
            <a href="#espacios">Think</a>
            <a href="#espacios">Journey</a>
            <a href="#espacios">Check-in</a>
          </div>

          <div className="FooterColumna">
            <h4>COMUNIDAD</h4>
            <Link to="/contacto">Guía de inicio</Link>
            <Link to="/contacto">Danos feedback</Link>
            <Link to="/contacto">Soporte técnico</Link>
          </div>
        </div>

        <div className="FooterColumna FooterInfo">
          <h4>INFORMACIÓN</h4>
          <a href="#inicio">Sobre nosotros</a>
          <a href="#inicio">Términos de Servicio</a>
          <a href="#inicio">Política de Privacidad</a>
          <a href="#inicio">Uso Responsable de IA</a>
        </div>

        <div className="FooterRedes">
          {/* GitHub */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub de Softstop"
          >
            <svg
              viewBox="0 0 16 16"
              width="28"
              height="28"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>

          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Softstop"
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </a>
        </div>

        <p className="FooterBase">© 2026 Softstop · Fase Beta Pública</p>
      </div>
    </footer>
  )
}

export default FooterLanding
