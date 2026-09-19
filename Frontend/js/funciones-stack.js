// Controla el stack de tarjetas de la sección Funciones:
// una al frente, una a la izquierda, una a la derecha,
// y el resto oculto esperando turno.
document.addEventListener("DOMContentLoaded", () => {
  const wrap = document.querySelector(".wrap_stack");
  if (!wrap) return;

  const cards = Array.from(wrap.querySelectorAll(".stack-card"));
  const dotsContainer = wrap.parentElement.querySelector(".stack-dots");
  const n = cards.length;
  let current = 0;
  let timer = null;
  const interval = 3200;

  const dots = cards.map((_, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "stack-dot";
    b.setAttribute("aria-label", `Ver función ${i + 1}`);
    b.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(b);
    return b;
  });

  function applySlots() {
    const right = (current + 1) % n;
    const left = (current - 1 + n) % n;
    cards.forEach((c, i) => {
      if (i === current) c.dataset.slot = "front";
      else if (i === right) c.dataset.slot = "right";
      else if (i === left) c.dataset.slot = "left";
      else c.dataset.slot = "hidden";
    });
    dots.forEach((d, i) =>
      d.setAttribute("aria-current", i === current ? "true" : "false")
    );
  }

  function goTo(i) {
    current = ((i % n) + n) % n;
    applySlots();
    restart();
  }

  function next() {
    current = (current + 1) % n;
    applySlots();
  }

  function restart() {
    if (timer) clearInterval(timer);
    timer = setInterval(next, interval);
  }

  cards.forEach((c, i) => {
    c.addEventListener("click", () => {
      if (c.dataset.slot === "left" || c.dataset.slot === "right") {
        goTo(i);
      }
    });
  });

  wrap.addEventListener("mouseenter", () => {
    if (timer) clearInterval(timer);
  });
  wrap.addEventListener("mouseleave", restart);

  applySlots();
  restart();
});
