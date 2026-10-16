document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // 0. MODELOS DE DATOS Y ESTADO GLOBAL (Persistencia Local / Mock API)
    // =========================================================
    const PALETA_COLORES = ["#AE98F0", "#FF9AB7", "#FFC9A7", "#A0E8D8", "#FE809F", "#C9BBFF"];

    let appState = {
        usuarioId: "usr_softstop_01",
        matrizACT: {
            p1_valores: [],      // Arreglo<CadenaTexto>
            p2_miedos: "",       // Cuadrante 2
            p3_conductas: "",    // Cuadrante 3
            p4_soluciones: "",   // Cuadrante 4
            completados: [false, false, false, false] // Q1..Q4 guardados (desbloqueo secuencial)
        },
        materias: [],            // [{ id, nombre, color }]
        pendientes: [],          // [{ id, nombre, materiaId, colorMateria, diaEntrega, prioridad }]
        planAccionACT: {
            valorActual: "",
            materiaActual: "",
            textoAccion: "",
            tiempoMinutos: 25,
            textoPasajero: "",
            textoCompromiso: ""
        },
        pantallaActual: null
    };

    // Variables temporales para los 3 candados (Pantalla 2.2)
    let seleccionColorMateria = null;
    let seleccionDia = null;
    let seleccionPrioridad = null;

    // Variables del cronómetro (Pantalla 5.1)
    let intervaloReloj = null;
    let segundosRestantes = 0;
    let relojPausado = false;

    function guardarEstado() {
        localStorage.setItem("softstop_estado_maestro", JSON.stringify(appState));
    }

    function cargarEstado() {
        const guardado = localStorage.getItem("softstop_estado_maestro");
        if (guardado) {
            appState = JSON.parse(guardado);
            normalizarMatriz();
            return true;
        }
        return false;
    }

    function reiniciarTodo() {
        if (intervaloReloj) clearInterval(intervaloReloj);
        localStorage.removeItem("softstop_estado_maestro");
        window.location.reload();
    }

    // Botón de reinicio en el header (si existe en el HTML)
    const btnReiniciar = document.getElementById("BtnReiniciarTodo") || document.getElementById("BtnReiniciar");
    if (btnReiniciar) {
        btnReiniciar.addEventListener("click", reiniciarTodo);
    }

    // =========================================================
    // CONSTRUCCIÓN DE PANTALLAS INDEPENDIENTES EN EL DOM
    // (Evita acumular componentes en una sola pantalla)
    // =========================================================
    const contenedorPrincipal = document.querySelector(".ThinkPrincipal");
    const indicadorHeader = document.getElementById("ThinkIndicador");

    function construirPantallasDOM() {
        contenedorPrincipal.innerHTML = `
            <!-- ================= BLOQUE 1: MATRIZ ACT ================= -->
            <!-- PANTALLA 1.0: Modal de Bienvenida -->
            <section class="ThinkVista" id="Pantalla_1_0" hidden>
                <div class="ResumenBloque" style="max-width: 500px; margin: 0 auto; text-align: center; position: relative;">
                    <button type="button" id="BtnCerrarModal_1_0" style="position:absolute; top:16px; right:20px; border:none; background:transparent; font-size:16px; cursor:pointer; color:var(--color-gris);">✕</button>
                    <span class="ThinkEyebrow">BIENVENIDO</span>
                    <h1 class="ThinkPasoTitulo" style="font-size: 28px; margin-top: 8px;">Reconectemos</h1>
                    <p class="ThinkPasoSubtitulo" style="margin-bottom: 24px;">
                        Reconectemos con lo que te impulsa y descubramos más de ti. Responde las preguntas a continuación.
                    </p>
                    <button type="button" class="BtnThinkContinuar" id="BtnContinuar_1_0">Continuar</button>
                </div>
            </section>

            ${htmlMatrizACT()}

            <!-- ================= BLOQUE 2: CLARIDAD MENTAL (3 PANTALLAS) ================= -->
            <!-- PANTALLA 2.1: Registro de Materias -->
            <section class="ThinkVista" id="Pantalla_2_1" hidden>
                <span class="ThinkEyebrow">CLARIDAD MENTAL • PASO 1 DE 3</span>
                <h1 class="ThinkPasoTitulo">Mis Materias</h1>
                <p class="ThinkPasoSubtitulo">Registra las materias o áreas que cursas actualmente.</p>

                <div class="ThinkInputGrupo">
                    <label class="ThinkLabel" for="Input_Nombre_Materia">Nombre de la materia</label>
                    <div class="ThinkInputConBoton">
                        <input type="text" id="Input_Nombre_Materia" placeholder="Ej: Cálculo, Estructuras de Datos...">
                        <button type="button" class="BtnThinkAgregar" id="Btn_Agregar_Materia">+</button>
                    </div>
                    <div class="SelectorMateriaPendiente" id="Selector_Color_Nueva_Materia" style="margin-top: 12px; justify-content: center;"></div>
                    <div class="ListaChips" id="Contenedor_Chips_Materias" style="margin-top: 18px;"></div>
                </div>

                <button type="button" class="BtnThinkContinuar" id="Btn_Ir_A_2_2">Siguiente: Agregar Pendientes →</button>
            </section>

            <!-- PANTALLA 2.2: Creador de Pendientes (Validación de 3 Candados) -->
            <section class="ThinkVista" id="Pantalla_2_2" hidden>
                <span class="ThinkEyebrow">CLARIDAD MENTAL • PASO 2 DE 3</span>
                <h1 class="ThinkPasoTitulo" style="font-size: 28px;">Configura tu pendiente paso a paso</h1>
                <p class="ThinkPasoSubtitulo">Selecciona los 3 pasos para habilitar el cuadro de texto.</p>

                <div class="ThinkInputGrupo">
                    <label class="ThinkLabel">1. Selecciona la Materia (Color)</label>
                    <div class="SelectorMateriaPendiente" id="Candado_1_Materias"></div>

                    <label class="ThinkLabel" style="margin-top: 16px;">2. Día de entrega en la semana</label>
                    <div class="SelectorDiaPendiente" id="Candado_2_Dias">
                        <button type="button" class="BtnDia" data-dia="L">L</button>
                        <button type="button" class="BtnDia" data-dia="M">M</button>
                        <button type="button" class="BtnDia" data-dia="X">X</button>
                        <button type="button" class="BtnDia" data-dia="J">J</button>
                        <button type="button" class="BtnDia" data-dia="V">V</button>
                        <button type="button" class="BtnDia" data-dia="S">S</button>
                        <button type="button" class="BtnDia" data-dia="D">D</button>
                    </div>

                    <label class="ThinkLabel" style="margin-top: 16px;">3. Prioridad según dificultad o tiempo</label>
                    <div class="SelectorPrioridadPendiente" id="Candado_3_Prioridad">
                        <button type="button" class="BtnPrioridad" data-prioridad="Alta">🔥 Alta</button>
                        <button type="button" class="BtnPrioridad" data-prioridad="Media">⚡ Media</button>
                        <button type="button" class="BtnPrioridad" data-prioridad="Baja">🌿 Baja</button>
                    </div>

                    <label class="ThinkLabel" style="margin-top: 16px;">4. Nombre del pendiente</label>
                    <div class="ThinkInputConBoton" id="Contenedor_Input_Pendiente">
                        <input type="text" id="Input_Nombre_Pendiente" placeholder="Completa los 3 pasos anteriores primero..." disabled>
                        <button type="button" class="BtnThinkAgregar" id="Boton_Agregar_Pendiente_POST" disabled>+</button>
                    </div>
                </div>

                <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap;">
                    <button type="button" class="BtnDesglosarIA" id="Btn_Volver_2_1" style="margin:0;">← Mis Materias</button>
                    <button type="button" class="BtnThinkContinuar" id="Btn_Ir_A_2_3" style="margin:0;">Ver mi lista de pendientes →</button>
                </div>
            </section>

            <!-- PANTALLA 2.3: Lista de Pendientes Actuales -->
            <section class="ThinkVista" id="Pantalla_2_3" hidden>
                <span class="ThinkEyebrow">CLARIDAD MENTAL • PASO 3 DE 3</span>
                <h1 class="ThinkPasoTitulo">Tus pendientes de la semana</h1>
                <p class="ThinkPasoSubtitulo">Revisa tus tareas antes de elegir cómo empezar.</p>

                <ul class="ListaPendientes" id="Lista_Barras_Pendientes" style="margin-bottom: 28px;"></ul>

                <div style="display:flex; gap:14px; justify-content:center; flex-wrap:wrap;">
                    <button type="button" class="BtnDesglosarIA" id="Btn_Agregar_Otro_Pendiente" style="margin:0;">+ Agregar otro pendiente</button>
                    <button type="button" class="BtnThinkContinuar" id="Btn_Continuar_A_Modulo3" style="margin:0;">Continuar →</button>
                </div>
            </section>

            <!-- ================= BLOQUE 3: DECISIÓN Y RECOMENDACIÓN ================= -->
            <!-- PANTALLA 3.1: Elección de Ruta -->
            <section class="ThinkVista" id="Pantalla_3_1" hidden>
                <span class="ThinkEyebrow">DECISIÓN</span>
                <h1 class="ThinkPasoTitulo">¿Cómo prefieres empezar hoy?</h1>
                <p class="ThinkPasoSubtitulo">Elige si deseas una recomendación o decidir por tu cuenta.</p>

                <div style="display:flex; flex-direction:column; gap:16px; max-width:480px; margin: 0 auto;">
                    <button type="button" class="BtnThinkContinuar" id="Btn_Ruta_A_Algoritmo">
                        ✨ Ir a recomiéndame qué estudiar
                    </button>
                    <button type="button" class="BtnDesglosarIA" id="Btn_Ruta_B_Libre" style="padding: 15px 24px; font-size: 13px;">
                        🧭 Ir a Plan de Acción ACT (Elegir libremente)
                    </button>
                </div>
            </section>

            <!-- PANTALLA 3.2: Recomendación del Algoritmo -->
            <section class="ThinkVista ThinkClaridad" id="Pantalla_3_2" hidden>
                <div class="ClaridadHeader">
                    <span class="ThinkEyebrow">CLARIDAD MENTAL</span>
                    <h1 class="ThinkPasoTitulo">Hemos organizado tus pendientes por prioridad.</h1>
                    <p class="ThinkPasoSubtitulo">Selecciona "Iniciar" en la tarea con la que quieras empezar.</p>
                </div>

                <div class="ClaridadGrid">
                    <div class="TarjetaFoco" id="Tarjeta_Foco_3_2"></div>
                    <div class="CarruselPendientes">
                        <div class="CarruselHeaderRow">
                            <p class="CarruselTitulo">Siguientes en prioridad</p>
                            <span class="CarruselLinea"></span>
                        </div>
                        <div class="PistaPendientesWrap">
                            <div class="PistaPendientes" id="Carrusel_Tarjetas_3_2"></div>
                        </div>
                    </div>
                </div>

                <button type="button" class="BtnDesglosarIA" id="Btn_Volver_3_1" style="margin: 0;">← Volver</button>
            </section>

            <!-- ================= BLOQUE 4: PLAN DE ACCIÓN ACT (5 PANTALLAS) ================= -->
            <!-- PANTALLA 4.1: Plan ACT — Pregunta 1 (Valor Central) -->
            <section class="ThinkVista" id="Pantalla_4_1" hidden>
                <span class="ThinkEyebrow">PLAN DE ACCIÓN ACT • PASO 1 DE 5</span>
                <h2 class="ThinkPregunta">Antes de continuar nuestra sesión de estudio, hagámoslo con un propósito. Define un valor central para esta sesión.</h2>

                <div class="ThinkInputGrupo" style="max-width: 460px; margin: 24px auto;">
                    <select id="Dropdown_Valores_4_1" class="InputProposito" style="cursor:pointer;"></select>
                    <div id="Contenedor_Nuevo_Valor_4_1" style="display:none; margin-top: 14px;">
                        <input type="text" id="Input_Nuevo_Valor_4_1" class="InputProposito" placeholder="Escribe tu nuevo valor personal o académico...">
                    </div>
                </div>

                <button type="button" class="BtnThinkContinuar" id="Btn_Continuar_4_1">Continuar</button>
            </section>

            <!-- PANTALLA 4.2: Plan ACT — Pregunta 2 (Materia / Objetivo a corto plazo) -->
            <section class="ThinkVista" id="Pantalla_4_2" hidden>
                <span class="ThinkEyebrow">PLAN DE ACCIÓN ACT • PASO 2 DE 5</span>
                <h2 class="ThinkPregunta">Elige por qué materia o área quieres comenzar.</h2>

                <div class="ThinkInputGrupo" style="max-width: 460px; margin: 24px auto;">
                    <select id="Selector_Materias_4_2" class="InputProposito" style="cursor:pointer;"></select>
                </div>

                <button type="button" class="BtnThinkContinuar" id="Btn_Continuar_4_2">Continuar</button>
            </section>

            <!-- PANTALLA 4.3: Plan ACT — Pregunta 3 (Acción Física y Tiempo) -->
            <section class="ThinkVista" id="Pantalla_4_3" hidden>
                <span class="ThinkEyebrow">PLAN DE ACCIÓN ACT • PASO 3 DE 5</span>
                <h2 class="ThinkPregunta">Define una acción física inmediata y temporalmente limitada.</h2>
                <p class="ThinkLabel" style="text-align:center; margin-bottom: 20px;">Ej: Prender mi PC, abrir Classroom y estudiar el tema 1 por 25 min</p>

                <div class="ThinkInputGrupo" style="max-width: 480px; margin: 0 auto 24px;">
                    <label class="ThinkLabel" for="Input_Tiempo_4_3">Tiempo de la sesión (minutos)</label>
                    <input type="number" id="Input_Tiempo_4_3" class="InputProposito" value="25" min="5" max="180" style="margin-bottom: 16px;">

                    <label class="ThinkLabel" for="Input_Accion_4_3">Acción física específica</label>
                    <input type="text" id="Input_Accion_4_3" class="InputProposito" placeholder="Ej: Abrir el PDF de ejercicios y resolver el punto 1...">
                </div>

                <button type="button" class="BtnThinkContinuar" id="Btn_Continuar_4_3">Guardar / Continuar</button>
            </section>

            <!-- PANTALLA 4.4: Plan ACT — Pregunta 4 (Pasajero Cognitivo) -->
            <section class="ThinkVista" id="Pantalla_4_4" hidden>
                <span class="ThinkEyebrow">PLAN DE ACCIÓN ACT • PASO 4 DE 5</span>
                <h2 class="ThinkPregunta">Nombra y anticipa al pasajero cognitivo que inevitablemente aparecerá.</h2>
                <p class="ThinkLabel" style="text-align:center; margin-bottom: 20px;">Ej: Mi mente generará un pensamiento de que es muy difícil este tema y no podré.</p>

                <div class="ThinkInputGrupo" style="max-width: 480px; margin: 0 auto 24px;">
                    <textarea id="Input_Pasajero_4_4" class="InputProposito" rows="3" placeholder="Escribe el pensamiento o sentimiento limitante que anticipas..."></textarea>
                </div>

                <button type="button" class="BtnThinkContinuar" id="Btn_Continuar_4_4">Continuar</button>
            </section>

            <!-- PANTALLA 4.5: Plan ACT — Pregunta 5 (Declaración de Aceptación) -->
            <section class="ThinkVista" id="Pantalla_4_5" hidden>
                <span class="ThinkEyebrow">PLAN DE ACCIÓN ACT • PASO 5 DE 5</span>
                <h2 class="ThinkPregunta">Sella el compromiso con una declaración de aceptación.</h2>
                <p class="ThinkPasoSubtitulo" style="margin-bottom: 16px;">Puedes usar o editar esta plantilla sugerida:</p>

                <div class="ThinkInputGrupo" style="max-width: 520px; margin: 0 auto 24px;">
                    <textarea id="Input_Compromiso_4_5" class="InputProposito" rows="4"></textarea>
                </div>

                <button type="button" class="BtnThinkContinuar" id="Btn_Iniciar_Sesion_4_5">Iniciar Sesión de Concentración</button>
            </section>

            <!-- ================= BLOQUE 5: EJECUCIÓN Y CIERRE ================= -->
            <!-- PANTALLA 5.1: Espacio de Concentración (Dashboard del Reloj) -->
            <section class="ThinkVista" id="Pantalla_5_1" style="max-width: 860px;" hidden>
                <span class="ThinkEyebrow">ESPACIO DE CONCENTRACIÓN</span>

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 28px; text-align: left;">
                    <div class="ResumenBloque">
                        <span class="ThinkLabel" style="color: var(--logo-morado);">Mi compromiso</span>
                        <p id="Burbuja_Compromiso" style="font-size: 13.5px;"></p>
                    </div>
                    <div class="ResumenBloque">
                        <span class="ThinkLabel" style="color: var(--logo-morado);">Mi valor</span>
                        <p id="Burbuja_Valor" style="font-size: 14px; font-weight: 600;"></p>
                    </div>
                    <div class="ResumenBloque">
                        <span class="ThinkLabel" style="color: var(--logo-morado);">Pasajero</span>
                        <p id="Burbuja_Pasajero" style="font-size: 13.5px;"></p>
                    </div>
                </div>

                <!-- Reloj Central -->
                <div class="TarjetaFoco" style="max-width: 360px; margin: 0 auto 24px; text-align: center;">
                    <div id="Reloj_Central_5_1" style="font-family: var(--fuente-principal); font-size: clamp(48px, 8vw, 68px); font-weight: 700; color: var(--color-texto); letter-spacing: 3px;">
                        25:00
                    </div>
                    <button type="button" class="BtnDesglosarIA" id="Btn_Pausar_Reanudar_5_1" style="margin: 14px auto 0;">⏸️ Pausar</button>
                </div>

                <!-- Banner Inferior Central (Materia + Acción Física) -->
                <div class="ResumenBloque" style="max-width: 580px; margin: 0 auto; text-align: center;">
                    <span class="ThinkLabel">Objetivo actual</span>
                    <p id="Banner_Objetivo_Unificado" style="font-size: 15px; font-weight: 600; color: var(--color-texto);"></p>
                </div>
            </section>

            <!-- PANTALLA 5.2: Modal de Felicitación (Cierre de Sesión) -->
            <section class="ThinkVista" id="Pantalla_5_2" hidden>
                <div class="TarjetaFoco" style="max-width: 500px; margin: 0 auto; text-align: center;">
                    <span class="ThinkEyebrow">¡SESIÓN COMPLETADA! 🎉</span>
                    <h2 class="ThinkPasoTitulo" style="font-size: 26px; margin: 12px 0;">
                        ¡Sesión completada! Avanzaste hacia tus valores junto con tus pasajeros cognitivos.
                    </h2>
                    <button type="button" class="BtnThinkContinuar" id="Btn_Volver_Pendientes_5_2" style="margin-top: 20px;">
                        Finalizar / Volver a mis pendientes
                    </button>
                </div>
            </section>
        `;
    }

    function mostrarPantalla(idPantalla, textoIndicador = "") {
        const todas = contenedorPrincipal.querySelectorAll(".ThinkVista");
        todas.forEach(sec => sec.hidden = true);

        const activa = document.getElementById(idPantalla);
        if (activa) activa.hidden = false;

        if (indicadorHeader) indicadorHeader.textContent = textoIndicador;
        appState.pantallaActual = idPantalla;

        const btnMatrizHeader = document.getElementById("BtnEditarMatriz");
        if (btnMatrizHeader) {
            btnMatrizHeader.hidden = !matrizCompleta() || idPantalla === "Pantalla_1_1" || idPantalla === "Pantalla_5_1";
        }
        guardarEstado();
    }

    // =========================================================
    // 1. CONTROLADOR DE FLUJO INICIAL (Enrutador Principal)
    // =========================================================
    function IniciarAplicacion() {
        cargarEstado();

        // Si la Matriz ACT no está completa (incluye p1_valores vacío), es Flujo 1st -> Matriz ACT
        normalizarMatriz();
        if (!matrizCompleta()) {
            Modulo_1_AlgorithmThink_MatrizACT();
        } else {
            // Flujo Normal -> Salta directo a Claridad Mental (Pendientes)
            Modulo_2_ClaridadMental_Pendientes();
        }
    }

    // =========================================================
    // 2. MÓDULO 1: ALGORITHM THINK — PARTE 1 (Matriz ACT)
    // =========================================================
    function Modulo_1_AlgorithmThink_MatrizACT() {
        const m = appState.matrizACT;
        const hayProgreso = m.p1_valores.length > 0 || m.completados.some(Boolean);
        if (hayProgreso) {
            // Recarga a mitad de la matriz: retoma en el cuadrante activo, sin repetir la bienvenida
            abrirMatrizACT();
        } else {
            mostrarPantalla("Pantalla_1_0", "Matriz ACT");
        }
    }

    // Los 4 cuadrantes viven en UNA sola pantalla y se desbloquean en orden: 1 -> 2 -> 3 -> 4.
    // El orden del arreglo es el orden visual del DOM (fila superior, luego fila inferior).
    const CUADRANTES_ACT = [
        {
            n: 3, campo: "p3_conductas", inputId: "Input_Conductas_P3", posicion: "Superior izquierdo",
            pregunta: "3. ¿Qué comportamientos específicos realizas para evitar, adormecer o escapar de esas experiencias internas aversivas?",
            ejemplo: "Ej: Ver series por horas",
            placeholder: "Escribe aquí tus conductas de escape...",
            boton: "Continuar",
            error: "Por favor describe estas conductas para continuar."
        },
        {
            n: 4, campo: "p4_soluciones", inputId: "Input_Soluciones_P4", posicion: "Superior derecho ♥",
            pregunta: "4. ¿Qué acciones externas y observables podrías tomar que te acerquen a la persona que deseas ser, incluso si tienes que llevar contigo esos pensamientos y sentimientos difíciles?",
            ejemplo: "Ej: Asistir a todas mis clases",
            placeholder: "Escribe aquí tus acciones comprometidas...",
            boton: "Terminar",
            error: "Por favor escribe al menos una acción comprometida."
        },
        {
            n: 2, campo: "p2_miedos", inputId: "Input_Miedos_P2", posicion: "Inferior izquierdo",
            pregunta: "2. ¿Qué pensamientos, dudas o sentimientos difíciles surgen en tu interior y actúan como obstáculos que te alejan de esos valores?",
            ejemplo: "Ej: El miedo a fallar",
            placeholder: "Escribe aquí tus pensamientos o sentimientos difíciles...",
            boton: "Guardar / Continuar",
            error: "Por favor escribe tus obstáculos internos para continuar."
        },
        {
            n: 1, campo: "p1_valores", tipo: "chips", posicion: "Inferior derecho",
            pregunta: "1. ¿Quién y qué es fundamentalmente importante para ti en tu vida académica y personal?",
            ejemplo: "Ej: Ser una estudiante honesta, comprometida y dispuesta a ayudar...",
            boton: "Guardar / Continuar",
            error: "Agrega al menos un valor importante para ti antes de continuar."
        }
    ];

    // Estado de progreso: completados[i] = true cuando el cuadrante i+1 fue guardado.
    function normalizarMatriz() {
        if (!appState.matrizACT) appState.matrizACT = {};
        const m = appState.matrizACT;
        if (!Array.isArray(m.p1_valores)) m.p1_valores = [];
        ["p2_miedos", "p3_conductas", "p4_soluciones"].forEach((k) => {
            if (typeof m[k] !== "string") m[k] = "";
        });
        if (!Array.isArray(m.completados) || m.completados.length !== 4) {
            // Estado guardado con el flujo anterior: se deduce de lo que ya está escrito
            m.completados = [
                m.p1_valores.length > 0,
                m.p2_miedos.trim() !== "",
                m.p3_conductas.trim() !== "",
                m.p4_soluciones.trim() !== ""
            ];
        }
        // Secuencia estricta: no puede haber un cuadrante completo detrás de uno incompleto
        for (let i = 0; i < 4; i++) {
            if (!m.completados[i]) {
                for (let j = i + 1; j < 4; j++) m.completados[j] = false;
                break;
            }
        }
        if (m.p1_valores.length === 0) m.completados = [false, false, false, false];
    }

    function matrizCompleta() {
        const m = appState.matrizACT;
        return !!m && Array.isArray(m.completados) && m.completados.every(Boolean) && m.p1_valores.length > 0;
    }

    function cuadranteActivoN() {
        const i = appState.matrizACT.completados.findIndex((c) => !c);
        return i === -1 ? null : i + 1;
    }

    function htmlMatrizACT() {
        const cuadrantes = CUADRANTES_ACT.map((c) => {
            const cuerpo = c.tipo === "chips"
                ? `
                    <p class="InstruccionCuadrante">Escribe un valor y presiona <strong>Enter</strong> o una <strong>coma (,)</strong> para agregarlo.</p>
                    <div class="ThinkInputConBoton">
                        <input type="text" id="Input_Valores_P1" placeholder="Escribe un valor y presiona Enter o coma (,)" autocomplete="off">
                        <button type="button" class="BtnThinkAgregar" id="BtnAgregarValorManual" title="Agregar valor" aria-label="Agregar valor">+</button>
                    </div>
                    <div class="ListaChips ChipsCuadrante" id="Contenedor_Chips_P1" aria-live="polite"></div>`
                : `
                    <textarea id="${c.inputId}" class="AreaTextoEstilizada" rows="3" placeholder="${c.placeholder}"></textarea>`;

            return `
                <article class="CuadranteACT Bloqueado" id="Cuadrante_${c.n}" data-q="${c.n}">
                    <div class="CuadranteCabecera">
                        <span class="BadgeCuadrante">Cuadrante ${c.n} de 4 • ${c.posicion}</span>
                        <span class="EstadoCuadrante" id="Estado_${c.n}"></span>
                    </div>
                    <h2 class="PreguntaCuadrante">${c.pregunta}</h2>
                    <p class="EjemploCuadrante">${c.ejemplo}</p>
                    ${cuerpo}
                    <p class="MensajeError" id="ErrorCuadrante_${c.n}" hidden></p>
                    <button type="button" class="BtnThinkContinuar BtnCuadrante" id="BtnGuardar_Q${c.n}">${c.boton}</button>
                    <div class="CandadoCuadrante" id="Candado_Q${c.n}">${c.n > 1 ? `🔒 Se desbloquea al completar el cuadrante ${c.n - 1}` : ""}</div>
                </article>`;
        }).join("");

        return `
            <!-- PANTALLA 1.1: Matriz ACT — los 4 cuadrantes en una sola pantalla, desbloqueo progresivo -->
            <section class="ThinkVista SeccionMatrizACT" id="Pantalla_1_1" hidden>
                <div class="MatrizACTCabecera">
                    <span class="ThinkEyebrow">MATRIZ ACT</span>
                    <p class="ThinkPasoSubtitulo" id="MatrizProgresoTexto"></p>
                </div>

                <div class="MatrizACTGrid" id="MatrizACTGrid">
                    ${cuadrantes}
                    <div class="CentroMatrizCorazon" id="IconoCentroCorazon" hidden title="El Yo observador en el centro">♥</div>
                </div>

                <div class="AccionesPieVista" id="AccionesMatrizRevision" hidden>
                    <button type="button" class="BtnThinkContinuar" id="BtnContinuarDesdeMatriz">Continuar →</button>
                </div>
            </section>
        `;
    }

    function mostrarErrorCuadrante(n, mensaje) {
        const el = document.getElementById(`ErrorCuadrante_${n}`);
        el.textContent = mensaje;
        el.hidden = false;
    }

    function ocultarErrorCuadrante(n) {
        document.getElementById(`ErrorCuadrante_${n}`).hidden = true;
    }

    function renderizarChipsP1() {
        const contenedor = document.getElementById("Contenedor_Chips_P1");
        contenedor.innerHTML = "";

        appState.matrizACT.p1_valores.forEach((valor, indice) => {
            const chip = document.createElement("span");
            chip.className = "ChipItem ChipValor";

            const texto = document.createElement("span");
            texto.textContent = valor;

            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "BtnBorrarChip";
            btn.setAttribute("aria-label", `Eliminar ${valor}`);
            btn.textContent = "✕";
            btn.addEventListener("click", () => eliminarValorP1(indice));

            chip.append(texto, btn);
            contenedor.appendChild(chip);
        });
    }

    // Convierte lo escrito en el input en chips (admite varios separados por coma). Devuelve cuántos agregó.
    function agregarValoresDesdeInput() {
        const input = document.getElementById("Input_Valores_P1");
        const m = appState.matrizACT;
        const nuevos = input.value.split(",").map((v) => v.trim()).filter(Boolean);
        const existentes = m.p1_valores.map((v) => v.toLowerCase());
        let agregados = 0;

        nuevos.forEach((v) => {
            if (!existentes.includes(v.toLowerCase())) {
                m.p1_valores.push(v);
                existentes.push(v.toLowerCase());
                agregados++;
            }
        });

        input.value = "";
        if (agregados > 0) {
            guardarEstado();
            renderizarChipsP1();
            ocultarErrorCuadrante(1);
        }
        return agregados;
    }

    function eliminarValorP1(indice) {
        const m = appState.matrizACT;
        // Q1 ya guardado: debe quedar al menos un valor (lo necesita el Plan de Acción ACT)
        if (m.completados[0] && m.p1_valores.length === 1) {
            mostrarErrorCuadrante(1, "Debe quedar al menos un valor en tu Matriz.");
            return;
        }
        m.p1_valores.splice(indice, 1);
        guardarEstado();
        renderizarChipsP1();
        ocultarErrorCuadrante(1);
    }

    // Carga en el DOM lo ya guardado (solo al abrir la matriz, para no mover el cursor mientras se escribe)
    function cargarValoresMatrizEnDOM() {
        const m = appState.matrizACT;
        document.getElementById("Input_Valores_P1").value = "";
        renderizarChipsP1();
        CUADRANTES_ACT.filter((c) => c.tipo !== "chips").forEach((c) => {
            document.getElementById(c.inputId).value = m[c.campo] || "";
            ocultarErrorCuadrante(c.n);
        });
        ocultarErrorCuadrante(1);
    }

    // Aplica los estados visuales: Completado (visible y editable) / Activo (resaltado) / Bloqueado (atenuado)
    function renderizarMatrizACT() {
        const m = appState.matrizACT;
        const activo = cuadranteActivoN();

        CUADRANTES_ACT.forEach((c) => {
            const el = document.getElementById(`Cuadrante_${c.n}`);
            const completado = m.completados[c.n - 1];
            const estado = completado ? "Completado" : (c.n === activo ? "Activo" : "Bloqueado");

            el.classList.remove("Bloqueado", "Activo", "Completado");
            el.classList.add(estado);
            el.setAttribute("aria-disabled", estado === "Bloqueado" ? "true" : "false");

            const entrada = document.getElementById(c.tipo === "chips" ? "Input_Valores_P1" : c.inputId);
            entrada.disabled = estado === "Bloqueado";
            if (c.tipo === "chips") {
                document.getElementById("BtnAgregarValorManual").disabled = estado === "Bloqueado";
            }

            document.getElementById(`BtnGuardar_Q${c.n}`).hidden = estado !== "Activo";
            document.getElementById(`Candado_Q${c.n}`).hidden = estado !== "Bloqueado";
            document.getElementById(`Estado_${c.n}`).textContent =
                estado === "Completado" ? "✓ Guardado · editable" : (estado === "Activo" ? "En curso" : "🔒 Bloqueado");
        });

        const completa = matrizCompleta();
        document.getElementById("IconoCentroCorazon").hidden = !completa;
        document.getElementById("AccionesMatrizRevision").hidden = !completa;
        document.getElementById("MatrizProgresoTexto").textContent = completa
            ? "Tu matriz está completa. Puedes editar cualquier cuadrante cuando quieras."
            : `Completa el cuadrante ${activo} de 4. Los demás se irán desbloqueando en orden.`;

        if (indicadorHeader) {
            indicadorHeader.textContent = completa ? "Matriz ACT • Completa" : `Matriz ACT • ${activo}/4`;
        }
    }

    function enfocarCuadrante(n) {
        const c = CUADRANTES_ACT.find((x) => x.n === n);
        const entrada = document.getElementById(c.tipo === "chips" ? "Input_Valores_P1" : c.inputId);
        if (entrada && !entrada.disabled) {
            entrada.focus({ preventScroll: true });
            document.getElementById(`Cuadrante_${n}`).scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }

    function abrirMatrizACT() {
        cargarValoresMatrizEnDOM();
        mostrarPantalla("Pantalla_1_1", "Matriz ACT");
        renderizarMatrizACT();
        const activo = cuadranteActivoN();
        if (activo) setTimeout(() => enfocarCuadrante(activo), 60);
    }

    function completarCuadrante(n) {
        const m = appState.matrizACT;
        const c = CUADRANTES_ACT.find((x) => x.n === n);

        if (c.tipo === "chips") {
            // Si escribió algo y olvidó presionar Enter, se agrega antes de validar
            agregarValoresDesdeInput();
            if (m.p1_valores.length === 0) {
                mostrarErrorCuadrante(n, c.error);
                document.getElementById("Input_Valores_P1").focus();
                return;
            }
        } else {
            const area = document.getElementById(c.inputId);
            const texto = area.value.trim();
            if (!texto) {
                mostrarErrorCuadrante(n, c.error);
                area.focus();
                return;
            }
            m[c.campo] = texto;
        }

        ocultarErrorCuadrante(n);
        m.completados[n - 1] = true;
        guardarEstado();

        if (n === 4) {
            // Último cuadrante: avanza al siguiente módulo según el Flujo 1st
            renderizarMatrizACT();
            Modulo_2_ClaridadMental_Pendientes();
            return;
        }

        renderizarMatrizACT();
        setTimeout(() => enfocarCuadrante(n + 1), 60);
    }

    function configurarEventosModulo1() {
        // Paso 0: Bienvenida
        document.getElementById("BtnCerrarModal_1_0").addEventListener("click", () => {
            window.location.href = "dashboard.html";
        });
        document.getElementById("BtnContinuar_1_0").addEventListener("click", abrirMatrizACT);

        // Header: volver a revisar / editar la matriz ya completada
        const btnEditarMatriz = document.getElementById("BtnEditarMatriz");
        if (btnEditarMatriz) btnEditarMatriz.addEventListener("click", abrirMatrizACT);

        // Cuadrante 1 (valores): Enter o coma crean chips
        const inputP1 = document.getElementById("Input_Valores_P1");
        inputP1.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                agregarValoresDesdeInput();
            }
        });
        inputP1.addEventListener("input", () => ocultarErrorCuadrante(1));
        document.getElementById("BtnAgregarValorManual").addEventListener("click", () => {
            agregarValoresDesdeInput();
            inputP1.focus();
        });

        // Cuadrantes 2, 3 y 4: borrador automático; un cuadrante ya guardado nunca queda vacío
        CUADRANTES_ACT.filter((c) => c.tipo !== "chips").forEach((c) => {
            const area = document.getElementById(c.inputId);
            area.addEventListener("input", () => {
                const valor = area.value.trim();
                ocultarErrorCuadrante(c.n);
                if (appState.matrizACT.completados[c.n - 1] && !valor) return;
                appState.matrizACT[c.campo] = valor;
                guardarEstado();
            });
            area.addEventListener("blur", () => {
                if (appState.matrizACT.completados[c.n - 1] && !area.value.trim()) {
                    area.value = appState.matrizACT[c.campo];
                }
            });
        });

        // Botones Guardar / Continuar / Terminar de cada cuadrante
        CUADRANTES_ACT.forEach((c) => {
            document.getElementById(`BtnGuardar_Q${c.n}`).addEventListener("click", () => completarCuadrante(c.n));
        });

        // Al revisar una matriz ya completa
        document.getElementById("BtnContinuarDesdeMatriz").addEventListener("click", () => {
            Modulo_2_ClaridadMental_Pendientes();
        });
    }

    // =========================================================
    // 3. MÓDULO 2: CLARIDAD MENTAL / PENDIENTES (3 Pantallas)
    // =========================================================
    let colorElegidoNuevaMateria = PALETA_COLORES[0];

    function Modulo_2_ClaridadMental_Pendientes() {
        renderizarPantalla_2_1();
        if (appState.materias.length === 0) {
            mostrarPantalla("Pantalla_2_1", "Claridad Mental • Materias");
        } else if (appState.pendientes.length === 0) {
            renderizarPantalla_2_2();
            mostrarPantalla("Pantalla_2_2", "Claridad Mental • Creador");
        } else {
            renderizarPantalla_2_3();
            mostrarPantalla("Pantalla_2_3", "Claridad Mental • Pendientes");
        }
    }

    function renderizarPantalla_2_1() {
        // Selector de colores para nueva materia
        const selectorColores = document.getElementById("Selector_Color_Nueva_Materia");
        selectorColores.innerHTML = "";
        PALETA_COLORES.forEach((color) => {
            const btnColor = document.createElement("button");
            btnColor.type = "button";
            btnColor.className = "CirculoMateria";
            btnColor.style.background = color;
            btnColor.style.borderColor = (color === colorElegidoNuevaMateria) ? "var(--color-texto)" : "transparent";
            btnColor.addEventListener("click", () => {
                colorElegidoNuevaMateria = color;
                renderizarPantalla_2_1();
            });
            selectorColores.appendChild(btnColor);
        });

        // Chips de materias creadas con botón X
        const contenedorChips = document.getElementById("Contenedor_Chips_Materias");
        contenedorChips.innerHTML = "";
        appState.materias.forEach((mat) => {
            const chip = document.createElement("span");
            chip.className = "ChipItem";
            chip.style.background = `${mat.color}33`;
            chip.style.color = mat.color;
            chip.style.display = "inline-flex";
            chip.style.alignItems = "center";
            chip.style.gap = "8px";
            chip.innerHTML = `${mat.nombre} <button type="button" style="border:none;background:transparent;color:inherit;font-weight:700;cursor:pointer;">✕</button>`;

            chip.querySelector("button").addEventListener("click", () => {
                appState.materias = appState.materias.filter(m => m.id !== mat.id);
                guardarEstado();
                renderizarPantalla_2_1();
            });
            contenedorChips.appendChild(chip);
        });
    }

    function verificarCondicionesDesbloqueo() {
        const inputPendiente = document.getElementById("Input_Nombre_Pendiente");
        const btnAgregar = document.getElementById("Boton_Agregar_Pendiente_POST");

        if (seleccionColorMateria !== null && seleccionDia !== null && seleccionPrioridad !== null) {
            inputPendiente.disabled = false;
            btnAgregar.disabled = false;
            inputPendiente.placeholder = "Ej: Taller 1 de Cálculo...";
        } else {
            inputPendiente.disabled = true;
            btnAgregar.disabled = true;
            inputPendiente.placeholder = "Completa los 3 pasos anteriores primero...";
        }
    }

    function renderizarPantalla_2_2() {
        seleccionColorMateria = null;
        seleccionDia = null;
        seleccionPrioridad = null;

        const contenedorCandado1 = document.getElementById("Candado_1_Materias");
        contenedorCandado1.innerHTML = "";

        appState.materias.forEach((mat) => {
            const btnMat = document.createElement("button");
            btnMat.type = "button";
            btnMat.className = "ChipItem";
            btnMat.style.background = `${mat.color}33`;
            btnMat.style.color = mat.color;
            btnMat.style.border = "2px solid transparent";
            btnMat.style.cursor = "pointer";
            btnMat.textContent = mat.nombre;

            btnMat.addEventListener("click", () => {
                contenedorCandado1.querySelectorAll("button").forEach(b => b.style.borderColor = "transparent");
                btnMat.style.borderColor = mat.color;
                seleccionColorMateria = { id: mat.id, color: mat.color, nombre: mat.nombre };
                verificarCondicionesDesbloqueo();
            });

            contenedorCandado1.appendChild(btnMat);
        });

        document.querySelectorAll("#Candado_2_Dias .BtnDia").forEach(b => b.classList.remove("Activo"));
        document.querySelectorAll("#Candado_3_Prioridad .BtnPrioridad").forEach(b => b.classList.remove("Activo"));
        document.getElementById("Input_Nombre_Pendiente").value = "";
        verificarCondicionesDesbloqueo();
    }

    function renderizarPantalla_2_3() {
        const lista = document.getElementById("Lista_Barras_Pendientes");
        lista.innerHTML = "";

        if (appState.pendientes.length === 0) {
            lista.innerHTML = `<li style="text-align:center; color:var(--color-gris);">Aún no tienes pendientes registrados.</li>`;
            return;
        }

        appState.pendientes.forEach((item) => {
            const li = document.createElement("li");
            li.style.borderLeftColor = item.colorMateria;
            li.style.display = "flex";
            li.style.justifyContent = "space-between";
            li.style.alignItems = "center";

            li.innerHTML = `
                <div>
                    <strong>${item.nombre}</strong>
                    <div class="BadgesPendiente">
                        <span class="BadgeDia">Día: ${item.diaEntrega}</span>
                        <span class="BadgePrioridad">${item.prioridad}</span>
                    </div>
                </div>
                <button type="button" style="border:none;background:transparent;color:var(--color-gris);font-size:16px;cursor:pointer;">✕</button>
            `;

            li.querySelector("button").addEventListener("click", () => {
                appState.pendientes = appState.pendientes.filter(p => p.id !== item.id);
                guardarEstado();
                renderizarPantalla_2_3();
            });

            lista.appendChild(li);
        });
    }

    function configurarEventosModulo2() {
        // Agregar Materia (Pantalla 2.1)
        document.getElementById("Btn_Agregar_Materia").addEventListener("click", () => {
            const input = document.getElementById("Input_Nombre_Materia");
            const nombre = input.value.trim();
            if (!nombre) return;

            appState.materias.push({
                id: `mat_${Date.now()}`,
                nombre: nombre,
                color: colorElegidoNuevaMateria
            });
            colorElegidoNuevaMateria = PALETA_COLORES[appState.materias.length % PALETA_COLORES.length];
            input.value = "";
            guardarEstado();
            renderizarPantalla_2_1();
        });

        document.getElementById("Btn_Ir_A_2_2").addEventListener("click", () => {
            if (appState.materias.length === 0) {
                document.getElementById("Input_Nombre_Materia").focus();
                return;
            }
            renderizarPantalla_2_2();
            mostrarPantalla("Pantalla_2_2", "Claridad Mental • Creador");
        });

        // Candado 2: Día (Pantalla 2.2)
        document.querySelectorAll("#Candado_2_Dias .BtnDia").forEach((btn) => {
            btn.addEventListener("click", () => {
                document.querySelectorAll("#Candado_2_Dias .BtnDia").forEach(b => b.classList.remove("Activo"));
                btn.classList.add("Activo");
                seleccionDia = btn.dataset.dia;
                verificarCondicionesDesbloqueo();
            });
        });

        // Candado 3: Prioridad (Pantalla 2.2)
        document.querySelectorAll("#Candado_3_Prioridad .BtnPrioridad").forEach((btn) => {
            btn.addEventListener("click", () => {
                document.querySelectorAll("#Candado_3_Prioridad .BtnPrioridad").forEach(b => b.classList.remove("Activo"));
                btn.classList.add("Activo");
                seleccionPrioridad = btn.dataset.prioridad;
                verificarCondicionesDesbloqueo();
            });
        });

        // Guardar Pendiente POST (Pantalla 2.2)
        document.getElementById("Boton_Agregar_Pendiente_POST").addEventListener("click", () => {
            const inputNombre = document.getElementById("Input_Nombre_Pendiente");
            const nombreActividad = inputNombre.value.trim();
            if (nombreActividad.length === 0) return;

            appState.pendientes.push({
                id: `pend_${Date.now()}`,
                nombre: nombreActividad,
                materiaId: seleccionColorMateria.id,
                colorMateria: seleccionColorMateria.color,
                diaEntrega: seleccionDia,
                prioridad: seleccionPrioridad
            });
            guardarEstado();
            renderizarPantalla_2_2();
        });

        document.getElementById("Btn_Volver_2_1").addEventListener("click", () => {
            renderizarPantalla_2_1();
            mostrarPantalla("Pantalla_2_1", "Claridad Mental • Materias");
        });

        document.getElementById("Btn_Ir_A_2_3").addEventListener("click", () => {
            renderizarPantalla_2_3();
            mostrarPantalla("Pantalla_2_3", "Claridad Mental • Lista");
        });

        // Pantalla 2.3 Botones
        document.getElementById("Btn_Agregar_Otro_Pendiente").addEventListener("click", () => {
            renderizarPantalla_2_2();
            mostrarPantalla("Pantalla_2_2", "Claridad Mental • Creador");
        });

        document.getElementById("Btn_Continuar_A_Modulo3").addEventListener("click", () => {
            if (appState.pendientes.length === 0) {
                renderizarPantalla_2_2();
                mostrarPantalla("Pantalla_2_2", "Claridad Mental • Creador");
                return;
            }
            Modulo_3_PantallaDecision();
        });
    }

    // =========================================================
    // 4. MÓDULO 3: PANTALLA DE DECISIÓN Y ORDENAMIENTO
    // =========================================================
    const PESO_PRIORIDAD = { "Alta": 1, "Media": 2, "Baja": 3 };
    const PESO_DIA = { "L": 1, "M": 2, "X": 3, "J": 4, "V": 5, "S": 6, "D": 7 };

    function ordenarPorPrioridadYDia(lista) {
        return [...lista].sort((a, b) => {
            const prioDiff = (PESO_PRIORIDAD[a.prioridad] || 9) - (PESO_PRIORIDAD[b.prioridad] || 9);
            if (prioDiff !== 0) return prioDiff;
            return (PESO_DIA[a.diaEntrega] || 9) - (PESO_DIA[b.diaEntrega] || 9);
        });
    }

    function Modulo_3_PantallaDecision() {
        mostrarPantalla("Pantalla_3_1", "Decisión de Ruta");
    }

    function renderizarRecomendacionAlgoritmo() {
        const ordenados = ordenarPorPrioridadYDia(appState.pendientes);
        const contenedorFoco = document.getElementById("Tarjeta_Foco_3_2");
        const contenedorCarrusel = document.getElementById("Carrusel_Tarjetas_3_2");

        contenedorFoco.innerHTML = "";
        contenedorCarrusel.innerHTML = "";

        if (ordenados.length === 0) return;

        const principal = ordenados[0];
        const materiaPrincipal = appState.materias.find(m => m.id === principal.materiaId);
        const nombreMatPrincipal = materiaPrincipal ? materiaPrincipal.nombre : "General";

        contenedorFoco.style.borderLeft = `5px solid ${principal.colorMateria}`;
        contenedorFoco.innerHTML = `
            <span class="FocoMateriaChip">📖 ${nombreMatPrincipal}</span>
            <h2 class="FocoTitulo">${principal.nombre}</h2>
            <div class="FocoBadges">
                <span class="FocoBadge">📅 Día: ${principal.diaEntrega}</span>
                <span class="FocoBadge">🔥 Prioridad: ${principal.prioridad}</span>
            </div>
            <button type="button" class="BtnThinkContinuar" id="Btn_Iniciar_Foco_3_2">Iniciar →</button>
        `;

        contenedorFoco.querySelector("#Btn_Iniciar_Foco_3_2").addEventListener("click", () => {
            Modulo_4_PlanAccionACT(nombreMatPrincipal);
        });

        ordenados.slice(1).forEach((item) => {
            const mat = appState.materias.find(m => m.id === item.materiaId);
            const nombreMat = mat ? mat.nombre : "General";

            const card = document.createElement("div");
            card.className = "TarjetaMiniPendiente";
            card.style.borderLeftColor = item.colorMateria;
            card.innerHTML = `
                <span class="MiniMateria">📖 ${nombreMat}</span>
                <p class="MiniTitulo">${item.nombre}</p>
                <span class="MiniBadge">Día: ${item.diaEntrega}</span>
                <span class="MiniBadge">${item.prioridad}</span>
                <button type="button" class="BtnDesglosarIA" style="margin: 10px 0 0; padding: 6px 12px; font-size: 11px;">Iniciar</button>
            `;

            card.querySelector("button").addEventListener("click", () => {
                Modulo_4_PlanAccionACT(nombreMat);
            });

            contenedorCarrusel.appendChild(card);
        });
    }

    function configurarEventosModulo3() {
        document.getElementById("Btn_Ruta_A_Algoritmo").addEventListener("click", () => {
            renderizarRecomendacionAlgoritmo();
            mostrarPantalla("Pantalla_3_2", "Recomendación");
        });

        document.getElementById("Btn_Ruta_B_Libre").addEventListener("click", () => {
            Modulo_4_PlanAccionACT(null);
        });

        document.getElementById("Btn_Volver_3_1").addEventListener("click", () => {
            mostrarPantalla("Pantalla_3_1", "Decisión de Ruta");
        });
    }

    // =========================================================
    // 5. MÓDULO 4: PLAN DE ACCIÓN ACT (5 Pantallas)
    // =========================================================
    let materiaPrecargadaTemp = null;

    function Modulo_4_PlanAccionACT(materiaPrecargada) {
        materiaPrecargadaTemp = materiaPrecargada;

        // Poblar Dropdown de Valores P1 (Pantalla 4.1)
        const dropdown = document.getElementById("Dropdown_Valores_4_1");
        const contenedorNuevo = document.getElementById("Contenedor_Nuevo_Valor_4_1");
        dropdown.innerHTML = "";

        appState.matrizACT.p1_valores.forEach((val) => {
            const opt = document.createElement("option");
            opt.value = val;
            opt.textContent = val;
            dropdown.appendChild(opt);
        });

        const optNuevo = document.createElement("option");
        optNuevo.value = "+ Agregar nuevo valor";
        optNuevo.textContent = "+ Agregar nuevo valor";
        dropdown.appendChild(optNuevo);

        contenedorNuevo.style.display = "none";
        document.getElementById("Input_Nuevo_Valor_4_1").value = "";

        mostrarPantalla("Pantalla_4_1", "Plan de Acción ACT • 1/5");
    }

    function configurarEventosModulo4() {
        const dropdownValores = document.getElementById("Dropdown_Valores_4_1");
        const contenedorNuevoValor = document.getElementById("Contenedor_Nuevo_Valor_4_1");

        dropdownValores.addEventListener("change", () => {
            if (dropdownValores.value === "+ Agregar nuevo valor") {
                contenedorNuevoValor.style.display = "block";
            } else {
                contenedorNuevoValor.style.display = "none";
            }
        });

        // Paso 1 -> Paso 2
        document.getElementById("Btn_Continuar_4_1").addEventListener("click", () => {
            if (dropdownValores.value === "+ Agregar nuevo valor") {
                const nuevoVal = document.getElementById("Input_Nuevo_Valor_4_1").value.trim();
                if (!nuevoVal) return;
                appState.matrizACT.p1_valores.push(nuevoVal);
                appState.planAccionACT.valorActual = nuevoVal;
            } else {
                appState.planAccionACT.valorActual = dropdownValores.value;
            }
            guardarEstado();

            // Poblar Selector de Materias (Pantalla 4.2)
            const selectorMat = document.getElementById("Selector_Materias_4_2");
            selectorMat.innerHTML = "";
            appState.materias.forEach((m) => {
                const opt = document.createElement("option");
                opt.value = m.nombre;
                opt.textContent = m.nombre;
                if (materiaPrecargadaTemp && m.nombre === materiaPrecargadaTemp) {
                    opt.selected = true;
                }
                selectorMat.appendChild(opt);
            });

            mostrarPantalla("Pantalla_4_2", "Plan de Acción ACT • 2/5");
        });

        // Paso 2 -> Paso 3
        document.getElementById("Btn_Continuar_4_2").addEventListener("click", () => {
            const selectorMat = document.getElementById("Selector_Materias_4_2");
            appState.planAccionACT.materiaActual = selectorMat.value || "Estudio General";
            guardarEstado();
            mostrarPantalla("Pantalla_4_3", "Plan de Acción ACT • 3/5");
        });

        // Paso 3 -> Paso 4
        document.getElementById("Btn_Continuar_4_3").addEventListener("click", () => {
            const mins = parseInt(document.getElementById("Input_Tiempo_4_3").value, 10) || 25;
            const accion = document.getElementById("Input_Accion_4_3").value.trim();
            if (!accion) return;

            appState.planAccionACT.tiempoMinutos = mins;
            appState.planAccionACT.textoAccion = accion;
            guardarEstado();
            mostrarPantalla("Pantalla_4_4", "Plan de Acción ACT • 4/5");
        });

        // Paso 4 -> Paso 5
        document.getElementById("Btn_Continuar_4_4").addEventListener("click", () => {
            const pasajero = document.getElementById("Input_Pasajero_4_4").value.trim();
            if (!pasajero) return;

            appState.planAccionACT.textoPasajero = pasajero;
            guardarEstado();

            // Plantilla sugerida en Paso 5
            const plantilla = `Estoy dispuesta a sentir la frustración, a experimentar aburrimiento, dudas sobre mi capacidad y ganas de distraerme, durante ${appState.planAccionACT.tiempoMinutos} min, estrictamente al servicio de mi valor de: ${appState.planAccionACT.valorActual}`;
            document.getElementById("Input_Compromiso_4_5").value = plantilla;

            mostrarPantalla("Pantalla_4_5", "Plan de Acción ACT • 5/5");
        });

        // Paso 5 -> Módulo 5 (Espacio de Concentración)
        document.getElementById("Btn_Iniciar_Sesion_4_5").addEventListener("click", () => {
            const compromiso = document.getElementById("Input_Compromiso_4_5").value.trim();
            if (!compromiso) return;

            appState.planAccionACT.textoCompromiso = compromiso;
            guardarEstado();
            Modulo_5_EspacioConcentracion();
        });
    }

    // =========================================================
    // 6. MÓDULO 5: ESPACIO DE CONCENTRACIÓN (Dashboard del Reloj)
    // =========================================================
    function formatearTiempo(min, seg) {
        const m = String(min).padStart(2, "0");
        const s = String(seg).padStart(2, "0");
        return `${m}:${s}`;
    }

    function Modulo_5_EspacioConcentracion() {
        const plan = appState.planAccionACT;

        // 1. Renderizar burbujas de anclaje psicológico
        document.getElementById("Burbuja_Compromiso").textContent = plan.textoCompromiso;
        document.getElementById("Burbuja_Valor").textContent = plan.valorActual;
        document.getElementById("Burbuja_Pasajero").textContent = plan.textoPasajero;

        // 2. Unir Materia + Acción física en el banner inferior
        document.getElementById("Banner_Objetivo_Unificado").textContent = `${plan.materiaActual} — ${plan.textoAccion}`;

        // 3. Configurar e iniciar el Cronómetro Central
        segundosRestantes = (plan.tiempoMinutos || 25) * 60;
        relojPausado = false;
        const displayReloj = document.getElementById("Reloj_Central_5_1");
        const btnPausa = document.getElementById("Btn_Pausar_Reanudar_5_1");
        btnPausa.textContent = "⏸️ Pausar";

        mostrarPantalla("Pantalla_5_1", "Sesión en Curso");

        if (intervaloReloj) clearInterval(intervaloReloj);
        intervaloReloj = setInterval(() => {
            if (relojPausado) return;

            const minutos = Math.floor(segundosRestantes / 60);
            const segundos = segundosRestantes % 60;
            displayReloj.textContent = formatearTiempo(minutos, segundos);

            if (segundosRestantes <= 0) {
                clearInterval(intervaloReloj);
                mostrarPantalla("Pantalla_5_2", "Sesión Completada");
                return;
            }
            segundosRestantes--;
        }, 1000);
    }

    function configurarEventosModulo5() {
        const btnPausa = document.getElementById("Btn_Pausar_Reanudar_5_1");
        btnPausa.addEventListener("click", () => {
            relojPausado = !relojPausado;
            btnPausa.textContent = relojPausado ? "▶️ Reanudar" : "⏸️ Pausar";
        });

        document.getElementById("Btn_Volver_Pendientes_5_2").addEventListener("click", () => {
            renderizarPantalla_2_3();
            mostrarPantalla("Pantalla_2_3", "Claridad Mental • Lista");
        });
    }

    // =========================================================
    // INICIALIZACIÓN MAESTRA
    // =========================================================
    construirPantallasDOM();
    configurarEventosModulo1();
    configurarEventosModulo2();
    configurarEventosModulo3();
    configurarEventosModulo4();
    configurarEventosModulo5();
    IniciarAplicacion();
});