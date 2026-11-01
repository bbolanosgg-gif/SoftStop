import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AsistenteIAPage from './pages/AsistenteIAPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import './styles/App.css';

// Dirección del servidor Backend de Node.js/Express
const API_URL = 'http://localhost:3000';

export default function App() {
  const [paginaActual, setPaginaActual] = useState('inicio');
  const [herramientas, setHerramientas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [usuarioAdmin, setUsuarioAdmin] = useState(null);

  // Función asíncrona para traer el catálogo desde MongoDB
  async function obtenerCatalogo() {
    setCargando(true);
    try {
      const respuesta = await fetch(`${API_URL}/api/herramientas`);
      const datos = await respuesta.json();
      if (respuesta.ok) {
        setHerramientas(datos);
      }
    } catch (error) {
      console.log('Error al conectar con la API:', error);
    } finally {
      setCargando(false);
    }
  }

  // Se ejecuta al abrir la aplicación por primera vez
  useEffect(() => {
    obtenerCatalogo();
  }, []);

  function manejarLoginExitoso(usuario) {
    setUsuarioAdmin(usuario);
    setPaginaActual('admin');
  }

  function manejarCerrarSesion() {
    setUsuarioAdmin(null);
    setPaginaActual('inicio');
  }

  return (
    <div>
      <Header
        paginaActual={paginaActual}
        cambiarPagina={setPaginaActual}
        usuarioAdmin={usuarioAdmin}
        cerrarSesion={manejarCerrarSesion}
      />

      <main>
        {paginaActual === 'inicio' && (
          <LandingPage
            herramientas={herramientas}
            cargando={cargando}
            cambiarPagina={setPaginaActual}
            apiUrl={API_URL}
          />
        )}

        {paginaActual === 'ia' && (
          <AsistenteIAPage
            apiUrl={API_URL}
            cambiarPagina={setPaginaActual}
          />
        )}

        {paginaActual === 'login' && (
          <LoginPage
            apiUrl={API_URL}
            alIniciarSesion={manejarLoginExitoso}
          />
        )}

        {paginaActual === 'admin' && (
          usuarioAdmin ? (
            <AdminPage
              apiUrl={API_URL}
              herramientas={herramientas}
              recargarHerramientas={obtenerCatalogo}
            />
          ) : (
            <LoginPage
              apiUrl={API_URL}
              alIniciarSesion={manejarLoginExitoso}
            />
          )
        )}
      </main>

      <Footer cambiarPagina={setPaginaActual} />
    </div>
  );
}