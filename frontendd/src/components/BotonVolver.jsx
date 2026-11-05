// Botón "Volver" reutilizable para las pantallas de acceso.
// Usa la clase .LoginVolver de login.css (vidrio + flecha animada).
export default function BotonVolver({ alClick }) {
  return (
    <button type="button" className="LoginVolver" onClick={alClick}>
      {/* Flecha hacia la izquierda */}
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
           stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      Volver
    </button>
  );
}