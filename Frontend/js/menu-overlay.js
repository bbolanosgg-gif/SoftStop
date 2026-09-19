// Controla el menú overlay: se abre con el botón MENU,
// se cierra con la X, con Escape, tocando el fondo, o al
// hacer clic en un enlace.
document.addEventListener("DOMContentLoaded", () => {
  const trigger = document.querySelector(".MenuHamburguesa");
  const overlay = document.querySelector(".MenuOverlay");
  if (!trigger || !overlay) return;

  const closeBtn = overlay.querySelector(".MenuOverlay-close");
  const bg = overlay.querySelector(".MenuOverlay-bg");
  const links = overlay.querySelectorAll(".MenuOverlay-link");

  // Delay escalonado por columna (cascada al abrir)
  overlay.querySelectorAll(".MenuOverlay-group").forEach((g, i) => {
    g.style.setProperty("--group-delay", `${i * 80}ms`);
  });

  function open() {
    overlay.classList.add("is-open");
    document.body.classList.add("MenuAbierto");
    trigger.setAttribute("aria-expanded", "true");
  }

  function close() {
    overlay.classList.remove("is-open");
    document.body.classList.remove("MenuAbierto");
    trigger.setAttribute("aria-expanded", "false");
  }

  function toggle() {
    overlay.classList.contains("is-open") ? close() : open();
  }

  trigger.setAttribute("aria-expanded", "false");
  trigger.setAttribute("aria-controls", "menuOverlay");
  trigger.addEventListener("click", toggle);
  closeBtn.addEventListener("click", close);
  bg.addEventListener("click", close);
  links.forEach((a) => a.addEventListener("click", close));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
  });
});
