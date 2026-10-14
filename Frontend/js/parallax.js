document.addEventListener('DOMContentLoaded', () => {
    const muelle = document.querySelector('.Capa-Muelle');
    const pajaros = document.querySelector('.Capa-Pajaros');
    const seccionMensajes = document.getElementById('mensajes');

    window.addEventListener('scroll', () => {
        if (!seccionMensajes) return;

        // Obtenemos la posición de la sección de mensajes respecto a la ventana
        const rectMensajes = seccionMensajes.getBoundingClientRect();
        const alturaVentana = window.innerHeight;

        // Calculamos qué tanto ha entrado la sección en la pantalla
        // 0 = apenas toca el borde inferior, valores positivos = va subiendo
        let progreso = alturaVentana - rectMensajes.top; 

        // Si la sección "Mensajes" ya empezó a entrar en pantalla
        if (progreso > 0 && progreso < rectMensajes.height + alturaVentana) {
            
            // 1. ANIMACIÓN DEL MUELLE
            if (muelle) {
                // La opacidad va de 0 a 1 a medida que la sección entra
                let opacidadMuelle = Math.min(1, progreso / 600); 
                
                // Sube suavemente basado en el progreso
                let movimientoY = progreso * 0.15; 
                if (movimientoY > 150) movimientoY = 150; // Límite de subida
                
                muelle.style.opacity = opacidadMuelle; 
                muelle.style.transform = `translateY(-${movimientoY}px)`;
            }

            // 2. ANIMACIÓN DE LOS PÁJAROS
            if (pajaros) {
                // Los pájaros aparecen un poco más rápido
                let opacidadPajaros = Math.min(1, progreso / 400);
                
                let movX = progreso * 0.1;
                let movY = progreso * 0.05;
                
                pajaros.style.opacity = opacidadPajaros;
                pajaros.style.transform = `translate(-${movX}px, -${movY}px)`;
            }
            
        } else if (progreso <= 0) {
            // Si el usuario hace scroll hacia arriba (vuelve al Hero), oculta los vectores
            if (muelle) {
                muelle.style.opacity = 0;
                muelle.style.transform = 'translateY(0)';
            }
            if (pajaros) {
                pajaros.style.opacity = 0;
                pajaros.style.transform = 'translate(0, 0)';
            }
        }
    });
});