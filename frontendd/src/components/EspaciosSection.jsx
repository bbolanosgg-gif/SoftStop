import { useState, useEffect } from 'react';
import Boton from './Boton/Boton';
import '../styles/EspaciosSection.css';

// Importamos la imagen de fondo como módulo para que Vite la optimice
import fondoEspacios from '../assets/img/fondo-espacios.png';
import pergaminoImg from '../assets/img/pergamino.png';

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

  // Si se oculta una herramienta y el índice queda fuera de la lista,
  // el módulo (%) lo devuelve a un valor válido. Si no hay cartas, el índice es 0.
  const indiceSeguro = totalCartas > 0 ? indiceActual % totalCartas : 0;

  // 3. EFECTO DEL TEMPORIZADOR AUTOMÁTICO
  useEffect(() => {
    // Si el mouse está encima del mazo, o no hay cartas, no iniciamos el reloj
    if (pausado || totalCartas === 0) return;

    const intervalo = setInterval(() => {
      // Aritmética modular (%): al llegar a la última carta, vuelve a la primera
      setIndiceActual((prevIndice) => (prevIndice + 1) % totalCartas);
    }, 3200);

    // Limpieza al desmontar el componente para evitar fugas de memoria
    return () => clearInterval(intervalo);
  }, [pausado, totalCartas]);

  // 4. LÓGICA DE POSICIONAMIENTO
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

  let contenidoMazo;

  if (cargando) {
    contenidoMazo = <p className="espacios-descripcion">Cargando espacios...</p>;
  } else if (totalCartas === 0) {
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
          {herramientas.map((herramienta, index) => {
            const posicion = obtenerPosicion(index);

            // Ajuste 1: Identificamos si esta tarjeta es "Check-in"
            // (buscamos 'check' sin importar mayúsculas o minúsculas)
            const esCheckIn = herramienta.nombre?.toLowerCase().includes('check');

            return (
              <article
                key={herramienta._id}
                className="stack-card"
                data-slot={posicion}
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

                  <h3 className="stack-title">{herramienta.nombre}</h3>

                  {herramienta.lema && (
                    <p className="stack-kicker">{herramienta.lema}</p>
                  )}

                  <p className="stack-text">{herramienta.descripcion}</p>

                  <div className="stack-accion">
                    <Boton
                      variante="primario"
                      tamano="sm"
                      onClick={(e) => {
                        e.stopPropagation(); // Evita que el clic active el giro de la carta

                        // Solo la tarjeta "Check-in" redirige al asistente de IA.
                        // Las demás (Think, Reset, etc.) no realizan ninguna acción
                        // porque sus funciones aún no están implementadas.
                        if (esCheckIn && cambiarPagina) {
                          cambiarPagina('ia');
                        }
                      }}
                    >
                      {esCheckIn ? 'Guía con IA →' : 'Próximamente'}
                    </Boton>
                  </div>
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
            Cuéntanos cómo te sientes y nuestra IA te guía al espacio que necesitas: respirar, escribir, organizarte o ver tu progreso. Un paso pequeño a la vez, sin exigirte más de lo necesario.
          </p>
        </div>

      </div>
    </section>
  );
}
