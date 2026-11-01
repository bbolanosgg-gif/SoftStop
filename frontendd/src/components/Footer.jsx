// Pie de página institucional de SoftStop
export default function Footer({ cambiarPagina }) {
  return (
    <footer className="footer">
      <p style={{ fontFamily: 'var(--fuente-marca)', fontWeight: 700, letterSpacing: '0.3em', marginBottom: '10px' }}>
        SOFTSTOP
      </p>
      <p>Tu bienestar también es parte del progreso universitario.</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '18px', margin: '14px 0' }}>
        <button className="nav-btn" onClick={() => cambiarPagina('inicio')}>Inicio</button>
        <button className="nav-btn" onClick={() => cambiarPagina('ia')}>Recomendador IA</button>
        <button className="nav-btn" onClick={() => cambiarPagina('login')}>Administración</button>
      </div>
      <p>© 2026 SoftStop · Proyecto Integrador Full Stack</p>
    </footer>
  );
}