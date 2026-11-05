import { useState } from 'react';

// Campo reutilizable: etiqueta + input redondeado + ícono opcional + mensaje de error opcional.
// Si el campo es de tipo "password", agrega un botón de ojo para ver el texto.
export default function CampoFormulario({
  id,          // identificador único; conecta la etiqueta con el input
  etiqueta,    // texto que se muestra arriba del campo
  tipo,        // "email", "password", "text"...
  valor,       // lo que el usuario ha escrito (viene del useState del padre)
  alCambiar,   // función que se ejecuta cada vez que el usuario escribe
  placeholder, // texto gris de ejemplo
  error,       // mensaje de error; si está vacío, no se muestra nada
  icono        // elemento JSX (un SVG) que se dibuja a la izquierda; es opcional
}) {
  // Estado LOCAL: ¿se está mostrando la contraseña?
  // Es local porque al padre (LoginPage) no le importa si el ojo está abierto o cerrado.
  const [verPassword, setVerPassword] = useState(false);

  // ¿Este campo es de contraseña? (true o false)
  const esPassword = tipo === 'password';

  // Si es contraseña y el ojo está activo, el input pasa a "text" (se ve el texto).
  // En cualquier otro caso, usa el tipo que llegó por props.
  const tipoReal = esPassword && verPassword ? 'text' : tipo;

  return (
    // Si hay error, el div recibe la clase "error" y el CSS pinta el borde rojo
    <div className={error ? 'LoginCampo error' : 'LoginCampo'}>
      <label htmlFor={id}>{etiqueta}</label>

      {/* LoginInputWrap es la "píldora" blanca que envuelve ícono + input + ojo */}
      <div className="LoginInputWrap">
        {/* Solo se dibuja si la página le pasó un ícono */}
        {icono && <span className="LoginInputIcono">{icono}</span>}

        <input
          id={id}
          type={tipoReal}
          value={valor}
          onChange={alCambiar}
          placeholder={placeholder}
        />

        {/* El botón del ojo solo se dibuja si el campo es de contraseña */}
        {esPassword && (
          <button
            type="button" // IMPORTANTE: sin esto, el botón enviaría el formulario
            className="LoginTogglePass"
            onClick={() => setVerPassword(!verPassword)} // invierte true/false
            aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {verPassword ? (
              // Ojo tachado: la contraseña se está viendo
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
            ) : (
              // Ojo abierto: la contraseña está oculta
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Solo se dibuja si "error" tiene texto */}
      {error && <p className="LoginError">{error}</p>}
    </div>
  );
}