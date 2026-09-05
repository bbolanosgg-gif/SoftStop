document.addEventListener("DOMContentLoaded", () => {

    const btnCerrar = document.getElementById("BtnCerrarDash");
    const btnNuevaPausa = document.getElementById("BtnNuevaPausa");

    // Botón cerrar: vuelve al inicio (index.html)
    btnCerrar.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // Botón "+ NUEVA PAUSA": lleva al check-in para elegir cómo se siente
    btnNuevaPausa.addEventListener("click", () => {
        window.location.href = "checkin.html";
    });

});