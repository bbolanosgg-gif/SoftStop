import { useState, useEffect, useRef } from 'react'

const MENSAJES = [
  {
    tipo: 'simple',
    lineas: ['Tal vez hoy solo', 'necesitas un momento'],
    acento: 'PARA TI',
  },
  {
    tipo: 'fila',
    lineas: ['No tienes que', 'hacer más.'],
    filaLinea: 'Está bien',
    filaAcento: 'PARAR',
  },
  {
    tipo: 'simple',
    lineas: ['Ve a tu ritmo'],
  },
  {
    tipo: 'simple',
    lineas: ['Y cuando estés listo'],
  },
  {
    tipo: 'simple',
    lineas: ['Podemos volver a', 'comenzar'],
    acento: 'PASO A PASO',
  },
  {
    tipo: 'simple',
    lineas: ['Descubre lo que', 'preparamos para ti'],
  },
]

function MensajesSection() {
  const [indiceActivo, setIndiceActivo] = useState(0)
  const seccionRef = useRef(null)
  const stageRef = useRef(null)

  useEffect(() => {
    let animando = false

    const alScroll = () => {
      if (animando) return
      animando = true

      window.requestAnimationFrame(() => {
        animando = false
        const seccion = seccionRef.current
        const stage = stageRef.current
        if (!seccion || !stage) return

        const recorrido = seccion.offsetHeight - stage.offsetHeight
        if (recorrido <= 0) {
          setIndiceActivo(0)
          return
        }

        const rect = seccion.getBoundingClientRect()
        // Avance de 0 a 1 conforme se recorre la sección sticky
        const avance = -rect.top / recorrido
        const limitado = Math.min(Math.max(avance, 0), 0.9999)
        const nuevoIndice = Math.floor(limitado * MENSAJES.length)

        setIndiceActivo(nuevoIndice)
      })
    }

    window.addEventListener('scroll', alScroll, { passive: true })
    window.addEventListener('resize', alScroll)
    alScroll()

    return () => {
      window.removeEventListener('scroll', alScroll)
      window.removeEventListener('resize', alScroll)
    }
  }, [])

  return (
    <section
      ref={seccionRef}
      className="Mensajes"
      id="mensajes"
      aria-label="Mensajes para ti"
    >
      <div ref={stageRef} className="MensajesStage">
        <p className="MensajesKicker">
          No necesitas más presión<br />
          necesitas cómo avanzar
        </p>

        <div className="MensajesEscena">
          {MENSAJES.map((msg, i) => {
            const activo = i === indiceActivo
            return (
              <div
                key={i}
                className={`Mensaje${activo ? ' activo' : ''}`}
                aria-hidden={activo ? 'false' : 'true'}
              >
                {msg.tipo === 'fila' ? (
                  <>
                    {msg.lineas.map((linea, lIdx) => (
                      <span key={lIdx} className="linea">
                        {linea}
                      </span>
                    ))}
                    <span className="fila">
                      <span className="linea">{msg.filaLinea}</span>
                      <span className="acento">{msg.filaAcento}</span>
                    </span>
                  </>
                ) : (
                  <>
                    {msg.lineas.map((linea, lIdx) => (
                      <span key={lIdx} className="linea">
                        {linea}
                      </span>
                    ))}
                    {msg.acento && <span className="acento">{msg.acento}</span>}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default MensajesSection
