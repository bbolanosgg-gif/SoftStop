// Componente Header para navegar entre las vistas de SoftStop
export default function Header({ paginaActual, cambiarPagina, usuarioAdmin, cerrarSesion }) {
  return (
    <header className="header">
      <button className="marca-logo" onClick={() => cambiarPagina('inicio')}>
        SOFTSTOP
      </button>

      <nav className="nav-links">
        <button
          className={paginaActual === 'inicio' ? 'nav-btn activo' : 'nav-btn'}
          onClick={() => cambiarPagina('inicio')}
        >
          Inicio y Catálogo
        </button>

        <button
          className={paginaActual === 'ia' ? 'nav-btn activo' : 'nav-btn'}
          onClick={() => cambiarPagina('ia')}
        >
          ✨ Recomendador IA
        </button>

        {usuarioAdmin ? (
          <>
            <button
              className={paginaActual === 'admin' ? 'nav-btn activo' : 'nav-btn'}
              onClick={() => cambiarPagina('admin')}
            >
              Panel Admin
            </button>
            <button className="btn-acento" onClick={cerrarSesion}>
              Salir ({usuarioAdmin.nombre})
            </button>
          </>
        ) : (
          <button
            className="btn-acento"
            onClick={() => cambiarPagina('login')}
          >
            Iniciar Sesión
          </button>
        )}
      </nav>
    </header>
  );
}