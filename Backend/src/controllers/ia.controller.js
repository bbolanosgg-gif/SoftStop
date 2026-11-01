// Controlador del Recomendador Inteligente de Bienestar (Requisito 05 - IA Aplicada)
function recomendarHerramienta(req, res) {
  const { estadoAnimo, tareaPendiente } = req.body;

  if (!estadoAnimo) {
    return res.status(400).json({ error: "Por favor selecciona cómo te sientes hoy." });
  }

  const tarea = tareaPendiente && tareaPendiente.trim() !== ""
    ? tareaPendiente.trim()
    : "tus actividades académicas";

  let herramientaSugerida = "";
  let consejoPractica = "";
  let microPaso = "";

  // Lógica de recomendación según el estado emocional del estudiante
  if (estadoAnimo === "saturado") {
    herramientaSugerida = "Reset (Pausa Activa)";
    consejoPractica = "Tu mente tiene demasiada información al mismo tiempo. Intentar avanzar en " + tarea + " bajo saturación solo aumentará tu cansancio.";
    microPaso = "Realiza 3 ciclos de respiración 4-7-8 (inhala 4s, retén 7s, exhala 8s) lejos de la pantalla antes de abrir tus apuntes.";
  } else if (estadoAnimo === "sin_energia") {
    herramientaSugerida = "Journal & Unstuck";
    consejoPractica = "Cuando no hay energía o sientes bloqueo frente a " + tarea + ", el objetivo no es terminar todo, sino romper la inercia con una acción mínima.";
    microPaso = "Levántate por un vaso de agua, escribe en una hoja qué es lo que más te abruma y dedica solo 5 minutos a leer el primer párrafo de " + tarea + ".";
  } else if (estadoAnimo === "organizar") {
    herramientaSugerida = "Ruta Think";
    consejoPractica = "Tienes buena disposición mental hoy. Es el momento ideal para estructurar " + tarea + " sin caer en la multitarea.";
    microPaso = "Divide " + tarea + " en 3 pasos pequeños, pon un temporizador de 25 minutos sin celular y enfócate únicamente en el paso número 1.";
  } else {
    herramientaSugerida = "Check-in Emocional";
    consejoPractica = "Reconocer cómo estás es el primer paso para estudiar con bienestar.";
    microPaso = "Haz una pausa de 2 minutos para estirar los hombros y elegir una sola prioridad para hoy.";
  }

  res.status(200).json({
    estadoRecibido: estadoAnimo,
    herramientaSugerida: herramientaSugerida,
    consejoPractica: consejoPractica,
    microPaso: microPaso
  });
}

module.exports = {
  recomendarHerramienta
};