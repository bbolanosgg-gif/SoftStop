import { useState } from 'react';
import CampoFormulario from '../components/CampoFormulario';
import { iconoCorreo, iconoCandado, iconoUsuario } from '../components/iconos';
import '../styles/login.css'; // reutilizamos el mismo CSS del login
import BotonVolver from '../components/BotonVolver';

// Página de registro: crea una cuenta de cliente en MongoDB
export default function RegistroPage({ apiUrl, cambiarPagina }) {
  // Un estado por cada campo del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmar, setConfirmar] = useState('');

  // Un error por campo (texto vacío = sin error)
  const [errores, setErrores] = useState({ nombre: '', email: '', password: '', confirmar: '' });

  // Mensaje general: arriba del formulario (errores del servidor o éxito)
  const [mensaje, setMensaje] = useState('');

  // Revisa todos los campos. Devuelve true si todo está bien.
  function validarFormulario() {
    const nuevos = { nombre: '', email: '', password: '', confirmar: '' };

    if (!nombre.trim()) {
      nuevos.nombre = 'Necesitamos tu nombre.';
    }

    if (!email.trim()) {
      nuevos.email = 'Necesitamos tu correo.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nuevos.email = 'Verifica el formato de tu correo.';
    }

    // El mínimo de 8 es el mismo que revisa el backend
    if (password.length < 8) {
      nuevos.password = 'Debe tener al menos 8 caracteres.';
    }

    if (confirmar !== password) {
      nuevos.confirmar = 'Las contraseñas no coinciden.';
    }

    setErrores(nuevos);

    // Object.values(...) saca los 4 mensajes; .every(...) pregunta si TODOS están vacíos
    return Object.values(nuevos).every((mensajeError) => mensajeError === '');
  }

  async function manejarRegistro(event) {
    event.preventDefault();
    setMensaje('');

    if (!validarFormulario()) {
      setMensaje('Faltan algunos datos. Revisa los campos señalados.');
      return;
    }

    try {
      // Solo enviamos nombre, email y password. "confirmar" es solo para el frontend.
      const respuesta = await fetch(`${apiUrl}/api/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, email, password })
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        // Por ejemplo 409: "Ya existe una cuenta con ese correo."
        setMensaje(datos.error || 'No se pudo crear la cuenta.');
        return;
      }

      // Éxito: limpiamos el formulario y avisamos
      setNombre('');
      setEmail('');
      setPassword('');
      setConfirmar('');
      setMensaje('¡Cuenta creada! Ya puedes iniciar sesión.');
    } catch (error) {
      setMensaje('No se pudo conectar con el servidor Backend.');
    }
  }

  return (
    <div className="CuerpoLogin">
      <section className="PaginaLogin">
        <BotonVolver alClick={() => cambiarPagina('inicio')} />
        <div className="LoginIzquierda">
          <div className="LoginFormWrap">

            <h1 className="LoginTitulo">Crear cuenta</h1>
            <p className="LoginSubtitulo">Regístrate para empezar</p>

            {mensaje && <p className="LoginStatusMessage">{mensaje}</p>}

            <form className="LoginForm" onSubmit={manejarRegistro} noValidate>
              <CampoFormulario
                id="nombre"
                etiqueta="Nombre"
                tipo="text"
                valor={nombre}
                alCambiar={(e) => setNombre(e.target.value)}
                placeholder="Tu nombre"
                error={errores.nombre}
                icono={iconoUsuario}
              />

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
                placeholder="Mínimo 8 caracteres"
                error={errores.password}
                icono={iconoCandado}
              />

              <CampoFormulario
                id="confirmar"
                etiqueta="Confirmar contraseña"
                tipo="password"
                valor={confirmar}
                alCambiar={(e) => setConfirmar(e.target.value)}
                placeholder="Repite tu contraseña"
                error={errores.confirmar}
                icono={iconoCandado}
              />

              <button type="submit" className="LoginBotonSubmit">
                Crear cuenta
              </button>
            </form>

            <p className="LoginToggleTexto">
              ¿Ya tienes una cuenta?
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();       // evita que "#" suba la página
                  cambiarPagina('login');   // cambia de página con el estado de App.jsx
                }}
              >
                Inicia sesión
              </a>
            </p>

          </div>
        </div>
      </section>
    </div>
  );
}