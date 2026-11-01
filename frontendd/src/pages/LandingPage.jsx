import CatalogoSection from '../components/CatalogoSection';
import ContactoSection from '../components/ContactoSection';

// Página principal (Landing Page) de SoftStop
export default function LandingPage({ herramientas, cargando, cambiarPagina, apiUrl }) {
  return (
    <div>
      {/* 1. HERO PRINCIPAL */}
      <section className="hero">
        <span className="eyebrow">Bienestar Emocional y Productividad Consciente</span>
        <h1>El mundo afuera va demasiado rápido. Aquí no.</h1>
        <p className="hero-desacelera">DESACELERA</p>
        <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--color-suave)' }}>
          SoftStop es un espacio digital pensado para estudiantes universitarios que necesitan hacer una pausa, ordenar su mente y avanzar paso a paso sin agotarse.
        </p>

        <div className="hero-botones">
          <button className="btn-morado" onClick={() => cambiarPagina('ia')}>
            ✨ Probar Recomendador IA
          </button>
          <a href="#catalogo" className="btn-acento" style={{ textDecoration: 'none' }}>
            Explorar Catálogo
          </a>
        </div>
      </section>

      {/* 2. PRESENTACIÓN Y PROBLEMA QUE RESUELVE */}
      <section className="contenedor">
        <div className="grid-2">
          <div className="tarjeta-glass">
            <span className="eyebrow">El Problema</span>
            <h3>Saturación mental y parálisis por análisis</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-suave)' }}>
              En la vida universitaria es común acumular entregas, sentir culpa al descansar y bloquearse frente a tareas grandes. Las aplicaciones tradicionales solo agregan listas interminables que aumentan la presión.
            </p>
          </div>

          <div className="tarjeta-glass">
            <span className="eyebrow">Nuestra Propuesta</span>
            <h3>¿Qué es SoftStop?</h3>
            <p style={{ fontSize: '14px', color: 'var(--color-suave)' }}>
              No necesitas más presión, necesitas saber cómo avanzar. SoftStop integra micro-pausas de regulación emocional con herramientas simples de enfoque para que estudies a tu ritmo.
            </p>
          </div>
        </div>
      </section>

      {/* 3. BENEFICIOS Y CARACTERÍSTICAS PRINCIPALES */}
      <section className="contenedor">
        <span className="eyebrow">Por qué usar SoftStop</span>
        <h2 className="titulo-seccion">Beneficios para tu rutina académica</h2>

        <div className="grid-3">
          <article className="tarjeta-glass">
            <span className="tarjeta-icono">🌱</span>
            <h3>Primero tu calma</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--color-suave)' }}>
              Reconoce tu nivel de energía antes de exigirte largas jornadas de estudio.
            </p>
          </article>

          <article className="tarjeta-glass">
            <span className="tarjeta-icono">🎯</span>
            <h3>Una cosa a la vez</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--color-suave)' }}>
              Transforma tareas abrumadoras en micro-pasos concretos y alcanzables.
            </p>
          </article>

          <article className="tarjeta-glass">
            <span className="tarjeta-icono">🤖</span>
            <h3>Orientación con IA</h3>
            <p style={{ fontSize: '13.5px', color: 'var(--color-suave)' }}>
              Recibe sugerencias personalizadas según tu estado emocional del momento.
            </p>
          </article>
        </div>
      </section>

      {/* 4. CATÁLOGO DE HERRAMIENTAS DE SOFTSTOP */}
      <CatalogoSection herramientas={herramientas} cargando={cargando} />

      {/* 5. FORMULARIO DE CONTACTO REAL */}
      <ContactoSection apiUrl={apiUrl} />
    </div>
  );
}