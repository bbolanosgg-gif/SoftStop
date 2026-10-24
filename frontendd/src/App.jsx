import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ContactoPage from './pages/ContactoPage'
import EnConstruccionPage from './pages/EnConstruccionPage'

function App() {
  return (
    // <Routes> mira la URL y muestra SOLO la <Route> que coincida
    <Routes>
      {/* Landing page oficial en la raíz */}
      <Route path="/" element={<LandingPage />} />

      {/* Autenticación y Contacto */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/contacto" element={<ContactoPage />} />

      {/* Pantallas de relleno para el flujo de la aplicación */}
      <Route path="/dashboard" element={<EnConstruccionPage titulo="Dashboard" />} />
      <Route path="/admin" element={<EnConstruccionPage titulo="Panel admin" />} />
      <Route path="/checkin" element={<EnConstruccionPage titulo="Check-in" />} />

      {/* "*" significa "cualquier otra URL" */}
      <Route path="*" element={<EnConstruccionPage titulo="Página no encontrada" />} />
    </Routes>
  )
}

export default App
