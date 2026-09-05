document.addEventListener("DOMContentLoaded", () => {

    /* ==============================================
       CONFIGURACIÓN DE TÉCNICAS
    ============================================== */
    const MODOS = {
        "478": {
            tipo: "respiracion",
            titulo: "4-7-8",
            subtitulo: "Calma el sistema nervioso.",
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
            titulo: "RESPIRACIÓN EN CAJA",
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
                { numero: 4, icono: "✋", pregunta: "cosas que puedas sentir físicamente", ejemplos: "El roce de la ropa, tus pies en el suelo, el teclado bajo tus dedos, el viento en tu cara." },
                { numero: 3, icono: "👂", pregunta: "cosas que puedas escuchar", ejemplos: "Los autos afuera, el segundero de un reloj, tu propia respiración, un ventilador." },
                { numero: 2, icono: "👃", pregunta: "cosas que puedas oler", ejemplos: "El aroma de tu café, el olor a limpio de tu ropa, un perfume, la madera de un mueble." },
                { numero: 1, icono: "👅", pregunta: "cosa que puedas saborear", ejemplos: "El sabor de tu última comida, un chicle, una menta, o un trago de agua." }
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

    const tarjetasModo = document.querySelectorAll(".TarjetaModo");

    // Respiración
    const blob        = document.getElementById("BlobRespiracion");
    const tituloResp   = document.getElementById("TituloModoResp");
    const subtituloResp= document.getElementById("SubtituloModoResp");
    const faseEl       = document.getElementById("ResetFase");
    const contadorEl   = document.getElementById("ResetContador");
    const cicloEl      = document.getElementById("ResetCiclo");
    const btnPausar    = document.getElementById("BtnPausar");

    // Grounding
    const groundIcono    = document.getElementById("GroundingIcono");
    const groundNumero   = document.getElementById("GroundingNumero");
    const groundPregunta = document.getElementById("GroundingPregunta");
    const groundEjemplos = document.getElementById("GroundingEjemplos");
    const groundPuntos   = document.getElementById("GroundingPuntos");
    const btnSiguiente   = document.getElementById("BtnSiguientePaso");

    const btnCerrar   = document.getElementById("BtnCerrar");
    const btnOtraVez  = document.getElementById("BtnOtraVez");
    const mensajeFinalEl = document.getElementById("MensajeFinal");

    let temporizador = null;
    let pausado = false;

    function ocultarTodo() {
        [vistaSelector, vistaRespiracion, vistaGrounding, vistaFinal].forEach(v => v.hidden = true);
    }

    /* ==============================================
       MOTOR DE RESPIRACIÓN (4-7-8 / caja)
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
            faseEl.style.opacity = 0;

            setTimeout(() => {
                faseEl.textContent = fase.nombre;
                faseEl.style.opacity = 1;
            }, 150);

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
       MOTOR DE GROUNDING (5-4-3-2-1)
    ============================================== */
    function iniciarGrounding(config) {
        ocultarTodo();
        vistaGrounding.hidden = false;

        let pasoIndex = 0;

        // Construir puntos de progreso
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

            btnSiguiente.textContent = pasoIndex === config.pasos.length - 1
                ? "Terminar"
                : "Ya identifiqué esto →";
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

    /* ==============================================
       FINALIZAR / REINICIAR
    ============================================== */
    function finalizar(mensaje) {
        clearInterval(temporizador);
        ocultarTodo();
        vistaFinal.hidden = false;
        mensajeFinalEl.textContent = mensaje;
    }

    function volverAlSelector() {
        clearInterval(temporizador);
        ocultarTodo();
        vistaSelector.hidden = false;
    }

    /* ==============================================
       EVENTOS
    ============================================== */
    tarjetasModo.forEach((tarjeta) => {
        tarjeta.addEventListener("click", () => {
            const modo = tarjeta.dataset.modo;
            const config = MODOS[modo];
            if (config.tipo === "respiracion") {
                iniciarRespiracion(config);
            } else if (config.tipo === "grounding") {
                iniciarGrounding(config);
            }
        });
    });

    btnOtraVez.addEventListener("click", volverAlSelector);

    btnCerrar.addEventListener("click", () => {
        window.location.href = "index.html";
    });
});