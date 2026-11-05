// Herramientas base de SoftStop.
// Se insertan en MongoDB automáticamente SOLO cuando la colección está vacía
// (lo hace obtenerHerramientas en herramientas.controller.js).
// A partir de ahí, la administradora las edita desde el Panel Admin.
//
// Cada campo se usa en un lugar distinto:
//   nombre       -> título de la carta en la landing
//   lema         -> frase corta bajo el título
//   descripcion  -> texto principal de la carta
//   beneficio    -> se ve en las tarjetas del Panel Admin
//   icono        -> emoji de la carta
module.exports = [
  {
    nombre: 'Journey',
    lema: 'VISUALIZA TU PROGRESO',
    descripcion: 'Un espacio para valorar tus avances, incluso los más pequeños.',
    beneficio: 'Visibiliza tu progreso real más allá de las calificaciones universitarias.',
    icono: '👁️',
    estadoDisponibilidad: 'Disponible en catálogo'
  },
  {
    nombre: 'Reset',
    lema: 'PAUSA Y REINICIA',
    descripcion: 'Un momento para respirar, hacer una pausa y volver al presente.',
    beneficio: 'Disminuye la saturación mental y calma el sistema nervioso en pocos minutos.',
    icono: '🌿',
    estadoDisponibilidad: 'Disponible en catálogo'
  },
  {
    nombre: 'Think',
    lema: 'REFLEXIÓN PROFUNDA',
    descripcion: 'Te ayuda a encontrar claridad, dar el primer paso y recordar por qué empezaste.',
    beneficio: 'Ordena tus materias y tareas pendientes sin sentir presión ni agobio.',
    icono: '💬',
    estadoDisponibilidad: 'Disponible en catálogo'
  },
  {
    nombre: 'Journal',
    lema: 'DESAHOGO PERSONAL',
    descripcion: 'Un lugar para escribir lo que piensas y sacar lo que llevas dentro.',
    beneficio: 'Suelta lo que te preocupa y despeja la mente antes de estudiar.',
    icono: '📖',
    estadoDisponibilidad: 'Disponible en catálogo'
  },
  {
    nombre: 'Unstuck',
    lema: 'DESBLOQUEA TU MENTE',
    descripcion: 'Te ayuda a descubrir por dónde empezar según cómo te sientes y cuánta energía tienes.',
    beneficio: 'Rompe la parálisis por análisis cuando te cuesta iniciar una tarea difícil.',
    icono: '⚡',
    estadoDisponibilidad: 'Disponible en catálogo'
  }
];