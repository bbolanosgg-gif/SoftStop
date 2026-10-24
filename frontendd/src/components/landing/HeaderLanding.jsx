import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import logoImg from '../../assets/img/Logo.png'

function HeaderLanding() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Revelado suave de la marca después de montar
    const timer = setTimeout(() => setVisible(true), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <header className="LandingEncabezado">
      <a
        href="#inicio"
        className={`LandingMarca${visible ? ' visible' : ''}`}
        aria-label="SoftStop, volver al inicio"
      >
        SOFTSTOP
      </a>

      <div className="LandingEncabezadoAcciones">
        <a href="#espacios" className="LandingNavEnlace">
          Espacios
        </a>

        <Link to="/contacto" className="LandingNavEnlace">
          Contacto
        </Link>

        <Link to="/login" className="LandingBotonEntrar">
          ENTRAR
        </Link>

        <a href="#inicio" className="LandingLogoContenedor" aria-label="Logo SoftStop">
          <img src={logoImg} alt="Logo Soft Stop" className="LandingLogoImg" />
        </a>
      </div>
    </header>
  )
}

export default HeaderLanding
