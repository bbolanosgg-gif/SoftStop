// Revela progresivamente los elementos marcados con [data-reveal]
// a medida que entran en el viewport (equivalente casero a AOS).
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll("[data-reveal]");
  if (!items.length) return;

  // Aplica el delay individual (data-reveal-delay="150", en ms)
  items.forEach((el) => {
    const delay = el.getAttribute("data-reveal-delay");
    if (delay) el.style.setProperty("--reveal-delay", `${delay}ms`);
  });

  // Si el navegador no soporta IntersectionObserver, muestra todo de una
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target); // se revela una sola vez
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  items.forEach((el) => observer.observe(el));
});
