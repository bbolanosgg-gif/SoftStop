document.addEventListener("DOMContentLoaded", () => {
    const btnSaturado = document.getElementById('btnSaturado');
    const btnSinEnergia = document.getElementById('btnSinEnergia');
    const btnOrganizar = document.getElementById('btnOrganizar');

    // 1. Saturado / Caos mental ➔ Redirige a RESET para bajar revoluciones
    if (btnSaturado) {
        btnSaturado.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'funcion-reset.html?origen=saturado';
        });
    }

    // 2. Sin energía / Pereza ➔ Redirige al flujo lineal: Journal -> Unstuck
    if (btnSinEnergia) {
        btnSinEnergia.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'journal.html?origen=sin_energia';
        });
    }

    // 3. Organizar ➔ Redirige directo a THINK (volcado mental y escalera de niebla)
    if (btnOrganizar) {
        btnOrganizar.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'ruta-think.html?origen=organizar';
        });
    }
});