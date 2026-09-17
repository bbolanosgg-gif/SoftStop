document.addEventListener("DOMContentLoaded", () => {
    const opciones = document.querySelectorAll(".OpcionCheckIn:not(.OpcionOtra)");
    const btnOtra = document.getElementById("BtnOtraRazon");
    const cajaOtra = document.getElementById("CajaOtraRazon");
    const btnEnviar = document.getElementById("BtnEnviarRazon");
    const textoLibre = document.getElementById("TextoLibre");

    
    const rutas = {
    "saturado": "funcion-reset.html",      // Saturación alta -> Ruta RESET
    "frustrado": "ruta-think.html",        // Bloqueo técnico -> Ruta THINK
    "no_empezar": "interfaz-simplificada.html", // Energía baja -> Interfaz simplificada
    "avanzar": "dashboard.html",           // Está bien, solo quiere seguir
    "no_lo_se": "funcion-reset.html",      // Ambiguo -> por ahora lo mandamos a Reset
};
    
    // 2. Lógica al hacer clic en las opciones principales
    opciones.forEach((opcion) => {
        opcion.addEventListener("click", () => {
            const valor = opcion.dataset.valor; 
            
            // Verifica si el valor está en el diccionario y redirecciona
            if (rutas[valor]) {
                window.location.href = `${rutas[valor]}?origen=${valor}`;
            } else {
                console.log("Falta definir la ruta para:", valor);
            }
        });
    });

    // 3. Mostrar/ocultar caja de texto de "Otra razón..."
    btnOtra.addEventListener("click", () => {
        cajaOtra.classList.toggle("visible");
        if (cajaOtra.classList.contains("visible")) {
            textoLibre.focus();
        }
    });

    // 4. Confirmar razón escrita a mano
    btnEnviar.addEventListener("click", () => {
        const texto = textoLibre.value.trim();
        if (texto === "") {
            textoLibre.focus();
            return;
        }
        
        // Como no sabemos qué escribió, lo enviamos a una ruta neutral para procesarlo
        // O directo al registro en journey como muestra tu diagrama inferior
        window.location.href = `registro_journey.html?motivo=${encodeURIComponent(texto)}`;
    });
});