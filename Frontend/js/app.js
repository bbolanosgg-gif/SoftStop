document.addEventListener("DOMContentLoaded", () => {

    const funciones = [
        {
            titulo: "RESET",
            subtitulo: "HAZ UNA PAUSA. VUELVE A TI",
            descripcion: "Cuando te sientas saturado, desconectado o simplemente necesites un momento para respirar, Reset te ofrece un espacio breve para detenerte y volver al presente. A través de prácticas cortas de mindfulness y ejercicios guiados, puedes despejar tu mente."
        },
        {
            titulo: "UNSTUCK",
            subtitulo: "DESATASCA TU MENTE",
            descripcion: "Cuando sientes que no avanzas, Unstuck te ayuda a identificar qué te detiene y te da un pequeño empujón para retomar el rumbo, con pasos simples y concretos."
        },
        {
            titulo: "THINK",
            subtitulo: "ORDENA TUS IDEAS",
            descripcion: "Un espacio para pensar con claridad. Think te guía con preguntas simples para organizar lo que tienes en la cabeza antes de tomar una decisión."
        },
        {
            titulo: "JOURNEY",
            subtitulo: "TU PROGRESO, VISIBLE",
            descripcion: "Journey registra tu recorrido de bienestar día a día, para que puedas ver cuánto has avanzado, incluso en los días difíciles."
        },
        {
            titulo: "CHECK-IN",
            subtitulo: "¿QUÉ TE DETIENE HOY?",
            descripcion: "No tienes que explicarlo. Solo elige lo que más se parece a este momento, y Softstop te acompaña desde ahí."
        }
    ];

    const tarjetas = document.querySelectorAll(".TarjetaCarrusel");
    const puntos = document.querySelectorAll(".Punto");
    const btnPrev = document.querySelector(".BtnPrev");
    const btnNext = document.querySelector(".BtnNext");

    const tituloEl = document.getElementById("TituloFuncion");
    const subtituloEl = document.getElementById("SubtituloFuncion");
    const descripcionEl = document.getElementById("DescripcionFuncion");
    const contenedorTextos = document.querySelector(".ContenedorTextosFuncion");

    let activo = 0;
    const total = tarjetas.length;

    function actualizarCarrusel() {
        tarjetas.forEach((tarjeta, i) => {
            tarjeta.classList.remove("activa", "prev", "next", "farprev", "farnext");

            // Distancia circular respecto a la tarjeta activa (-2 a 2)
            let diff = i - activo;
            if (diff > total / 2) diff -= total;
            if (diff < -total / 2) diff += total;

            if (diff === 0) tarjeta.classList.add("activa");
            else if (diff === -1) tarjeta.classList.add("prev");
            else if (diff === 1) tarjeta.classList.add("next");
            else if (diff === -2) tarjeta.classList.add("farprev");
            else if (diff === 2) tarjeta.classList.add("farnext");
        });

        puntos.forEach((punto, i) => {
            punto.classList.toggle("activo", i === activo);
        });

        // Transición suave de textos
        contenedorTextos.style.opacity = 0;
        setTimeout(() => {
            tituloEl.textContent = funciones[activo].titulo;
            subtituloEl.textContent = funciones[activo].subtitulo;
            descripcionEl.textContent = funciones[activo].descripcion;
            contenedorTextos.style.opacity = 1;
        }, 200);
    }

    function irA(indice) {
        activo = (indice + total) % total;
        actualizarCarrusel();
    }

    btnPrev.addEventListener("click", () => irA(activo - 1));
    btnNext.addEventListener("click", () => irA(activo + 1));

    puntos.forEach((punto) => {
        punto.addEventListener("click", () => {
            irA(parseInt(punto.dataset.index));
        });
    });

    tarjetas.forEach((tarjeta) => {
        tarjeta.addEventListener("click", () => {
            irA(parseInt(tarjeta.dataset.index));
        });
    });

    actualizarCarrusel();
});