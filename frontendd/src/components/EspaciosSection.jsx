import { useState, useEffect } from 'react';
import '../styles/EspaciosSection.css';

// Importamos la imagen de fondo como módulo para que Vite la optimice
import fondoEspacios from '../assets/img/fondo-espacios.png';
import pergaminoImg from '../assets/img/pergamino.png';

// CAMBIO: ya no existe la lista escrita a mano (LISTA_ESPACIOS).
// Ahora el mazo se dibuja con las herramientas que vienen de MongoDB,
// así lo que se edita en el Panel Admin es EXACTAMENTE lo que se ve aquí.
//
// Props:
//   herramientas  -> solo las herramientas VISIBLES (App.jsx ya filtró las ocultas)
//   cargando      -> true mientras se espera la respuesta del servidor
//   cambiarPagina -> función para navegar a otra página
export default function EspaciosSection({ cambiarPagina, herramientas = [], cargando }) {
  // 2. ESTADOS DE REACT
  // indiceActual: guarda cuál carta está al frente
  const [indiceActual, setIndiceActual] = useState(0);
  // pausado: detiene el giro automático cuando el usuario acerca el mouse para leer
  const [pausado, setPausado] = useState(false);

  const totalCartas = herramientas.length;

  // NUEVO: si se oculta una herramienta y el índice queda fuera de la lista
  // (por ejemplo, estaba en la carta 5 y ahora hay 4), el módulo (%) lo devuelve
  // a un valor válido. Si no hay cartas, el índice es 0.
  const indiceSeguro = totalCartas > 0 ? indiceActual % totalCartas : 0;

  // 3. EFECTO DEL TEMPORIZADOR AUTOMÁTICO (reemplaza el setInterval clásico)
  useEffect(() => {
    // Si el mouse está encima del mazo, o no hay cartas, no iniciamos el reloj
    if (pausado || totalCartas === 0) return;

    const intervalo = setInterval(() => {
      // Aritmética modular (%): al llegar a la última carta, vuelve a la primera
      setIndiceActual((prevIndice) => (prevIndice + 1) % totalCartas);
    }, 3200);

    // FUNCIÓN DE LIMPIEZA (vital para sustentar):
    // limpia el reloj si el componente se desmonta, para evitar fugas de memoria
    return () => clearInterval(intervalo);
  }, [pausado, totalCartas]);

  // 4. LÓGICA DE POSICIONAMIENTO (máquina de estados de las cartas)
  // Calcula qué rol ('front', 'right', 'left' o 'hidden') le toca a cada carta
  function obtenerPosicion(index) {
    const derecha = (indiceSeguro + 1) % totalCartas;
    const izquierda = (indiceSeguro - 1 + totalCartas) % totalCartas;

    if (index === indiceSeguro) return 'front';
    if (index === derecha) return 'right';
    if (index === izquierda) return 'left';
    return 'hidden';
  }

  // Permite que al hacer clic en una carta lateral, esta pase al frente
  function manejarClicCarta(index, posicion) {
    if (posicion === 'left' || posicion === 'right') {
      setIndiceActual(index);
    }
  }

  // NUEVO: qué mostrar según el estado del catálogo
  // (se calcula antes del return para que el JSX quede más limpio)
  let contenidoMazo;

  if (cargando) {
    // Todavía no responde el servidor
    contenidoMazo = <p className="espacios-descripcion">Cargando espacios...</p>;
  } else if (totalCartas === 0) {
    // Servidor apagado, base vacía, o todas las herramientas están ocultas
    contenidoMazo = (
      <p className="espacios-descripcion">
        Estamos preparando nuevos espacios. ¡Vuelve pronto!
      </p>
    );
  } else {
    contenidoMazo = (
      <>
        {/* Contenedor del mazo. Detecta el mouse para pausar/reanudar */}
        <div
          className="wrap_stack"
          onMouseEnter={() => setPausado(true)}
          onMouseLeave={() => setPausado(false)}
        >
          {/* CAMBIO: antes recorría LISTA_ESPACIOS; ahora recorre las herramientas de MongoDB */}
          {herramientas.map((herramienta, index) => {
            const posicion = obtenerPosicion(index);

            return (
              <article
                key={herramienta._id} // el _id de MongoDB identifica cada carta
                className="stack-card"
                data-slot={posicion} // CSS lee este atributo para animar la posición
                onClick={() => manejarClicCarta(index, posicion)}
              >
                <div className="stack-content">
                  <img
                    src={pergaminoImg}
                    alt=""
                    className="pergamino-fondo"
                    aria-hidden="true"
                  />
                  <span className="stack-icono-top">{herramienta.icono || '✨'}</span>

                  {/* CAMBIO: cada texto sale de un campo de la base de datos */}
                  <h3 className="stack-title">{herramienta.nombre}</h3>

                  {/* El lema es opcional: si está vacío, no se dibuja el párrafo */}
                  {herramienta.lema && (
                    <p className="stack-kicker">{herramienta.lema}</p>
                  )}

                  <p className="stack-text">{herramienta.descripcion}</p>

                  <button
                    type="button"
                    className="stack-btn"
                    onClick={(e) => {
                      e.stopPropagation(); // Evita que el clic active el giro de la carta
                      if (cambiarPagina) cambiarPagina('ia');
                    }}
                  >
                    {/* NUEVO: el texto del botón se arma con el nombre de la herramienta */}
                    Entrar a {herramienta.nombre}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Puntitos indicadores abajo del mazo */}
        <div className="stack-dots">
          {herramientas.map((herramienta, index) => (
            <button
              key={herramienta._id}
              type="button"
              className="stack-dot"
              aria-current={index === indiceSeguro ? 'true' : 'false'}
              aria-label={`Ver espacio ${herramienta.nombre}`}
              onClick={() => setIndiceActual(index)}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <section
      className="espacios-section"
      id="espacios"
      style={{ backgroundImage: `url(${fondoEspacios})` }}
    >
      <div className="espacios-contenedor">

        {/* COLUMNA IZQUIERDA: Título + Mazo de cartas */}
        <div className="espacios-columna-mazo">
          <h2 className="espacios-titulo">
            Explora nuestros <br /> espacios de calma
          </h2>

          {contenidoMazo}
        </div>

        {/* COLUMNA DERECHA: Párrafo descriptivo */}
        <div className="espacios-columna-texto">
          <p className="espacios-descripcion">
            SoftStop te ayuda a reconocer cómo te sientes, avanzar con pequeños pasos y recibir orientación con IA para estudiar a tu propio ritmo, sin exigirte más de lo necesario.
          </p>
        </div>

      </div>
    </section>
  );
}