
import ContactoSection from '../components/ContactoSection';
import Hero from '../components/Hero';
import IntroSection from '../components/IntroSection';
import EspaciosSection from '../components/EspaciosSection';

// Página principal (Landing Page) de SoftStop
export default function LandingPage({
  cambiarPagina,
  irASeccion,
  herramientas,
  cargando,
  apiUrl
}) {
  return (
    <div>

      {/* 1. HERO PRINCIPAL */}
      <Hero
        cambiarPagina={cambiarPagina}
        irASeccion={irASeccion}
      />

      <IntroSection />

      {/* NUEVO: el mazo recibe las herramientas visibles y si todavía están cargando */}
      <EspaciosSection
        cambiarPagina={cambiarPagina}
        herramientas={herramientas}
        cargando={cargando}
      />

      {/* 5. FORMULARIO DE CONTACTO */}
      <ContactoSection apiUrl={apiUrl} />

    </div>
  );
}