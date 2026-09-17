document.addEventListener("DOMContentLoaded", () => {

    const DURACION_MENSAJE = 10000; // 10 segundos visibles
    const DURACION_FADE = 400;      // debe coincidir con la transición del CSS

    let thinkState = {
        materias: [],
        pendientes: [],
        razones: [],
        microPasos: [],
        primerPaso: "",
        enfoqueId: null,
        pasoActual: 1
    };

    const frasesTransicion = {
        paso1: "Nuestra mente exagera los pendientes cuando están en nuestra cabeza; al anotarlos, descubrimos que ya no es tanto como creíamos.",
        paso2: "Cambia el 'tengo que hacer esto' por el 'quiero hacerlo porque...'. Dale sentido y propósito al esfuerzo de tu cerebro.",
        claridad: "Antes de pensar en cómo, veamos juntos en qué conviene enfocar tu energía primero.",
        paso3: "Si un día te da pereza empezar, no pienses en toda la montaña. Pregúntate cuál es el paso más pequeño que puedes dar ahora mismo."
    };

    /* ============ LOCAL STORAGE ============ */
    function guardarEstado() {
        localStorage.setItem('softstop_estado', JSON.stringify(thinkState));
    }

    function cargarEstado() {
        const estadoGuardado = localStorage.getItem('softstop_estado');
        if (estadoGuardado) {
            thinkState = JSON.parse(estadoGuardado);
            return true;
        }
        return false;
    }

    function limpiarEstado() {
        localStorage.removeItem('softstop_estado');
    }

    function restaurarInterfaz() {
        // 1. Repintar Materias
        const listaMaterias = document.getElementById("ListaMaterias");
        listaMaterias.innerHTML = "";
        thinkState.materias.forEach(materia => {
            const chip = document.createElement("span");
            chip.className = "ChipItem";
            chip.textContent = materia.nombre;
            chip.style.background = `${materia.color}33`;
            chip.style.color = materia.color;
            listaMaterias.appendChild(chip);
        });
        renderSelectorMateria(); // Esto ya existe en tu código, reconstruye los radios

        // 2. Repintar Pendientes
        const listaPendientes = document.getElementById("ListaPendientes");
        listaPendientes.innerHTML = "";
            thinkState.pendientes.forEach(p => {
            const materia = thinkState.materias.find(m => m.id === p.id_materia);
            const item = document.createElement("li");
            item.textContent = p.texto;
            if (materia) item.style.borderLeftColor = materia.color;
            if (p.dia && p.prioridad) item.appendChild(crearBadgePendiente(p));
            listaPendientes.appendChild(item);
        });

        // 3. Repintar Micro-pasos
                // 3. Repintar Micro-pasos
        const listaMicroPasos = document.getElementById("ListaMicroPasos");
        listaMicroPasos.innerHTML = "";
        thinkState.microPasos.forEach(mp => {
            listaMicroPasos.appendChild(crearItemMicroPaso(mp));
        });

        // 4. Saltar a la pantalla correcta sin esperar los 10 segundos
        // SALVAVIDAS: Si por algún motivo pasoActual no existe, asume que es el paso 1
        const pasoSeguro = thinkState.pasoActual || 1; 

        if (pasoSeguro === 1) {
            mostrarVista("VistaPaso1", "Paso 1 de 4");
        } else if (pasoSeguro === 2) {
            renderContenedorMateriasProposito();
            mostrarVista("VistaPaso2", "Paso 2 de 4");
        } else if (pasoSeguro === "claridad") {
            renderClaridadMental();
            mostrarVista("VistaClaridad", "Paso 3 de 4");
         } else if (pasoSeguro === 3) {
            pintarCabeceraComo();
            mostrarVista("VistaPaso3", "Paso 4 de 4");
        } else if (pasoSeguro === "final") {
            finalizarSesion();
        }
    }

    const vistas = document.querySelectorAll(".ThinkVista");
    const indicador = document.getElementById("ThinkIndicador");
    const textoTransicion = document.getElementById("TextoTransicion");

    function mostrarVista(id, textoPaso) {
        vistas.forEach(v => {
            v.hidden = true;
            v.classList.remove("Saliendo");
        });
        document.getElementById(id).hidden = false;
        indicador.textContent = textoPaso || "";
    }

    // Muestra un mensaje sin botón; se desvanece solo y avanza automáticamente
    function mostrarMensajeAuto(vistaId, siguienteVistaId, textoPaso) {
        mostrarVista(vistaId, textoPaso);
        const vista = document.getElementById(vistaId);

        setTimeout(() => {
            vista.classList.add("Saliendo");
            setTimeout(() => {
                mostrarVista(siguienteVistaId, textoPaso);
            }, DURACION_FADE);
        }, DURACION_MENSAJE);
    }

    function irATransicionAuto(frase, siguienteVistaId, textoPaso) {
        textoTransicion.textContent = frase;
        mostrarMensajeAuto("VistaTransicion", siguienteVistaId, textoPaso);
    }




    /* ============ INICIO DEL FLUJO ============ */
   /* ============ INICIO DEL FLUJO ============ */
    if (cargarEstado()) {
        // Si hay datos guardados, repintamos y nos saltamos la bienvenida
        restaurarInterfaz();
    } else {
        // Si es la primera vez, flujo normal con los 10 segundos
        mostrarMensajeAuto("VistaBienvenida", "VistaPaso1", "Paso 1 de 4");
    }

        /* ============ PASO 1: ¿QUÉ? ============ */
    const paletaColores = ["#AE98F0", "#FF9AB7", "#FFC9A7", "#A0E8D8", "#FE809F", "#C9BBFF"];

    function renderSelectorMateria() {
        const contenedor = document.getElementById("SelectorMateriaPendiente");
        contenedor.innerHTML = "";
        thinkState.materias.forEach((materia) => {
            const radio = document.createElement("input");
            radio.type = "radio";
            radio.name = "materiaParaPendiente";
            radio.id = `radio-${materia.id}`;
            radio.value = materia.id;

            const label = document.createElement("label");
            label.className = "CirculoMateria";
            label.setAttribute("for", `radio-${materia.id}`);
            label.style.background = materia.color;
            label.title = materia.nombre;

            contenedor.appendChild(radio);
            contenedor.appendChild(label);
        });
    }

    const inputMateria = document.getElementById("InputMateria");
    const listaMaterias = document.getElementById("ListaMaterias");
    document.getElementById("BtnAgregarMateria").addEventListener("click", () => {
        const valor = inputMateria.value.trim();
        if (valor === "") return;

        const color = paletaColores[thinkState.materias.length % paletaColores.length];
        thinkState.materias.push({ id: `m${Date.now()}`, nombre: valor, color });
        guardarEstado();

        const chip = document.createElement("span");
        chip.className = "ChipItem";
        chip.textContent = valor;
        chip.style.background = `${color}33`;
        chip.style.color = color;
        listaMaterias.appendChild(chip);

        inputMateria.value = "";
        renderSelectorMateria();
    });

        // --- Selección de día y prioridad (uno activo a la vez por grupo) ---
    let diaSeleccionado = null;
    let prioridadSeleccionada = null;

    document.querySelectorAll(".BtnDia").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".BtnDia").forEach(b => b.classList.remove("Activo"));
            btn.classList.add("Activo");
            diaSeleccionado = btn.dataset.dia;
        });
    });

    document.querySelectorAll(".BtnPrioridad").forEach((btn) => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".BtnPrioridad").forEach(b => b.classList.remove("Activo"));
            btn.classList.add("Activo");
            prioridadSeleccionada = btn.dataset.prioridad;
        });
    });

    function crearBadgePendiente(pendiente) {
        const badges = document.createElement("div");
        badges.className = "BadgesPendiente";

        const badgeDia = document.createElement("span");
        badgeDia.className = "BadgeDia";
        badgeDia.textContent = pendiente.dia;

        const nombresPrioridad = { A: "🔥 Alta", M: "⚡ Media", B: "🌿 Baja" };
        const badgePrioridad = document.createElement("span");
        badgePrioridad.className = "BadgePrioridad";
        badgePrioridad.textContent = nombresPrioridad[pendiente.prioridad];

        badges.appendChild(badgeDia);
        badges.appendChild(badgePrioridad);
        return badges;
    }

    const inputPendiente = document.getElementById("InputPendiente");
    const listaPendientes = document.getElementById("ListaPendientes");
    document.getElementById("BtnAgregarPendiente").addEventListener("click", () => {
        const valor = inputPendiente.value.trim();
        if (valor === "") return;

        const selectorMateria = document.getElementById("SelectorMateriaPendiente");
        const radioSeleccionado = selectorMateria.querySelector("input[type='radio']:checked");

        // Si ya existen materias creadas, es obligatorio elegir una
        if (thinkState.materias.length > 0 && !radioSeleccionado) {
            selectorMateria.classList.add("ErrorSeleccion");
            setTimeout(() => selectorMateria.classList.remove("ErrorSeleccion"), 300);
            return;
        }

        // Día y prioridad son obligatorios siempre
        const selectorDia = document.getElementById("SelectorDiaPendiente");
        const selectorPrioridad = document.getElementById("SelectorPrioridadPendiente");
        let faltaAlgo = false;

        if (!diaSeleccionado) {
            selectorDia.classList.add("ErrorSeleccion");
            setTimeout(() => selectorDia.classList.remove("ErrorSeleccion"), 300);
            faltaAlgo = true;
        }
        if (!prioridadSeleccionada) {
            selectorPrioridad.classList.add("ErrorSeleccion");
            setTimeout(() => selectorPrioridad.classList.remove("ErrorSeleccion"), 300);
            faltaAlgo = true;
        }
        if (faltaAlgo) return;

        const idMateria = radioSeleccionado ? radioSeleccionado.value : null;
        const materia = thinkState.materias.find(m => m.id === idMateria);

        const nuevoPendiente = {
            id: `p${Date.now()}`,
            texto: valor,
            id_materia: idMateria,
            dia: diaSeleccionado,
            prioridad: prioridadSeleccionada
        };
        thinkState.pendientes.push(nuevoPendiente);
        guardarEstado();

        const item = document.createElement("li");
        item.textContent = valor;
        if (materia) item.style.borderLeftColor = materia.color;
        item.appendChild(crearBadgePendiente(nuevoPendiente));
        listaPendientes.appendChild(item);

        // Reset para el siguiente pendiente
        inputPendiente.value = "";
        diaSeleccionado = null;
        prioridadSeleccionada = null;
        document.querySelectorAll(".BtnDia, .BtnPrioridad").forEach(b => b.classList.remove("Activo"));
    });

        document.getElementById("BtnPaso1Continuar").addEventListener("click", () => {
        thinkState.pasoActual = 2;
        guardarEstado();
        renderContenedorMateriasProposito();
        irATransicionAuto(frasesTransicion.paso2, "VistaPaso2", "Paso 2 de 4");
    });

    /* ============ PASO 2: ¿PARA QUÉ? (filtrado + validación visual) ============ */
    function renderContenedorMateriasProposito() {
        // Filtra: solo materias que sí tienen al menos un pendiente asociado
        const materiasConPendientes = thinkState.materias.filter(materia =>
            thinkState.pendientes.some(p => p.id_materia === materia.id)
        );

        const contenedor = document.getElementById("ContenedorMateriasProposito");
        contenedor.innerHTML = "";

        materiasConPendientes.forEach((materia) => {
            if (materia.proposito === undefined) materia.proposito = "";

            const tarjeta = document.createElement("div");
            tarjeta.className = "TarjetaMateriaProposito";
            tarjeta.style.borderLeftColor = materia.color;

            const titulo = document.createElement("h3");
            titulo.className = "TituloMateriaProposito";
            titulo.style.color = materia.color;
            titulo.textContent = materia.nombre;

            const input = document.createElement("input");
            input.type = "text";
            input.className = "InputProposito";
            input.placeholder = "Ej: Entender estos temas para construir mi propio mini modelo de IA";
            input.value = materia.proposito;
            input.addEventListener("input", () => {
                materia.proposito = input.value;
                input.classList.remove("CampoError");
                guardarEstado();
            });

            const error = document.createElement("span");
            error.className = "ErrorCampo";
            error.textContent = "Cuéntame para qué es esto";

            tarjeta.appendChild(titulo);
            tarjeta.appendChild(input);
            tarjeta.appendChild(error);
            contenedor.appendChild(tarjeta);
        });
    }

        document.getElementById("BtnPaso2Continuar").addEventListener("click", () => {
        const inputs = document.querySelectorAll("#ContenedorMateriasProposito .InputProposito");
        let hayError = false;
        let primerErrorInput = null;

        inputs.forEach((input) => {
            if (input.value.trim() === "") {
                input.classList.add("CampoError");
                if (!primerErrorInput) primerErrorInput = input;
                hayError = true;
            }
        });

        if (hayError) {
            primerErrorInput.focus();
            return;
        }
        thinkState.pasoActual = "claridad";
        guardarEstado();
        renderClaridadMental();
        irATransicionAuto(frasesTransicion.claridad, "VistaClaridad", "Paso 3 de 4");
    });

    /* ============ CLARIDAD MENTAL: algoritmo + foco + carrusel ============ */
    const ordenDias = { Lun: 0, Mar: 1, Mié: 2, Jue: 3, Vie: 4, Sáb: 5, Dom: 6 };
    const ordenPrioridad = { A: 0, M: 1, B: 2 };

    function calcularDiasRestantes(dia) {
        const hoyJS = new Date().getDay(); // 0 = Domingo en JS
        const hoyConvertido = hoyJS === 0 ? 6 : hoyJS - 1; // convertimos a Lun=0...Dom=6
        let diff = ordenDias[dia] - hoyConvertido;
        if (diff < 0) diff += 7;
        return diff;
    }

    function textoDiasRestantes(dia) {
        const dias = calcularDiasRestantes(dia);
        if (dias === 0) return "⏳ Es hoy";
        if (dias === 1) return "⏳ Falta 1 día";
        return `⏳ Faltan ${dias} días`;
    }

    function nombrePrioridadLargo(p) {
        return { A: "🔥 Prioridad Alta", M: "⚡ Prioridad Media", B: "🌿 Prioridad Baja" }[p];
    }

    function ordenarPendientesPorPrioridad(pendientes) {
        return [...pendientes].sort((a, b) => {
            const diasA = calcularDiasRestantes(a.dia);
            const diasB = calcularDiasRestantes(b.dia);
            if (diasA !== diasB) return diasA - diasB;
            return ordenPrioridad[a.prioridad] - ordenPrioridad[b.prioridad];
        });
    }

    function pintarTarjetaFoco(pendiente) {
        const materia = thinkState.materias.find(m => m.id === pendiente.id_materia);
        const contenedor = document.getElementById("TarjetaFoco");
        contenedor.innerHTML = "";
        contenedor.style.borderLeftColor = materia ? materia.color : "var(--logo-morado)";

        const chip = document.createElement("span");
        chip.className = "FocoMateriaChip";
        chip.textContent = `📖 ${materia ? materia.nombre : "General"}`;

        const titulo = document.createElement("h2");
        titulo.className = "FocoTitulo";
        titulo.textContent = pendiente.texto;

        const badges = document.createElement("div");
        badges.className = "FocoBadges";
        const badgeDias = document.createElement("span");
        badgeDias.className = "FocoBadge";
        badgeDias.textContent = textoDiasRestantes(pendiente.dia);
        const badgePrioridad = document.createElement("span");
        badgePrioridad.className = "FocoBadge";
        badgePrioridad.textContent = nombrePrioridadLargo(pendiente.prioridad);
        badges.appendChild(badgeDias);
        badges.appendChild(badgePrioridad);

        const frase = document.createElement("p");
        frase.className = "FocoFrase";
        frase.textContent = "Pequeños pasos también te acercan a grandes metas.";

        const btn = document.createElement("button");
        btn.className = "BtnThinkContinuar";
        btn.textContent = "Desglosar esta tarea →";
        btn.addEventListener("click", () => {
            thinkState.pasoActual = 3;
            guardarEstado();
            pintarCabeceraComo();
            irATransicionAuto(frasesTransicion.paso3, "VistaPaso3", "Paso 4 de 4");
        });

        contenedor.appendChild(chip);
        contenedor.appendChild(titulo);
        contenedor.appendChild(badges);
        contenedor.appendChild(frase);
        contenedor.appendChild(btn);
    }

        function pintarCarrusel(pendientes) {
        const pista = document.getElementById("PistaPendientes");
        const puntos = document.getElementById("PuntosCarrusel");
        pista.innerHTML = "";
        puntos.innerHTML = "";

        pendientes.forEach((pendiente, indice) => {
            const materia = thinkState.materias.find(m => m.id === pendiente.id_materia);
            const mini = document.createElement("div");
            mini.className = "TarjetaMiniPendiente";
            mini.style.borderLeftColor = materia ? materia.color : "var(--logo-morado)";

            mini.innerHTML = `
                <span class="MiniMateria">📖 ${materia ? materia.nombre : "General"}</span>
                <p class="MiniTitulo">${pendiente.texto}</p>
                <span class="MiniBadge">${textoDiasRestantes(pendiente.dia)}</span>
                <span class="MiniBadge">${nombrePrioridadLargo(pendiente.prioridad)}</span>
            `;

            mini.addEventListener("click", () => {
                thinkState.enfoqueId = pendiente.id;
                guardarEstado();
                renderClaridadMental();
            });

            pista.appendChild(mini);

            const punto = document.createElement("span");
            punto.className = "PuntoCarrusel";
            if (indice === 0) punto.classList.add("Activo");
            puntos.appendChild(punto);
        });
    }
    

    function renderClaridadMental() {
        const ordenados = ordenarPendientesPorPrioridad(thinkState.pendientes);

        // Caso borde: no se agregó ningún pendiente en el Paso 1
        if (ordenados.length === 0) {
            thinkState.pasoActual = 3;
            guardarEstado();
            irATransicionAuto(frasesTransicion.paso3, "VistaPaso3", "Paso 4 de 4");
            return;
        }

        if (!thinkState.enfoqueId || !ordenados.find(p => p.id === thinkState.enfoqueId)) {
            thinkState.enfoqueId = ordenados[0].id;
        }

        const foco = ordenados.find(p => p.id === thinkState.enfoqueId);
        const resto = ordenados.filter(p => p.id !== foco.id);

        pintarTarjetaFoco(foco);
        pintarCarrusel(resto);
    }

        /* ============ PASO 3: ¿CÓMO? (tarea enfocada) ============ */
    function pintarCabeceraComo() {
        const pendiente = thinkState.pendientes.find(p => p.id === thinkState.enfoqueId);
        if (!pendiente) return;
        const materia = thinkState.materias.find(m => m.id === pendiente.id_materia);

        document.getElementById("ComoMateriaChip").textContent = `📖 ${materia ? materia.nombre : "General"}`;
        document.getElementById("ComoTitulo").textContent = pendiente.texto;
    }

    function crearItemMicroPaso(microPaso) {
        const item = document.createElement("li");
        item.className = "ItemMicroPaso";

        const check = document.createElement("button");
        check.type = "button";
        check.className = "CheckMicroPaso";
        if (microPaso.hecho) check.classList.add("Marcado");
        check.textContent = microPaso.hecho ? "✓" : "";

        const texto = document.createElement("span");
        texto.className = "TextoMicroPaso";
        if (microPaso.hecho) texto.classList.add("Marcado");
        texto.textContent = microPaso.texto;

        check.addEventListener("click", () => {
            microPaso.hecho = !microPaso.hecho;
            check.classList.toggle("Marcado", microPaso.hecho);
            check.textContent = microPaso.hecho ? "✓" : "";
            texto.classList.toggle("Marcado", microPaso.hecho);
            guardarEstado();
        });

        item.appendChild(check);
        item.appendChild(texto);
        return item;
    }

    const inputMicroPaso = document.getElementById("InputMicroPaso");
    const listaMicroPasos = document.getElementById("ListaMicroPasos");

    function agregarMicroPaso(texto) {
        const nuevo = { texto, hecho: false };
        thinkState.microPasos.push(nuevo);
        guardarEstado();
        listaMicroPasos.appendChild(crearItemMicroPaso(nuevo));
    }

    document.getElementById("BtnAgregarMicroPaso").addEventListener("click", () => {
        const valor = inputMicroPaso.value.trim();
        if (valor === "") return;
        agregarMicroPaso(valor);
        inputMicroPaso.value = "";
    });

    // Simulación de IA (Fase A). En Fase B esto llama a un backend real.
    document.getElementById("BtnDesglosarIA").addEventListener("click", (e) => {
        const boton = e.currentTarget;
        boton.disabled = true;
        boton.textContent = "✨ Pensando...";

        setTimeout(() => {
            // TODO (Fase B): reemplazar por fetch real a /api/descomponer-tarea
            ["Abrir el material y leer lo esencial", "Resolver la parte más sencilla primero", "Revisar y ajustar el resultado"]
                .forEach(paso => agregarMicroPaso(paso));

            boton.disabled = false;
            boton.textContent = "✨ Desglosar con IA";
        }, 1200);
    });

    // Panel colapsable "Estoy atascado"
    const btnUnstuck = document.getElementById("BtnUnstuck");
    const panelUnstuck = document.getElementById("UnstuckPanel");
    btnUnstuck.addEventListener("click", () => {
        const abierto = panelUnstuck.classList.toggle("Abierto");
        panelUnstuck.hidden = !abierto;
    });

    document.getElementById("ThinkFormRespuesta").addEventListener("submit", (e) => {
        e.preventDefault();
        const respuesta = document.getElementById("ThinkRespuesta");
        const valor = respuesta.value.trim();
        if (valor === "") {
            respuesta.focus();
            return;
        }
        agregarMicroPaso(valor);
        respuesta.value = "";
        panelUnstuck.classList.remove("Abierto");
        panelUnstuck.hidden = true;
    });

    /* ============ FINAL: RESUMEN COMPLETO ============ */
    function finalizarSesion() {
        document.getElementById("ResumenMaterias").innerHTML =
            thinkState.materias.map(m =>
                `<span class="ChipItem" style="background:${m.color}33; color:${m.color}">${m.nombre}</span>`
            ).join("");

        document.getElementById("ResumenPendientes").innerHTML =
            thinkState.pendientes.map(p => {
                const materia = thinkState.materias.find(m => m.id === p.id_materia);
                const color = materia ? materia.color : "transparent";
                return `<li style="border-left-color:${color}">${p.texto}</li>`;
            }).join("");

                document.getElementById("ResumenRazones").innerHTML =
            thinkState.materias
                .filter(m => thinkState.pendientes.some(p => p.id_materia === m.id))
                .map(m => `<div class="TarjetaRazon" style="border-left:4px solid ${m.color}"><strong style="color:${m.color}">${m.nombre}:</strong> ${m.proposito || "(sin propósito escrito)"}</div>`)
                .join("");

        document.getElementById("ResumenMicroPasos").innerHTML =
            thinkState.microPasos.map(m => `<li>${m.texto}</li>`).join("");

        document.getElementById("ResumenPrimerPaso").textContent = `"${thinkState.primerPaso}"`;

                thinkState.pasoActual = "final";
        guardarEstado();
        mostrarVista("VistaFinal", "");
        // TODO: guardar thinkState completo en registro_journey.html cuando exista
    }

    document.getElementById("BtnVolverDashboard").addEventListener("click", () => {
        limpiarEstado();
        window.location.href = "dashboard.html";
    });

        // Botón de flecha del carrusel: desplaza la pista horizontalmente
    document.getElementById("BtnCarruselSiguiente").addEventListener("click", () => {
        const pista = document.getElementById("PistaPendientes");
        pista.scrollBy({ left: 200, behavior: "smooth" });
    });
    document.getElementById("BtnComoContinuar").addEventListener("click", () => {
        thinkState.pasoActual = "claridad";
        thinkState.enfoqueId = null; // que elija la siguiente prioridad automáticamente
        guardarEstado();
        renderClaridadMental();
        mostrarVista("VistaClaridad", "Paso 3 de 4");
    });
});