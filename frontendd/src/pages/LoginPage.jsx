import { useState } from 'react';
import CampoFormulario from '../components/CampoFormulario';
import Boton from '../components/Boton/Boton';
import '../styles/login.css'; // Vite mete este CSS en la página automáticamente
import { iconoCorreo, iconoCandado } from '../components/iconos';
import BotonVolver from '../components/BotonVolver';

// Página de Login para acceder al Panel de Administración o sesión de estudiante
export default function LoginPage({ apiUrl, alIniciarSesion, cambiarPagina }) {
  // Estados: la "memoria" del componente. Cuando cambian, React vuelve a dibujar la página.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorLogin, setErrorLogin] = useState('');

  // Un objeto con un error por campo. Texto vacío = "sin error"
  const [errores, setErrores] = useState({ email: '', password: '' });

  // ¿El usuario marcó "Recordarme"? (por ahora solo guardamos el valor)
  const [recordarme, setRecordarme] = useState(false);

  // Revisa los campos y llena el objeto de errores.
  // Devuelve true si todo está bien, false si hay algún error.
  function validarFormulario() {
    const nuevosErrores = { email: '', password: '' };
    const correoLimpio = email.trim();

    if (!correoLimpio) {
      nuevosErrores.email = 'Necesitamos tu correo.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoLimpio)) {
      // Expresión regular: texto + @ + texto + punto + texto, sin espacios
      nuevosErrores.email = 'Verifica el formato de tu correo.';
    }

    if (!password) {
      nuevosErrores.password = 'Necesitamos tu contraseña.';
    }

    setErrores(nuevosErrores);

    // Todo está bien solo si ambos errores están vacíos
    return !nuevosErrores.email && !nuevosErrores.password;
  }

  // Se ejecuta cuando el usuario envía el formulario
  async function manejarLogin(event) {
    event.preventDefault(); // evita que el navegador recargue la página
    setErrorLogin('');

    if (!validarFormulario()) {
      setErrorLogin('Faltan algunos datos. Revisa los campos señalados.');
      return;
    }

    try {
      // Petición POST al backend
      const respuesta = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        setErrorLogin(datos.error || 'Credenciales incorrectas.');
        return;
      }

      // Enviamos los datos del usuario autenticado al componente padre (App.jsx)
      alIniciarSesion(datos.usuario);
    } catch (error) {
      setErrorLogin('No se pudo conectar con el servidor Backend.');
    }
  }

  return (
    // Capa 1: imagen de fondo de toda la pantalla
    <div className="CuerpoLogin">
      {/* Capa 2: centra la tarjeta en pantalla */}
      <section className="PaginaLogin">
        <BotonVolver alClick={() => cambiarPagina('inicio')} />
        {/* Capa 3: la tarjeta con efecto de vidrio */}
        <div className="LoginIzquierda">
          {/* Capa 4: limita el ancho del contenido */}
          <div className="LoginFormWrap">

            <h1 className="LoginTitulo">Bienvenido</h1>
            <p className="LoginSubtitulo">Inicia sesión para continuar</p>

            {/* Mensaje general: solo se dibuja si errorLogin tiene texto */}
            {errorLogin && <p className="LoginStatusMessage">{errorLogin}</p>}

            {/* noValidate apaga el globito del navegador para usar nuestros mensajes */}
            <form className="LoginForm" onSubmit={manejarLogin} noValidate>
              <CampoFormulario
                id="email"
                etiqueta="Correo electrónico"
                tipo="email"
                valor={email}
                alCambiar={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                error={errores.email}
                icono={iconoCorreo}
              />

              <CampoFormulario
                id="password"
                etiqueta="Contraseña"
                tipo="password"
                valor={password}
                alCambiar={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                error={errores.password}
                icono={iconoCandado}
              />

              <div className="LoginFilaExtra">
                <label className="LoginRecordarme">
                  <input
                    type="checkbox"
                    checked={recordarme}
                    onChange={(e) => setRecordarme(e.target.checked)}
                  />
                  Recordarme
                </label>

                <button
                  type="button"
                  className="LoginOlvidaste"
                  onClick={() => setErrorLogin('Para recuperar tu clave, por favor déjanos un mensaje en la sección de Contacto.')}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <Boton type="submit" variante="primario" tamano="lg" anchoCompleto>
                Iniciar sesión
              </Boton>
            </form>

            <p className="LoginToggleTexto">
              ¿No tienes una cuenta?
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  cambiarPagina('registro');
                }}
              >
                Crear cuenta gratis
              </a>
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}
