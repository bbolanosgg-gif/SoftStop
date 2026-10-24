document.addEventListener("DOMContentLoaded", () => {

    /* ==============================================
       CONFIGURACIÓN DE TÉCNICAS Y TRANSICIONES
    ============================================== */
    const MODOS = {
        "478": {
            tipo: "respiracion",
            titulo: "4-7-8",
            subtitulo: "Calma el sistema nervioso y baja el ritmo.",
            transicionTitulo: "PUERTA 4-7-8",
            transicionTexto: "Haz una pausa y acompaña tu respiración a un ritmo más lento.",
            ciclos: 4,
            fases: [
                { nombre: "INHALA", duracion: 4, tamano: "grande" },
                { nombre: "RETÉN", duracion: 7, tamano: "grande" },
                { nombre: "EXHALA", duracion: 8, tamano: "pequeno" }
            ]
        },
        "caja": {
            tipo: "respiracion",
            titulo: "EN CAJA",
            subtitulo: "Recupera la concentración y el control mental.",
            transicionTitulo: "PUERTA CAJA",
            transicionTexto: "Encuentra un ritmo estable y date un momento para bajar la velocidad.",
            ciclos: 4,
            fases: [
                { nombre: "INHALA", duracion: 4, tamano: "grande" },
                { nombre: "MANTÉN", duracion: 4, tamano: "grande" },
                { nombre: "EXHALA", duracion: 4, tamano: "pequeno" },
                { nombre: "ESPERA", duracion: 4, tamano: "pequeno" }
            ]
        },
        "grounding": {
            tipo: "grounding",
            titulo: "PRESENTE",
            subtitulo: "Conecta con tu entorno a través de los sentidos.",
            transicionTitulo: "PUERTA PRESENTE",
            transicionTexto: "Vuelve al aquí y al ahora, un sentido a la vez.",
            pasos: [
                { numero: 5, icono: "👀", pregunta: "cosas que puedas ver", ejemplos: "Una planta, una ventana, tu propia mano, una silla, un cuadro." },
                { numero: 4, icono: "✋", pregunta: "cosas que puedas sentir", ejemplos: "El roce de la ropa, tus pies en el suelo, el teclado bajo tus dedos." },
                { numero: 3, icono: "👂", pregunta: "cosas que puedas escuchar", ejemplos: "Los autos afuera, el segundero de un reloj, tu propia respiración." },
                { numero: 2, icono: "👃", pregunta: "cosas que puedas oler", ejemplos: "El aroma de tu café, el olor a limpio de tu ropa, un perfume." },
                { numero: 1, icono: "👅", pregunta: "cosa que puedas saborear", ejemplos: "El sabor de tu última comida, un chicle, una menta." }
            ]
        }
    };

    /* ==============================================
       REFERENCIAS DOM
    ============================================== */
    const resetHeader = document.getElementById("ResetHeader");
    const vistaSelector = document.getElementById("SelectorModos");
    const vistaRespiracion = document.getElementById("VistaRespiracion");
    const vistaGrounding = document.getElementById("VistaGrounding");
    const vistaFinal = document.getElementById("VistaFinal");

    const botonesPuerta = document.querySelectorAll(".BotonPuerta");
    const botonesSalir = document.querySelectorAll("[data-accion='salir']");

    const vistaTransicion = document.getElementById("VistaTransicion");
    const tituloTransicion = document.getElementById("TituloTransicion");
    const textoTransicion = document.getElementById("TextoTransicion");
    const btnContinuarTransicion = document.getElementById("BtnContinuarTransicion");

    const blob = document.getElementById("BlobRespiracion");
    const tituloResp = document.getElementById("TituloModoResp");
    const subtituloResp = document.getElementById("SubtituloModoResp");
    const faseEl = document.getElementById("ResetFase");
    const contadorEl = document.getElementById("ResetContador");
    const cicloEl = document.getElementById("ResetCiclo");
    const btnPausar = document.getElementById("BtnPausar");

    const tituloGround = document.getElementById("TituloModoGround");
    const subtituloGround = document.getElementById("SubtituloModoGround");
    const groundIcono = document.getElementById("GroundingIcono");
    const groundNumero = document.getElementById("GroundingNumero");
    const groundPregunta = document.getElementById("GroundingPregunta");
    const groundEjemplos = document.getElementById("GroundingEjemplos");
    const groundPuntos = document.getElementById("GroundingPuntos");
    const btnSiguiente = document.getElementById("BtnSiguientePaso");

    const btnOtraVez = document.getElementById("BtnOtraVez");
    const btnThink = document.getElementById("BtnThink");

    let temporizador = null;
    let temporizadorTransicion = null;

    /* ==============================================
       CONTROL DE VISTAS Y LIMPIEZA DE ESTADO
    ============================================== */
    function detenerTemporizadores() {
        if (temporizador) {
            clearInterval(temporizador);
            temporizador = null;
        }
        if (temporizadorTransicion) {
            clearTimeout(temporizadorTransicion);
            temporizadorTransicion = null;
        }
    }

    function ocultarTodo() {
        [vistaSelector, vistaRespiracion, vistaGrounding, vistaFinal].forEach(v => v.hidden = true);
    }

    function volverAlSelector() {
        detenerTemporizadores();
        ocultarTodo();
        blob.className = "BlobRespiracion pausado";
        blob.style.transitionDuration = "0s";
        resetHeader.hidden = false;
        vistaSelector.hidden = false;
    }

    /* ==============================================
       MOTOR DE TRANSICIÓN REUTILIZABLE
    ============================================== */
    function mostrarTransicion({ titulo, mensaje, textoBoton = "CONTINUAR", duracion = 4500, alTerminar }) {
        detenerTemporizadores();
        ocultarTodo();

        tituloTransicion.textContent = titulo;
        textoTransicion.innerHTML = mensaje;
        btnContinuarTransicion.textContent = textoBoton;

        vistaTransicion.hidden = false;
        vistaTransicion.style.opacity = "1";

        let completada = false;

        function continuar() {
            if (completada) return;
            completada = true;
            if (temporizadorTransicion) clearTimeout(temporizadorTransicion);

            vistaTransicion.style.opacity = "0";
            setTimeout(() => {
                vistaTransicion.hidden = true;
                if (typeof alTerminar === "function") alTerminar();
            }, 700);
        }

        temporizadorTransicion = setTimeout(continuar, duracion);
        btnContinuarTransicion.onclick = continuar;
    }

    // Evaluar entrada inicial desde Check-in (?origen=...)
    const parametros = new URLSearchParams(window.location.search);
    const origen = parametros.get("origen");

    if (origen === "saturado") {
        mostrarTransicion({
            titulo: "CALMA",
            mensaje: "Regálate unos minutos para pausar.<br><br>Tu mente también necesita espacio para procesar el día y volver a sentirse en calma.",
            textoBoton: "CONTINUAR",
            duracion: 5000,
            alTerminar: () => {
                resetHeader.hidden = false;
                vistaSelector.hidden = false;
            }
        });
    } else if (origen === "no_lo_se") {
        mostrarTransicion({
            titulo: "CALMA",
            mensaje: "¿Sabías que empezar a entenderte inicia por escuchar tu cuerpo?<br><br>Relajemos el sistema nervioso primero.",
            textoBoton: "CONTINUAR",
            duracion: 5000,
            alTerminar: () => {
                resetHeader.hidden = false;
                vistaSelector.hidden = false;
            }
        });
    } else {
        vistaTransicion.hidden = true;
        resetHeader.hidden = false;
        vistaSelector.hidden = false;
    }

    /* ==============================================
       MOTOR DE RESPIRACIÓN (CAJA Y 4-7-8)
    ============================================== */
    function iniciarRespiracion(config) {
        detenerTemporizadores();
        ocultarTodo();
        resetHeader.hidden = true; // Aísla completamente la pantalla del ejercicio
        vistaRespiracion.hidden = false;

        tituloResp.textContent = config.titulo;
        subtituloResp.textContent = config.subtitulo;

        let cicloActual = 1;
        let faseIndex = 0;
        let segundosFase = config.fases[0].duracion;
        let estado = "preparado"; // Estados: preparado | ejecucion | pausado

        // Estado A: Ejercicio preparado esperando a pulsar "COMENZAR"
        faseEl.textContent = config.fases[0].nombre;
        contadorEl.textContent = segundosFase;
        cicloEl.textContent = `Ciclo ${cicloActual} de ${config.ciclos}`;
        btnPausar.textContent = "COMENZAR";

        blob.className = "BlobRespiracion pausado";
        blob.style.transitionDuration = "0s";

        function aplicarFase() {
            const fase = config.fases[faseIndex];
            faseEl.textContent = fase.nombre;
            blob.style.transitionDuration = fase.duracion + "s";
            blob.classList.toggle("grande", fase.tamano === "grande");
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
                    finalizar();
                    return;
                }
            }
            aplicarFase();
        }

        btnPausar.onclick = () => {
            if (estado === "preparado") {
                estado = "ejecucion";
                btnPausar.textContent = "PAUSAR";
                blob.classList.remove("pausado");
                // Pequeño reflow para asegurar que la transición CSS de la 1ra fase se anime suavemente
                requestAnimationFrame(() => aplicarFase());

                temporizador = setInterval(() => {
                    if (estado === "ejecucion") {
                        segundosFase--;
                        if (segundosFase > 0) {
                            contadorEl.textContent = segundosFase;
                        } else {
                            siguienteFase();
                        }
                    }
                }, 1000);
            } else if (estado === "ejecucion") {
                estado = "pausado";
                btnPausar.textContent = "REANUDAR";
                blob.classList.add("pausado");
            } else if (estado === "pausado") {
                estado = "ejecucion";
                btnPausar.textContent = "PAUSAR";
                blob.classList.remove("pausado");
                blob.style.transitionDuration = segundosFase + "s";
            }
        };
    }

    /* ==============================================
       MOTOR DE GROUNDING (PUERTA PRESENTE)
    ============================================== */
    function iniciarGrounding(config) {
        detenerTemporizadores();
        ocultarTodo();
        resetHeader.hidden = true; // Aísla completamente la pantalla del ejercicio
        vistaGrounding.hidden = false;

        tituloGround.textContent = config.titulo;
        subtituloGround.textContent = config.subtitulo;

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

            btnSiguiente.textContent = pasoIndex === config.pasos.length - 1 ? "TERMINAR" : "SIGUIENTE →";
        }

        btnSiguiente.onclick = () => {
            pasoIndex++;
            if (pasoIndex >= config.pasos.length) {
                finalizar();
                return;
            }
            mostrarPaso();
        };

        mostrarPaso();
    }

    /* ==============================================
       NAVEGACIÓN DE PUERTAS, SALIDA Y CIERRE
    ============================================== */
    function finalizar() {
        detenerTemporizadores();
        ocultarTodo();
        resetHeader.hidden = false;
        vistaFinal.hidden = false;
    }

    // Al elegir una puerta: Mostrar transición breve -> Abrir pantalla aislada del ejercicio
    botonesPuerta.forEach((boton) => {
        boton.addEventListener("click", () => {
            const modo = boton.dataset.modo;
            const config = MODOS[modo];
            if (!config) return;

            resetHeader.hidden = true;

            mostrarTransicion({
                titulo: config.transicionTitulo,
                mensaje: config.transicionTexto,
                textoBoton: "ENTRAR AL EJERCICIO",
                duracion: 3500,
                alTerminar: () => {
                    if (config.tipo === "respiracion") {
                        iniciarRespiracion(config);
                    } else if (config.tipo === "grounding") {
                        iniciarGrounding(config);
                    }
                }
            });
        });
    });

    // Opción "Salir" dentro de cada ejercicio
    botonesSalir.forEach((boton) => {
        boton.addEventListener("click", volverAlSelector);
    });

    // Botón secundario al terminar: Volver a las 3 puertas
    btnOtraVez.addEventListener("click", volverAlSelector);

    // Botón primario al terminar: Ir a Think
    btnThink.addEventListener("click", () => {
        detenerTemporizadores();
        window.location.href = "ruta-think.html";
    });
});