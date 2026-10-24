import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import resetImg from '../../assets/img/espacios/reset.jpg'
import unstuckImg from '../../assets/img/espacios/unstuck.jpg'
import thinkImg from '../../assets/img/espacios/think.jpg'
import journeyImg from '../../assets/img/espacios/journey.jpg'
import checkinImg from '../../assets/img/espacios/checkin.jpg'
import ramaCerezoImg from '../../assets/img/rama-cerezo.png'

const ESPACIOS_DATA = [
  {
    id: 'reset',
    titulo: 'Reset',
    kicker: 'PAUSA Y REINICIA',
    texto:
      'Vuelve a tu centro cuando la saturación mental no te deje avanzar. Un respiro guiado para reiniciar tu enfoque.',
    boton: 'Entrar a Reset',
    ruta: '/checkin',
    imagen: resetImg,
    tono: 'linear-gradient(160deg, #cfe6ea, #dcd0f4)',
    icono: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 12a9 9 0 1 1-2.6-6.4" />
        <polyline points="21 3 21 9 15 9" />
      </svg>
    ),
  },
  {
    id: 'unstuck',
    titulo: 'Unstuck',
    kicker: 'DESBLOQUEA TU MENTE',
    texto:
      'Herramientas prácticas para superar la parálisis por análisis y dar el siguiente paso en tu estudio.',
    boton: 'Entrar a Unstuck',
    ruta: '/checkin',
    imagen: unstuckImg,
    tono: 'linear-gradient(160deg, #ffdcc0, #f7c4d2)',
    icono: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M13 2 3 14h7l-1 8 11-14h-7l1-6z" />
      </svg>
    ),
  },
  {
    id: 'think',
    titulo: 'Think',
    kicker: 'REFLEXIÓN PROFUNDA',
    texto:
      'Espacio seguro para ordenar tus ideas, planificar sin presión y encontrar claridad mental.',
    boton: 'Entrar a Think',
    ruta: '/checkin',
    imagen: thinkImg,
    tono: 'linear-gradient(160deg, #d8c9f5, #bcd0f2)',
    tieneRama: true,
    ramaIzq: false,
    icono: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    id: 'journey',
    titulo: 'Journey',
    kicker: 'VISUALIZA TU PROGRESO',
    texto:
      'Un registro visual de tus pequeños logros diarios para recordarte lo mucho que has avanzado.',
    boton: 'Ver Journey',
    ruta: '/checkin',
    imagen: journeyImg,
    tono: 'linear-gradient(160deg, #f6d3e2, #d9c9f5)',
    tieneRama: true,
    ramaIzq: true,
    icono: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
  },
  {
    id: 'checkin',
    titulo: 'Check-in',
    kicker: 'EVALÚA TU ESTADO ACTUAL',
    texto:
      'Un diagnóstico rápido de 2 minutos para entender cómo te sientes y qué necesitas ahora mismo.',
    boton: 'Hacer Check-in',
    ruta: '/checkin',
    imagen: checkinImg,
    tono: 'linear-gradient(160deg, #cdeaee, #d3dcf5)',
    icono: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
]

function EspaciosStack() {
  const [actual, setActual] = useState(0)
  const [pausado, setPausado] = useState(false)
  const total = ESPACIOS_DATA.length

  const siguiente = useCallback(() => {
    setActual((prev) => (prev + 1) % total)
  }, [total])

  useEffect(() => {
    if (pausado) return

    // Rotación suave cada 5 segundos (cómoda para leer)
    const interval = setInterval(siguiente, 5000)
    return () => clearInterval(interval)
  }, [pausado, siguiente])

  const obtenerSlot = (indice) => {
    const derecha = (actual + 1) % total
    const izquierda = (actual - 1 + total) % total

    if (indice === actual) return 'front'
    if (indice === derecha) return 'right'
    if (indice === izquierda) return 'left'
    return 'hidden'
  }

  const manejarClickTarjeta = (indice, slot) => {
    if (slot === 'left' || slot === 'right') {
      setActual(indice)
    }
  }

  return (
    <section className="Espacios" id="espacios">
      <h2 className="EspaciosTitulo">
        Explora nuestros<br />
        espacios de Calma
      </h2>

      <div
        className="wrap_stack"
        onMouseEnter={() => setPausado(true)}
        onMouseLeave={() => setPausado(false)}
      >
        {ESPACIOS_DATA.map((espacio, i) => {
          const slot = obtenerSlot(i)
          return (
            <article
              key={espacio.id}
              className="stack-card"
              data-slot={slot}
              style={{ '--tono': espacio.tono }}
              onClick={() => manejarClickTarjeta(i, slot)}
            >
              <div className="stack-content">
                <div className="stack-media">
                  <img src={espacio.imagen} alt="" loading="lazy" />
                </div>
                <div className="stack-icon">{espacio.icono}</div>
                <h3 className="stack-title">{espacio.titulo}</h3>
                <p className="stack-kicker">{espacio.kicker}</p>
                <p className="stack-text">{espacio.texto}</p>
                <Link to={espacio.ruta} className="stack-btn">
                  {espacio.boton}
                </Link>
              </div>

              {espacio.tieneRama && (
                <img
                  className={`stack-rama${espacio.ramaIzq ? ' stack-rama--izq' : ''}`}
                  src={ramaCerezoImg}
                  alt=""
                  aria-hidden="true"
                />
              )}
            </article>
          )
        })}
      </div>

      {/* Puntos de navegación inferior */}
      <div
        className="stack-dots"
        role="tablist"
        aria-label="Navegación de espacios"
      >
        {ESPACIOS_DATA.map((espacio, i) => (
          <button
            key={espacio.id}
            type="button"
            className="stack-dot"
            aria-label={`Ver espacio ${espacio.titulo}`}
            aria-current={i === actual ? 'true' : 'false'}
            onClick={() => setActual(i)}
          />
        ))}
      </div>
    </section>
  )
}

export default EspaciosStack
