document.addEventListener("DOMContentLoaded", () => {

    const btnCerrar = document.getElementById("BtnCerrarDash");
    const btnNuevaPausa = document.getElementById("BtnNuevaPausa");

    // Botón cerrar: vuelve al dashboard principal (Home)
    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            window.location.href = "dashboard.html";
        });
    }

    // Botón "+ INICIAR PAUSA": lleva al check-in principal
    if (btnNuevaPausa) {
        btnNuevaPausa.addEventListener("click", () => {
            window.location.href = "checkin.html";
        });
    }

});