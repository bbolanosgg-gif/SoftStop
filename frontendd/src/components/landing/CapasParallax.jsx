import { useEffect, useRef } from 'react'
import muelleImg from '../../assets/img/muelle-barca.png'
import pajarosImg from '../../assets/img/pajaros.png'

function CapasParallax() {
  const muelleRef = useRef(null)
  const pajarosRef = useRef(null)

  useEffect(() => {
    let animando = false

    const alScrollear = () => {
      if (animando) return
      animando = true

      window.requestAnimationFrame(() => {
        animando = false
        const seccionMensajes = document.getElementById('mensajes')
        if (!seccionMensajes) return

        const rectMensajes = seccionMensajes.getBoundingClientRect()
        const alturaVentana = window.innerHeight
        const progreso = alturaVentana - rectMensajes.top

        if (progreso > 0 && progreso < rectMensajes.height + alturaVentana) {
          // Animación suave del muelle
          if (muelleRef.current) {
            const opacidadMuelle = Math.min(1, progreso / 550)
            const movimientoY = Math.min(150, progreso * 0.15)
            muelleRef.current.style.opacity = opacidadMuelle
            muelleRef.current.style.transform = `translate3d(0, -${movimientoY}px, 0)`
          }

          // Animación suave de los pájaros
          if (pajarosRef.current) {
            const opacidadPajaros = Math.min(1, progreso / 380)
            const movX = progreso * 0.08
            const movY = progreso * 0.04
            pajarosRef.current.style.opacity = opacidadPajaros
            pajarosRef.current.style.transform = `translate3d(-${movX}px, -${movY}px, 0)`
          }
        } else if (progreso <= 0) {
          // Ocultar al volver a la parte superior (Hero)
          if (muelleRef.current) {
            muelleRef.current.style.opacity = '0'
            muelleRef.current.style.transform = 'translate3d(0, 0, 0)'
          }
          if (pajarosRef.current) {
            pajarosRef.current.style.opacity = '0'
            pajarosRef.current.style.transform = 'translate3d(0, 0, 0)'
          }
        }
      })
    }

    window.addEventListener('scroll', alScrollear, { passive: true })
    alScrollear()

    return () => {
      window.removeEventListener('scroll', alScrollear)
    }
  }, [])

  return (
    <div className="CapasDecorativas" aria-hidden="true">
      <img
        ref={pajarosRef}
        src={pajarosImg}
        className="Capa-Pajaros"
        alt=""
        loading="lazy"
      />
      <img
        ref={muelleRef}
        src={muelleImg}
        className="Capa-Muelle"
        alt=""
        loading="lazy"
      />
    </div>
  )
}

export default CapasParallax
