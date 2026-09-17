document.addEventListener("DOMContentLoaded", () => {
    const btnContinuar = document.getElementById("BtnSimpleContinuar");

    btnContinuar.addEventListener("click", () => {
        // TODO: cuando exista registro_journey.html, cambiar este destino
        // para registrar la pausa antes de volver al Dashboard (ver Diagrama 1)
        window.location.href = "dashboard.html";
    });
});