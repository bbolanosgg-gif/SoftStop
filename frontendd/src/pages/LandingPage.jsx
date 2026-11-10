import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactoSection from '../components/ContactoSection';
import Hero from '../components/Hero';
import IntroSection from '../components/IntroSection';
import EspaciosSection from '../components/EspaciosSection';

// Página principal (Landing Page) de SoftStop.
// Ahora renderiza su propio Header y Footer para que aparezcan
// EXCLUSIVAMENTE en la Landing Page y no en el Asistente IA ni en otras páginas.
export default function LandingPage({
  cambiarPagina,
  irASeccion,
  herramientas,
  cargando,
  apiUrl,
  usuarioAdmin,
  cerrarSesion
}) {
  return (
    <div>
      {/* Header público: se muestra exclusivamente en la Landing Page */}
      <Header
        paginaActual="inicio"
        cambiarPagina={cambiarPagina}
        irASeccion={irASeccion}
        usuarioAdmin={usuarioAdmin}
        cerrarSesion={cerrarSesion}
      />

      {/* 1. HERO PRINCIPAL */}
      <Hero
        cambiarPagina={cambiarPagina}
        irASeccion={irASeccion}
      />

      <IntroSection />

      {/* Mazo de cartas: recibe las herramientas visibles */}
      <EspaciosSection
        cambiarPagina={cambiarPagina}
        herramientas={herramientas}
        cargando={cargando}
      />

      {/* FORMULARIO DE CONTACTO */}
      <ContactoSection apiUrl={apiUrl} />

      {/* Footer público: se muestra exclusivamente en la Landing Page */}
      <Footer
        cambiarPagina={cambiarPagina}
        irASeccion={irASeccion}
      />
    </div>
  );
}
