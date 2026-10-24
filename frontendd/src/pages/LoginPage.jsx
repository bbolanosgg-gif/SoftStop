import { useState } from 'react'
import { login, registro } from '../services/api'
import '../styles/login.css'
import { useNavigate, Link } from 'react-router-dom'

// Fuera del componente porque no depende de nada: no hace falta recrearla en cada dibujo
const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

function LoginPage() {
  const navigate = useNavigate()

  // ---------- ESTADO ----------
  // Cada useState reemplaza una variable o un getElementById de tu login.js
  const [modoLogin, setModoLogin] = useState(true) // antes: let isLoginMode
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [verPassword, setVerPassword] = useState(false)
  const [errores, setErrores] = useState({ nombre: false, email: false, password: false })
  const [mensaje, setMensaje] = useState('') // antes: statusMessage
  const [cargando, setCargando] = useState(false)

  // ---------- FUNCIONES ----------
  const cambiarModo = (e) => {
    e.preventDefault()
    setModoLogin((actual) => !actual) // invierte true/false
    setMensaje('')
    setErrores({ nombre: false, email: false, password: false })
  }

  // Devuelve una función para el onChange de un input:
  // guarda lo escrito y quita el error de ese campo.
  const alEscribir = (setValor, campo) => (e) => {
    setValor(e.target.value)
    setErrores((previos) => ({ ...previos, [campo]: false }))
  }

  const enviar = async (e) => {
    e.preventDefault() // evita que el navegador recargue la página al enviar

    setMensaje('')

    // Validación en el navegador (rápida, sin molestar al servidor)
    const nuevosErrores = {
      nombre: !modoLogin && nombre.trim() === '',
      email: !validarEmail(email.trim()),
      password: modoLogin ? password.trim() === '' : password.length < 8,
    }
    setErrores(nuevosErrores)

    // Object.values(...).some(Boolean) = "¿hay algún error en true?"
    if (Object.values(nuevosErrores).some(Boolean)) {
      setMensaje('Faltan algunos datos. Revisa los campos señalados.')
      return
    }

    setCargando(true)

    try {
      if (modoLogin) {
        const usuario = await login(email.trim(), password)

        // TODO (corte 2): quitar esto. El rol vendrá del servidor, no del correo.
        navigate(usuario.email === 'admin@softstop.com' ? '/admin' : '/dashboard')
      } else {
        await registro(nombre.trim(), email.trim(), password)
        navigate('/checkin')
      }
    } catch (error) {
      // api.js ya convirtió el mensaje del backend en error.message
      setMensaje(error.message)
      setCargando(false)
    }
    // Si todo salió bien, navigate() nos lleva a otra página y este componente
    // desaparece, por eso no hace falta llamar a setCargando(false).
  }

  // ---------- TEXTOS SEGÚN EL MODO ----------
  const textoBoton = cargando
    ? 'Cargando...'
    : modoLogin ? 'Iniciar sesión' : 'Crear cuenta'

  const textoErrorPassword = modoLogin
    ? 'Necesitamos tu contraseña.'
    : 'Usa al menos 8 caracteres.'

  // ---------- LO QUE SE VE ----------
  return (
    // Antes, la clase CuerpoLogin iba en el <body>. En React el body es de toda la app,
    // así que la pasamos a un div que envuelve la pantalla.
    <div className="CuerpoLogin">
      <div className="PaginaLogin">
        {/* Botón de volver, esquina superior derecha */}
        <Link to="/" className="LoginVolver" aria-label="Volver al inicio">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M11 6L5 12L11 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Volver</span>
        </Link>

        {/* ===== PANEL IZQUIERDO: FORMULARIO ===== */}
        <div className="LoginIzquierda">
          <div className="LoginFormWrap">

            <h1 className="LoginTitulo">
              {modoLogin ? 'Bienvenido' : 'Crea tu cuenta'}
            </h1>
            <p className="LoginSubtitulo">
              {modoLogin ? 'Inicia sesión para continuar' : 'Únete para continuar'}
            </p>

            {/* Render condicional: si "mensaje" está vacío, no se dibuja nada */}
            {mensaje && (
              <div className="LoginStatusMessage" role="alert">{mensaje}</div>
            )}

            <form className="LoginForm" onSubmit={enviar} noValidate>

              {/* Nombre: solo existe en modo registro */}
              {!modoLogin && (
                <div className={`LoginCampo LoginCampoNombre${errores.nombre ? ' error' : ''}`}>
                  <label htmlFor="name">Tu nombre</label>
                  <div className="LoginInputWrap">
                    <span className="LoginInputIcono">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M3 21C3 17.134 7.02944 14 12 14C16.9706 14 21 17.134 21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      id="name"
                      placeholder="¿Cómo prefieres que te llamemos?"
                      autoComplete="name"
                      value={nombre}
                      onChange={alEscribir(setNombre, 'nombre')}
                    />
                  </div>
                  {errores.nombre && (
                    <p className="LoginError">Por favor, compártenos tu nombre.</p>
                  )}
                </div>
              )}

              {/* Correo */}
              <div className={`LoginCampo${errores.email ? ' error' : ''}`}>
                <label htmlFor="email">Correo electrónico</label>
                <div className="LoginInputWrap">
                  <span className="LoginInputIcono">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 6.5L10.89 12.1C11.5624 12.5773 12.4376 12.5773 13.11 12.1L21 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="email"
                    placeholder="ejemplo@correo.com"
                    autoComplete="email"
                    value={email}
                    onChange={alEscribir(setEmail, 'email')}
                  />
                </div>
                {errores.email && (
                  <p className="LoginError">Verifica el formato de tu correo.</p>
                )}
              </div>

              {/* Contraseña */}
              <div className={`LoginCampo${errores.password ? ' error' : ''}`}>
                <label htmlFor="password">Contraseña</label>
                <div className="LoginInputWrap">
                  <span className="LoginInputIcono">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="5" y="10" width="14" height="10" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M8 10V7.5C8 5.29086 9.79086 3.5 12 3.5C14.2091 3.5 16 5.29086 16 7.5V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  <input
                    type={verPassword ? 'text' : 'password'}
                    id="password"
                    placeholder="Ingresa tu contraseña"
                    autoComplete={modoLogin ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={alEscribir(setPassword, 'password')}
                  />
                  <button
                    type="button"
                    className="LoginTogglePass"
                    aria-label={verPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    onClick={() => setVerPassword((actual) => !actual)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {verPassword ? (
                        // Ojo tachado (contraseña visible)
                        <path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      ) : (
                        // Ojo abierto (contraseña oculta). <> </> agrupa dos elementos sin añadir etiquetas
                        <>
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" stroke="currentColor" strokeWidth="1.5" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
                {errores.password && (
                  <p className="LoginError">{textoErrorPassword}</p>
                )}
              </div>

              {/* Recordarme / Olvidaste: solo en modo login */}
              {modoLogin && (
                <div className="LoginFilaExtra">
                  <label className="LoginRecordarme">
                    {/* TODO (corte 2): conectar este checkbox con el guardado del token */}
                    <input type="checkbox" id="recordarme" />
                    <span>Recordarme</span>
                  </label>
                  <a href="#" className="LoginOlvidaste" onClick={(e) => e.preventDefault()}>
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              )}

              <div style={{ textAlign: 'center', width: '100%' }}>
                <button type="submit" className="LoginBotonSubmit" disabled={cargando}>
                  <span>{textoBoton}</span>
                </button>
              </div>

              <p className="LoginToggleTexto">
                <span>
                  {modoLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                </span>
                <a href="#" onClick={cambiarModo}>
                  {modoLogin ? 'Crear cuenta gratis' : 'Inicia sesión'}
                </a>
              </p>

            </form>
          </div>
        </div>



      </div>
    </div>
  )
}

export default LoginPage