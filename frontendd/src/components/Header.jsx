import { useState, useEffect, useRef } from 'react';
import logo from '../assets/img/logo.png';
import Boton from './Boton/Boton';
import '../styles/header.css';

export default function Header({
  paginaActual,
  cambiarPagina,
  irASeccion,
  usuarioAdmin,
  cerrarSesion
}) {
  // Estado para controlar la visibilidad del Header al hacer scroll
  const [visible, setVisible] = useState(true);

  // Referencias para recordar la última posición del scroll y el temporizador
  const ultimoScrollY = useRef(0);
  const temporizadorInactividad = useRef(null);

  useEffect(() => {
    function manejarScroll() {
      // Obtenemos la posición actual de desplazamiento (compatible con distintos navegadores)
      const scrollActual = window.scrollY || document.documentElement.scrollTop || 0;
      const diferencia = scrollActual - ultimoScrollY.current;

      // 1. Limpiamos cualquier temporizador de inactividad previo
      if (temporizadorInactividad.current) {
        clearTimeout(temporizadorInactividad.current);
      }

      // 2. Si el usuario está al inicio de la página (o cerca del tope), el Header siempre debe estar visible
      if (scrollActual <= 10) {
        setVisible(true);
        ultimoScrollY.current = Math.max(0, scrollActual);
        return;
      }

      // 3. Ignoramos micro-desplazamientos (menores a 6px) para evitar parpadeos involuntarios
      if (Math.abs(diferencia) < 6) {
        return;
      }

      // 4. Detectamos la dirección del scroll:
      // - Si baja (diferencia > 0): ocultamos el Header suavemente hacia arriba
      // - Si sube (diferencia < 0): mostramos el Header inmediatamente
      if (diferencia > 0) {
        setVisible(false);
      } else {
        setVisible(true);
      }

      // 5. Comportamiento dinámico (referencia SpaceX):
      // Si el usuario deja de desplazarse, tras aproximadamente 1 segundo de inactividad
      // el Header vuelve a reaparecer suavemente
      temporizadorInactividad.current = setTimeout(() => {
        setVisible(true);
      }, 1000);

      // Guardamos la posición actual para la siguiente comparación
      ultimoScrollY.current = scrollActual;
    }

    // Registramos el listener del scroll con { passive: true } para un rendimiento óptimo
    window.addEventListener('scroll', manejarScroll, { passive: true });

    // Limpieza al desmontar: cancelamos listener y temporizador pendiente
    return () => {
      window.removeEventListener('scroll', manejarScroll);
      if (temporizadorInactividad.current) {
        clearTimeout(temporizadorInactividad.current);
      }
    };
  }, []);

  function navegarA(idSeccion) {
    if (paginaActual !== 'inicio') {
      cambiarPagina('inicio');
      setTimeout(() => {
        irASeccion?.(idSeccion);
      }, 60);
    } else {
      irASeccion?.(idSeccion);
    }
  }

  const esAdmin = usuarioAdmin?.rol === 'admin';

  return (
    <header className={`header ${visible ? '' : 'header--oculto'}`}>

      {/* IZQUIERDA: logo y nombre */}
      <button
        className="header-marca"
        onClick={() => cambiarPagina('inicio')}
      >
        <img
          src={logo}
          alt="Logo de SoftStop"
          className="header-logo"
        />
        <span className="header-nombre">SoftStop</span>
      </button>

      {/* CENTRO: enlaces de navegación */}
      <nav className="header-nav">
        <button
          className="header-enlace"
          onClick={() => navegarA('quienes-somos')}
        >
          Quiénes Somos
        </button>

        <button
          className="header-enlace"
          onClick={() => navegarA('espacios')}
        >
          Espacios
        </button>

        <button
          className="header-enlace"
          onClick={() => cambiarPagina('planes')}
        >
          Planes
        </button>

        <button
          className="header-enlace"
          onClick={() => navegarA('contacto')}
        >
          Contacto
        </button>
      </nav>

      {/* DERECHA: botones de sesión */}
      <div className="header-acciones">

        {esAdmin ? (
          <>
            <Boton
              variante={paginaActual === 'admin' ? 'primario' : 'secundario'}
              tamano="sm"
              onClick={() => cambiarPagina('admin')}
            >
              Panel Admin
            </Boton>

            <Boton
              variante="contorno"
              tamano="sm"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </Boton>
          </>
        ) : usuarioAdmin ? (
          <Boton
            variante="contorno"
            tamano="sm"
            onClick={cerrarSesion}
          >
            Cerrar sesión
          </Boton>
        ) : (
          <Boton
            variante="primario"
            tamano="sm"
            onClick={() => cambiarPagina('login')}
          >
            Iniciar Sesión
          </Boton>
        )}

      </div>
    </header>
  );
}
