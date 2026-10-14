
document.addEventListener("DOMContentLoaded", () => {
  const seccion = document.querySelector(".Mensajes");
  if (!seccion) return;

  const escenario = seccion.querySelector(".MensajesStage");
  const mensajes = Array.from(seccion.querySelectorAll(".Mensaje"));
  const n = mensajes.length;
  if (!escenario || !n) return;

  // El CSS calcula la altura de la sección con esta variable
  seccion.style.setProperty("--n", n);

  let actual = -1;

  function mostrar(i) {
    if (i === actual) return;
    actual = i;
    mensajes.forEach((m, k) => {
      const activo = k === i;
      m.classList.toggle("activo", activo);
      m.setAttribute("aria-hidden", activo ? "false" : "true");
    });
  }

  function calcular() {
    // Distancia de scroll durante la cual el escenario está fijado
    const recorrido = seccion.offsetHeight - escenario.offsetHeight;
    if (recorrido <= 0) return mostrar(0);

    const avance = -seccion.getBoundingClientRect().top / recorrido; // 0 → 1
    const limitado = Math.min(Math.max(avance, 0), 0.9999);
    mostrar(Math.floor(limitado * n));
  }

  // Un solo cálculo por fotograma, aunque lleguen muchos eventos de scroll
  let pendiente = false;
  function alMover() {
    if (pendiente) return;
    pendiente = true;
    requestAnimationFrame(() => {
      pendiente = false;
      calcular();
    });
  }

  window.addEventListener("scroll", alMover, { passive: true });
  window.addEventListener("resize", alMover);
  calcular();
});


