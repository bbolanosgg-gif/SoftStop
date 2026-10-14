(() => {
    const raiz = document.documentElement;
    const mostrar = () => raiz.classList.add('fondo-listo');

    const img = new Image();
    img.src = 'img/Fondo.webp';
    // decode() espera a que esté lista para pintarse, no solo descargada
    img.decode ? img.decode().then(mostrar).catch(mostrar) : (img.onload = mostrar);
})();

document.addEventListener("DOMContentLoaded", () => {
    // 1. Seleccionamos todos los elementos de la coreografía
    const castillo = document.querySelector('.castillo');
    const sombra = document.querySelector('.sombra');
    const marca = document.querySelector('.header-marca');
    const textos = document.querySelectorAll('.texto-stagger');
    const desacelera = document.querySelector('.texto-final');

    // 2. Primera fase (T = 100ms): El castillo y su sombra emergen suavemente
    setTimeout(() => {
        if(castillo) castillo.classList.add('visible');
        if(sombra) sombra.classList.add('visible');
    }, 100);

    // 3. Segunda fase (T = 1500ms): Aparece el logo de SOFTSTOP arriba a la izquierda
    setTimeout(() => {
        if(marca) marca.classList.add('visible');
    }, 1500);

    // 4. Tercera fase (T = 2500ms): Aparece el mensaje central
    setTimeout(() => {
        textos.forEach((texto, index) => {
            setTimeout(() => {
                texto.classList.add('visible');
            }, index * 400); // Pequeño efecto cascada si hay varios elementos
        });
    }, 2500);

    // 5. Fase final (T = 4500ms): La palabra DESACELERA aparece lentamente en el fondo
    setTimeout(() => {
        if(desacelera) desacelera.classList.add('visible');
    }, 4500);
});