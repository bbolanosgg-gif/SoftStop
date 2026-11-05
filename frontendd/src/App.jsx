import { useState, useEffect } from 'react';

import Header from './components/Header';
import Footer from './components/Footer';
import BarraAdmin from './components/BarraAdmin';

import LandingPage from './pages/LandingPage';
import AsistenteIAPage from './pages/AsistenteIAPage';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import AdminPage from './pages/AdminPage';


// Dirección del servidor Backend de Node.js / Express
const API_URL = 'http://localhost:3000';

export default function App() {
  const [paginaActual, setPaginaActual] = useState('inicio');
  const [herramientas, setHerramientas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [usuarioAdmin, setUsuarioAdmin] = useState(null);

  // Obtener catálogo de herramientas desde MongoDB
  async function obtenerCatalogo() {
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/api/herramientas`);
      const datos = await respuesta.json();

      if (respuesta.ok) {
        setHerramientas(datos);
      }
    } catch (error) {
      console.error('Error al conectar con la API:', error);
    } finally {
      setCargando(false);
    }
  }

  // Cargar catálogo al iniciar la aplicación
  useEffect(() => {
    obtenerCatalogo();
  }, []);

  // NUEVO: la landing pública solo debe mostrar las herramientas visibles.
  // filter() crea una lista nueva dejando solo las que cumplen la condición.
  // Usamos "!== false" para que las herramientas viejas, sin el campo "activa",
  // también se consideren visibles.
  const herramientasVisibles = herramientas.filter(
    (herramienta) => herramienta.activa !== false
  );

  // Navegar hasta una sección de la Landing Page
  function irASeccion(id) {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }

  // Login exitoso: el admin va al panel, cualquier otro usuario va al inicio
  function manejarLoginExitoso(usuario) {
    setUsuarioAdmin(usuario);
    setPaginaActual(usuario.rol === 'admin' ? 'admin' : 'inicio');
  }

  // Cerrar sesión
  function manejarCerrarSesion() {
    setUsuarioAdmin(null);
    setPaginaActual('inicio');
  }

  // ¿La persona con sesión es administradora? (revisamos el rol, no solo que haya sesión)
  // El "?." evita un error cuando no hay sesión (usuarioAdmin es null)
  const esAdmin = usuarioAdmin?.rol === 'admin';

  // Login, registro, o intento de entrar al panel sin ser admin
  const esPantallaAcceso =
    paginaActual === 'login' ||
    paginaActual === 'registro' ||
    (paginaActual === 'admin' && !esAdmin);

  // Estamos dentro del panel (con permiso)
  const esPanelAdmin = paginaActual === 'admin' && esAdmin;

  return (
    <div>
      {/* Header público: no se dibuja ni en acceso ni en el panel */}
      {!esPantallaAcceso && !esPanelAdmin && (
        <Header
          paginaActual={paginaActual}
          cambiarPagina={setPaginaActual}
          irASeccion={irASeccion}
          usuarioAdmin={usuarioAdmin}
          cerrarSesion={manejarCerrarSesion}
        />
      )}

      {/* Barra propia del panel admin */}
      {esPanelAdmin && (
        <BarraAdmin
          nombre={usuarioAdmin.nombre}
          alVerSitio={() => setPaginaActual('inicio')}
          alSalir={manejarCerrarSesion}
        />
      )}

      <main>
        {paginaActual === 'inicio' && (
          <LandingPage
            herramientas={herramientasVisibles} // NUEVO: antes pasaba "herramientas"
            cargando={cargando}
            cambiarPagina={setPaginaActual}
            irASeccion={irASeccion}
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
            cambiarPagina={setPaginaActual}
          />
        )}

        {paginaActual === 'registro' && (
          <RegistroPage
            apiUrl={API_URL}
            cambiarPagina={setPaginaActual}
          />
        )}

        {paginaActual === 'admin' && (
          esAdmin ? (
            <AdminPage
              apiUrl={API_URL}
              herramientas={herramientas} // el admin SÍ recibe todas, también las ocultas
              recargarHerramientas={obtenerCatalogo}
            />
          ) : (
            <LoginPage
              apiUrl={API_URL}
              alIniciarSesion={manejarLoginExitoso}
              cambiarPagina={setPaginaActual}
            />
          )
        )}
      </main>

      {/* Footer público: no se dibuja ni en acceso ni en el panel */}
      {!esPantallaAcceso && !esPanelAdmin && (
        <Footer
          cambiarPagina={setPaginaActual}
          irASeccion={irASeccion}
        />
      )}
    </div>
  );
}