import { Link } from 'react-router-dom'

// "titulo" es una PROP: un dato que le pasamos al componente desde afuera.
// Así usamos UN solo componente para varias pantallas, cambiando solo el título.
function EnConstruccionPage({ titulo }) {
  return (
    <main style={{ padding: '40px', textAlign: 'center' }}>
      <h1>{titulo}</h1>
      <p>Esta pantalla aún está en construcción.</p>

      {/* <Link> es el reemplazo de <a href>: cambia de página SIN recargar el navegador */}
      <Link to="/login">Volver al login</Link>
    </main>
  )
}

export default EnConstruccionPage