document.addEventListener('DOMContentLoaded', () => {
    const btnTerminar = document.getElementById('BtnTerminarJournal');
    const textoJournal = document.getElementById('TextoJournal');
    const vistaPrincipal = document.getElementById('VistaJournal');

    if (btnTerminar) {
        btnTerminar.addEventListener('click', () => {
            const contenido = textoJournal.value.trim();

            // Opcional: Aquí podrías guardar el desahogo en localStorage si lo deseas conservar temporalmente
            if(contenido) {
                localStorage.setItem('ultimoDesahogo', contenido);
            }

            // Transformamos la vista actual en la fase de Unstuck (Activación rápida)
            vistaPrincipal.innerHTML = `
                <span class="ThinkEyebrow">UNSTUCK · ACTIVACIÓN</span>
                <h1 class="ThinkPasoTitulo">Ya sacaste el peso de tu cabeza 🤍</h1>
                <p class="ThinkPasoSubtitulo" style="margin-bottom: 30px;">
                    Escribir lo que sientes frena la inercia del estrés. Ahora, rompamos la parálisis con el cuerpo, no con la mente.
                </p>

                <div style="background: rgba(255, 255, 255, 0.85); border: 1px solid rgba(174, 152, 240, 0.3); border-radius: 20px; padding: 30px; text-align: center; margin-bottom: 30px;">
                    <span style="font-size: 32px; display: block; margin-bottom: 10px;">💧💧</span>
                    <h3 style="font-family: var(--fuente-principal); font-size: 18px; color: var(--color-texto); margin-bottom: 10px;">Tu micro-paso de ahora:</h3>
                    <p style="font-family: var(--fuente-secundaria); font-size: 15px; color: #555;">
                        "Levántate, ve por un vaso con agua fría, estira los brazos hacia arriba durante 10 segundos y vuelve."
                    </p>
                </div>

                <a href="dashboard.html" class="BtnThinkContinuar" style="display: inline-block; text-align: center; text-decoration: none;">
                    Ya me activé, volver al inicio →
                </a>
            `;
        });
    }
});