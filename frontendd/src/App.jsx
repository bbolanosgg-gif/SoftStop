import { useState, useEffect } from 'react';

import BarraAdmin from './components/BarraAdmin';

import LandingPage from './pages/LandingPage';
import PlanesPage from './pages/PlanesPage';
import AsistenteIAPage from './pages/AsistenteIAPage';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import AdminPage from './pages/AdminPage';


// Dirección del servidor Backend de Node.js / Express
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function App() {
  // 1. SESIÓN EN MEMORIA (useState)
  // Al iniciar la aplicación todavía no hay un usuario autenticado.
  // No restauramos el usuario desde localStorage: un rol guardado allí
  // no demuestra que la persona tenga una sesión válida.
  const [usuarioAdmin, setUsuarioAdmin] = useState(null);

  // El backend entrega este JWT al iniciar sesión correctamente.
  // Lo conservamos solo en memoria, sin localStorage ni sessionStorage.
  // Por eso, al recargar la página se pierde y hay que iniciar sesión otra vez.
  const [token, setToken] = useState(null);

  // Al abrir o recargar SoftStop mostramos primero la página principal.
  const [paginaActual, setPaginaActual] = useState('inicio');

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

  // 2. INICIO DE SESIÓN
  // LoginPage recibe del backend el usuario y el JWT, y nos los pasa aquí.
  function manejarLoginExitoso(usuario, tokenRecibido) {
    // Guardamos los datos del usuario y su token en el estado de React.
    setUsuarioAdmin(usuario);
    setToken(tokenRecibido);

    // Si es admin, mostramos el panel; si es cliente, la página principal.
    setPaginaActual(usuario.rol === 'admin' ? 'admin' : 'inicio');
  }

  // 3. CERRAR SESIÓN
  // Limpiamos la sesión de la memoria y volvemos al inicio.
  function manejarCerrarSesion() {
    setUsuarioAdmin(null);
    setToken(null);
    setPaginaActual('inicio');
  }

  // 4. CONTROL VISUAL DEL PANEL
  // Mostramos el panel si el usuario tiene rol admin y hay un token en memoria.
  // Esto NO reemplaza la seguridad real: Express debe comprobar cada petición
  // privada mediante el middleware verificarToken.
  // El "?." evita un error cuando usuarioAdmin es null.
  const esAdmin = usuarioAdmin?.rol === 'admin' && Boolean(token);

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
              token={token}
              herramientas={herramientas}
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
