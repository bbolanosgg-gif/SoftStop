// Header: barra de navegación superior de SoftStop.
// Muestra el logo a la izquierda y los enlaces de navegación a la derecha.

// Importamos la imagen como módulo: Vite la procesa y nos devuelve su ruta final
import logo from '../assets/img/logo.png';
// Cada componente importa su propio CSS
import '../styles/header.css';

// Recibimos por props lo que App.jsx nos pasa: estado y funciones de navegación
export default function Header({ paginaActual, cambiarPagina, irASeccion, usuarioAdmin, cerrarSesion }) {
  return (
    <header className="header">

      {/* BLOQUE 1: marca (logo + nombre). Al hacer clic volvemos al inicio */}
      <button className="header-marca" onClick={() => cambiarPagina('inicio')}>
        <img src={logo} alt="Logo de SoftStop" className="header-logo" />
        <span className="header-nombre">SOFTSTOP</span>
      </button>

      {/* BLOQUE 2: navegación */}
      <nav className="header-nav">

        {/* Estos tres botones bajan (scroll) a una sección de la landing.
            El texto entre comillas es el id de la sección destino */}
        <button className="header-enlace" onClick={() => irASeccion('quienes-somos')}>
          Quiénes Somos
        </button>
        <button className="header-enlace" onClick={() => irASeccion('espacios')}>
          Espacios
        </button>
        <button className="header-enlace" onClick={() => irASeccion('contacto')}>
          Contacto
        </button>
        

        {/* Renderizado condicional con ternario: condición ? siTrue : siFalse.
            Si hay un admin logueado mostramos su panel y "Salir"; si no, "Iniciar Sesión" */}
        {usuarioAdmin ? (
          <>
            <button
              className={paginaActual === 'admin' ? 'header-enlace activo' : 'header-enlace'}
              onClick={() => cambiarPagina('admin')}
            >
              Panel Admin
            </button>
            <button className="header-boton" onClick={cerrarSesion}>
              Salir ({usuarioAdmin.nombre})
            </button>
          </>
        ) : (
          <button className="header-boton" onClick={() => cambiarPagina('login')}>
            Iniciar Sesión
          </button>
        )}
      </nav>
    </header>
  );
}