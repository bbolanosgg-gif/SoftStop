document.addEventListener("DOMContentLoaded", () => {

    const opciones = document.querySelectorAll(".OpcionCheckIn:not(.OpcionOtra)");
    const btnOtra = document.getElementById("BtnOtraRazon");
    const cajaOtra = document.getElementById("CajaOtraRazon");
    const btnEnviar = document.getElementById("BtnEnviarRazon");
    const textoLibre = document.getElementById("TextoLibre");

    // Selección de una opción predefinida
    opciones.forEach((opcion) => {
        opcion.addEventListener("click", () => {
            opciones.forEach((o) => o.classList.remove("seleccionada"));
            opcion.classList.add("seleccionada");

            const valor = opcion.dataset.valor;
            console.log("Opción elegida:", valor);

            // Aquí podrías redirigir a la siguiente pantalla, por ejemplo:
            // window.location.href = `siguiente.html?motivo=${valor}`;
        });
    });

    // Mostrar/ocultar caja de texto libre
    btnOtra.addEventListener("click", () => {
        cajaOtra.classList.toggle("visible");
        if (cajaOtra.classList.contains("visible")) {
            textoLibre.focus();
        }
    });

    // Confirmar razón escrita a mano
    btnEnviar.addEventListener("click", () => {
        const texto = textoLibre.value.trim();
        if (texto === "") {
            textoLibre.focus();
            return;
        }
        console.log("Razón personalizada:", texto);
        // window.location.href = `siguiente.html?motivo=${encodeURIComponent(texto)}`;
    });
});