document.addEventListener("DOMContentLoaded", () => {

    /* ==============================================
       CONFIGURACIÓN DE TÉCNICAS
    ============================================== */
    const MODOS = {
        "478": {
            tipo: "respiracion",
            titulo: "4-7-8",
            subtitulo: "Calma el sistema nervioso y baja el ritmo.",
            ciclos: 4,
            fases: [
                { nombre: "INHALA", duracion: 4, tamano: "grande" },
                { nombre: "RETÉN",  duracion: 7, tamano: "grande" },
                { nombre: "EXHALA", duracion: 8, tamano: "pequeno" }
            ],
            mensajeFinal: "Tu ritmo cardíaco debería sentirse más bajo. Bien hecho."
        },
        "caja": {
            tipo: "respiracion",
            titulo: "EN CAJA",
            subtitulo: "Recupera la concentración y el control mental.",
            ciclos: 4,
            fases: [
                { nombre: "INHALA", duracion: 4, tamano: "grande" },
                { nombre: "MANTÉN", duracion: 4, tamano: "grande" },
                { nombre: "EXHALA", duracion: 4, tamano: "pequeno" },
                { nombre: "ESPERA", duracion: 4, tamano: "pequeno" }
            ],
            mensajeFinal: "Tu mente está más clara. Bien hecho."
        },
        "grounding": {
            tipo: "grounding",
            pasos: [
                { numero: 5, icono: "👀", pregunta: "cosas que puedas ver", ejemplos: "Una planta, una ventana, tu propia mano, una silla, un cuadro." },
                { numero: 4, icono: "✋", pregunta: "cosas que puedas sentir", ejemplos: "El roce de la ropa, tus pies en el suelo, el teclado bajo tus dedos." },
                { numero: 3, icono: "👂", pregunta: "cosas que puedas escuchar", ejemplos: "Los autos afuera, el segundero de un reloj, tu propia respiración." },
                { numero: 2, icono: "👃", pregunta: "cosas que puedas oler", ejemplos: "El aroma de tu café, el olor a limpio de tu ropa, un perfume." },
                { numero: 1, icono: "👅", pregunta: "cosa que puedas saborear", ejemplos: "El sabor de tu última comida, un chicle, una menta." }
            ],
            mensajeFinal: "Volviste al presente. Eso ya es suficiente por ahora."
        }
    };

    /* ==============================================
       REFERENCIAS DOM
    ============================================== */
    const vistaSelector    = document.getElementById("SelectorModos");
    const vistaRespiracion = document.getElementById("VistaRespiracion");
    const vistaGrounding   = document.getElementById("VistaGrounding");
    const vistaFinal       = document.getElementById("VistaFinal");

    const botonesPuerta    = document.querySelectorAll(".BotonPuerta");
    const vistaTransicion  = document.getElementById("VistaTransicion");
    const textoTransicion  = document.getElementById("TextoTransicion");
    const btnContinuarTransicion = document.getElementById("BtnContinuarTransicion");

    // Leer el parámetro "?origen=" de la URL
    const parametros = new URLSearchParams(window.location.search);
    const origen = parametros.get("origen");

    /* ==============================================
       LÓGICA DE TRANSICIÓN ("CALMA")
    ============================================== */
    function iniciarTransicion(mensaje) {
        vistaSelector.hidden = true; 
        vistaTransicion.hidden = false;
        vistaTransicion.style.opacity = "1"; 
        
        if(mensaje) textoTransicion.innerHTML = mensaje;

        let transicionFinalizada = false;

        // Función que hace el efecto de desaparecer y mostrar el paisaje
        function avanzarAlPaisaje() {
            if (transicionFinalizada) return; // Evita que se ejecute dos veces
            transicionFinalizada = true;
            
            vistaTransicion.style.opacity = "0"; // Efecto fade out
            setTimeout(() => {
                vistaTransicion.hidden = true;
                vistaSelector.hidden = false;
            }, 800); // Espera a que termine la animación CSS
        }

        // 1. Transición automática después de 5 segundos
        const temporizadorAutomatico = setTimeout(avanzarAlPaisaje, 5000);

        // 2. Transición manual para los "afanosos"
        btnContinuarTransicion.addEventListener("click", () => {
            clearTimeout(temporizadorAutomatico); // Cancelamos el tiempo automático
            avanzarAlPaisaje(); // Avanzamos de inmediato
        });
    }

    // Evaluar de dónde viene el usuario para mostrar u omitir la transición "CALMA"
    if (origen === "saturado") {
        iniciarTransicion("Regálate unos minutos para pausar.<br><br>Tu mente también necesita espacio para procesar el día y volver a sentirse en calma.");
    } else if (origen === "no_lo_se") {
        iniciarTransicion("¿Sabías que empezar a entenderte inicia por escuchar tu cuerpo?<br><br>Relajemos el sistema nervioso primero.");
    } else {
        // Entró directo, omitir pantalla CALMA
        vistaTransicion.hidden = true;
        vistaSelector.hidden = false;
    }

    /* ==============================================
       VARIABLES EJERCICIOS
    ============================================== */
    const blob = document.getElementById("BlobRespiracion");
    const tituloResp = document.getElementById("TituloModoResp");
    const subtituloResp = document.getElementById("SubtituloModoResp");
    const faseEl = document.getElementById("ResetFase");
    const contadorEl = document.getElementById("ResetContador");
    const cicloEl = document.getElementById("ResetCiclo");
    const btnPausar = document.getElementById("BtnPausar");

    const groundIcono = document.getElementById("GroundingIcono");
    const groundNumero = document.getElementById("GroundingNumero");
    const groundPregunta = document.getElementById("GroundingPregunta");
    const groundEjemplos = document.getElementById("GroundingEjemplos");
    const groundPuntos = document.getElementById("GroundingPuntos");
    const btnSiguiente = document.getElementById("BtnSiguientePaso");

    const btnOtraVez = document.getElementById("BtnOtraVez");
    const mensajeFinalEl = document.getElementById("MensajeFinal");

    let temporizador = null;
    let pausado = false;

    function ocultarTodo() {
        [vistaSelector, vistaRespiracion, vistaGrounding, vistaFinal].forEach(v => v.hidden = true);
    }

    /* ==============================================
       MOTOR DE RESPIRACIÓN
    ============================================== */
    function iniciarRespiracion(config) {
        ocultarTodo();
        vistaRespiracion.hidden = false;

        tituloResp.textContent = config.titulo;
        subtituloResp.textContent = config.subtitulo;
        pausado = false;
        btnPausar.textContent = "Pausar";

        let cicloActual = 1;
        let faseIndex = 0;
        let segundosFase = 0;

        function aplicarFase() {
            const fase = config.fases[faseIndex];
            faseEl.textContent = fase.nombre;
            blob.classList.toggle("grande", fase.tamano === "grande");
            blob.style.transitionDuration = fase.duracion + "s";
            segundosFase = fase.duracion;
            contadorEl.textContent = segundosFase;
            cicloEl.textContent = `Ciclo ${cicloActual} de ${config.ciclos}`;
        }

        function siguienteFase() {
            faseIndex++;
            if (faseIndex >= config.fases.length) {
                faseIndex = 0;
                cicloActual++;
                if (cicloActual > config.ciclos) {
                    finalizar(config.mensajeFinal);
                    return;
                }
            }
            aplicarFase();
        }

        aplicarFase();

        temporizador = setInterval(() => {
            if (pausado) return;
            segundosFase--;
            if (segundosFase > 0) {
                contadorEl.textContent = segundosFase;
            } else {
                siguienteFase();
            }
        }, 1000);

        btnPausar.onclick = () => {
            pausado = !pausado;
            blob.classList.toggle("pausado", pausado);
            btnPausar.textContent = pausado ? "Reanudar" : "Pausar";
        };
    }

    /* ==============================================
       MOTOR DE GROUNDING
    ============================================== */
    function iniciarGrounding(config) {
        ocultarTodo();
        vistaGrounding.hidden = false;

        let pasoIndex = 0;
        groundPuntos.innerHTML = "";
        config.pasos.forEach(() => {
            const punto = document.createElement("span");
            groundPuntos.appendChild(punto);
        });

        function mostrarPaso() {
            const paso = config.pasos[pasoIndex];
            groundIcono.textContent = paso.icono;
            groundNumero.textContent = paso.numero;
            groundPregunta.textContent = paso.pregunta;
            groundEjemplos.textContent = paso.ejemplos;

            [...groundPuntos.children].forEach((p, i) => {
                p.classList.toggle("activo", i === pasoIndex);
            });

            btnSiguiente.textContent = pasoIndex === config.pasos.length - 1 ? "Terminar" : "Siguiente →";
        }

        btnSiguiente.onclick = () => {
            pasoIndex++;
            if (pasoIndex >= config.pasos.length) {
                finalizar(config.mensajeFinal);
                return;
            }
            mostrarPaso();
        };

        mostrarPaso();
    }

    function finalizar(mensaje) {
        clearInterval(temporizador);
        ocultarTodo();
        vistaFinal.hidden = false;
        mensajeFinalEl.textContent = mensaje;
    }

    btnOtraVez.addEventListener("click", () => {
        clearInterval(temporizador);
        ocultarTodo();
        vistaSelector.hidden = false;
    });

    // Escuchar los clicks en los botones de las puertas
    botonesPuerta.forEach((boton) => {
        boton.addEventListener("click", () => {
            const modo = boton.dataset.modo;
            const config = MODOS[modo];
            if (config.tipo === "respiracion") {
                iniciarRespiracion(config);
            } else if (config.tipo === "grounding") {
                iniciarGrounding(config);
            }
        });
    });
});