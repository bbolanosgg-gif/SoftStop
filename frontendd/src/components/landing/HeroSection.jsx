import { useState, useEffect } from 'react'
import castilloImg from '../../assets/img/Castillo.png'
import sombrillaImg from '../../assets/img/Sombrilla.png'
import ramaHeroImg from '../../assets/img/rama-hero.png'

function HeroSection() {
  const [iniciado, setIniciado] = useState(false)

  useEffect(() => {
    // Dispara la secuencia sincronizada una vez montado el componente
    const timer = setTimeout(() => {
      setIniciado(true)
    }, 80)

    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="Hero" id="inicio">
      {/* 1. Sombra reflejada en el agua (emerge del horizonte hacia abajo) */}
      <div className="Contenedor-Sombra">
        <img
          src={sombrillaImg}
          className={`Hero-Sombra${iniciado ? ' visible' : ''}`}
          aria-hidden="true"
          alt=""
        />
      </div>

      {/* 2. Castillo (emerge del horizonte hacia arriba) */}
      <div className="Contenedor-Castillo">
        <img
          src={castilloImg}
          className={`Hero-Castillo${iniciado ? ' visible' : ''}`}
          aria-hidden="true"
          alt=""
        />
      </div>

      {/* 3. Título principal */}
      <div className="HeroTexto">
        <h1 className={`HeroTitulo${iniciado ? ' visible' : ''}`}>
          El mundo afuera<br />
          va demasiado rápido
          <span className="HeroAqui">Aquí no</span>
        </h1>
      </div>

      {/* 4. Letras de fondo "DESACELERA" */}
      <p
        className={`HeroDesacelera${iniciado ? ' visible' : ''}`}
        aria-hidden="true"
      >
        DESACELERA
      </p>

      {/* 5. Rama meciéndose sutilmente con el viento */}
      <img
        src={ramaHeroImg}
        className="Hero-Rama"
        aria-hidden="true"
        alt=""
      />
    </section>
  )
}

export default HeroSection
