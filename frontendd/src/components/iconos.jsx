// Íconos SVG reutilizables. Cada uno es un componente-constante que se usa
// en varias páginas. "currentColor" toma el color definido en el CSS.
const propsComunes = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
};

// Con "export const" (en vez de "export default") un mismo archivo puede exportar varias cosas
export const iconoCorreo = (
  <svg {...propsComunes}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);

export const iconoCandado = (
  <svg {...propsComunes}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export const iconoUsuario = (
  <svg {...propsComunes}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);