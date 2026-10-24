import '../styles/landing.css'
import CapasParallax from '../components/landing/CapasParallax'
import HeaderLanding from '../components/landing/HeaderLanding'
import HeroSection from '../components/landing/HeroSection'
import MensajesSection from '../components/landing/MensajesSection'
import EspaciosStack from '../components/landing/EspaciosStack'
import FooterLanding from '../components/landing/FooterLanding'

function LandingPage() {
  return (
    <div className="LandingWrapper">
      {/* Fondo global degradado continuo */}
      <div className="FondoGlobal" aria-hidden="true" />

      {/* Capas decorativas de parallax (muelle y pájaros con scroll suave) */}
      <CapasParallax />

      {/* Encabezado superior */}
      <HeaderLanding />

      {/* Flujo de secciones principales */}
      <main>
        <HeroSection />
        <MensajesSection />
        <EspaciosStack />
      </main>

      {/* Pie de página con roca ornamental y enlaces */}
      <FooterLanding />
    </div>
  )
}

export default LandingPage
