import { useState, useEffect } from 'react';

import BarraAdmin from './components/BarraAdmin';

import LandingPage from './pages/LandingPage';
import PlanesPage from './pages/PlanesPage';
import AsistenteIAPage from './pages/AsistenteIAPage';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import AdminPage from './pages/AdminPage';


// Dirección del servidor Backend de Node.js / Express
const API_URL = 'http://localhost:3000';

export default function App() {
  // Persistencia básica de sesión usando localStorage
  const [usuarioAdmin, setUsuarioAdmin] = useState(() => {
    try {
      const guardado = localStorage.getItem('softstop_usuario');
      return guardado ? JSON.parse(guardado) : null;
    } catch {
      return null;
    }
  });

  // Si el usuario guardado es administrador, lo mantenemos en el panel al refrescar
  const [paginaActual, setPaginaActual] = useState(() => {
    try {
      const guardado = localStorage.getItem('softstop_usuario');
      if (guardado) {
        const u = JSON.parse(guardado);
        if (u?.rol === 'admin') return 'admin';
      }
    } catch {}
    return 'inicio';
  });

  const [herramientas, setHerramientas] = useState([]);
  const [cargando, setCargando] = useState(true);

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

  // La landing pública solo debe mostrar las herramientas visibles.
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

  // Login exitoso: guardamos en localStorage y redirigimos según rol
  function manejarLoginExitoso(usuario) {
    setUsuarioAdmin(usuario);
    try {
      localStorage.setItem('softstop_usuario', JSON.stringify(usuario));
    } catch (e) {
      console.warn('No se pudo guardar la sesión en el navegador');
    }
    setPaginaActual(usuario.rol === 'admin' ? 'admin' : 'inicio');
  }

  // Cerrar sesión: eliminamos de localStorage y volvemos al inicio
  function manejarCerrarSesion() {
    setUsuarioAdmin(null);
    try {
      localStorage.removeItem('softstop_usuario');
    } catch (e) {
      console.warn('No se pudo limpiar la sesión');
    }
    setPaginaActual('inicio');
  }

  // ¿La persona con sesión es administradora? (revisamos el rol, no solo que haya sesión)
  // El "?." evita un error cuando no hay sesión (usuarioAdmin es null)
  const esAdmin = usuarioAdmin?.rol === 'admin';

  // Estamos dentro del panel (con permiso)
  const esPanelAdmin = paginaActual === 'admin' && esAdmin;

  return (
    <div>
      {/* Barra propia del panel admin cuando el usuario tiene permisos */}
      {esPanelAdmin && (
        <BarraAdmin
          nombre={usuarioAdmin.nombre}
          alVerSitio={() => setPaginaActual('inicio')}
          alSalir={manejarCerrarSesion}
        />
      )}

      {/* El contenido cambia según la página actual en el estado 'paginaActual'.
          Nota: el Header y el Footer ahora se renderizan directamente dentro de
          LandingPage para garantizar que aparezcan EXCLUSIVAMENTE en ella. */}
      <main>
        {paginaActual === 'inicio' && (
          <LandingPage
            herramientas={herramientasVisibles}
            cargando={cargando}
            cambiarPagina={setPaginaActual}
            irASeccion={irASeccion}
            apiUrl={API_URL}
            usuarioAdmin={usuarioAdmin}
            cerrarSesion={manejarCerrarSesion}
          />
        )}

        {paginaActual === 'planes' && (
          <PlanesPage
            cambiarPagina={setPaginaActual}
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
    </div>
  );
}
