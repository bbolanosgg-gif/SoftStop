// Journal: escribir para soltar → paso Unstuck (activación con el cuerpo).
// Nota de privacidad: lo que la persona escribe NO se guarda en ningún lado.
// Se limpia al pulsar TERMINAR; la caja es solo para desahogarse.
document.addEventListener('DOMContentLoaded', () => {
    const btnTerminar = document.getElementById('BtnTerminarJournal');
    const textoJournal = document.getElementById('TextoJournal');
    const etiqueta = document.getElementById('EtiquetaJournal');
    const titulo = document.getElementById('TituloJournal');
    const subtitulo = document.getElementById('SubtituloJournal');
    const panel = document.getElementById('PanelUnstuck');

    if (!btnTerminar || !textoJournal || !panel) return;

    btnTerminar.addEventListener('click', () => {
        // Soltar lo escrito: se borra sin guardarse
        textoJournal.value = '';

        // Ocultar la caja de escritura y mostrar el paso Unstuck
        if (etiqueta) etiqueta.hidden = true;
        textoJournal.hidden = true;
        btnTerminar.hidden = true;
        if (titulo) titulo.textContent = 'UNSTUCK';
        if (subtitulo) subtitulo.textContent = 'Activación rápida';

        panel.hidden = false;
        panel.focus();
    });
});
