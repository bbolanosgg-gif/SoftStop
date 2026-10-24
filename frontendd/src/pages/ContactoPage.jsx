import { useState } from 'react'
import { Link } from 'react-router-dom'
import { enviarContacto } from '../services/api'
import '../styles/login.css'
import '../styles/contacto.css'

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

function ContactoPage() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')

  const [errores, setErrores] = useState({
    nombre: false,
    email: false,
    asunto: false,
    mensaje: false,
  })

  const [estado, setEstado] = useState({ tipo: '', texto: '' })
  const [cargando, setCargando] = useState(false)

  const alEscribir = (setValor, campo) => (e) => {
    setValor(e.target.value)
    setErrores((previos) => ({ ...previos, [campo]: false }))
  }

  const manejarEnvio = async (e) => {
    e.preventDefault()
    setEstado({ tipo: '', texto: '' })

    // Validación de campos según los requisitos del Backend
    const nuevosErrores = {
      nombre: nombre.trim() === '' || nombre.length > 100,
      email: !validarEmail(email.trim()) || email.length > 150,
      asunto: !['duda', 'sugerencia', 'otro'].includes(asunto),
      mensaje: mensaje.trim().length < 10 || mensaje.length > 2000,
    }

    setErrores(nuevosErrores)

    if (Object.values(nuevosErrores).some(Boolean)) {
      setEstado({
        tipo: 'error',
        texto: 'Por favor completa todos los campos requeridos correctamente.',
      })
      return
    }

    setCargando(true)

    try {
      const respuesta = await enviarContacto({
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        asunto,
        mensaje: mensaje.trim(),
      })

      setEstado({
        tipo: 'exito',
        texto: respuesta.mensaje
          ? `${respuesta.mensaje}. ¡Te responderemos pronto! 🤍`
          : '¡Mensaje enviado con éxito! Te responderemos lo antes posible 🤍',
      })

      // Limpiar formulario tras envío exitoso
      setNombre('')
      setEmail('')
      setAsunto('')
      setMensaje('')
      setErrores({ nombre: false, email: false, asunto: false, mensaje: false })
    } catch (error) {
      setEstado({
        tipo: 'error',
        texto: error.message || 'No fue posible enviar el mensaje. Intenta nuevamente.',
      })
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="CuerpoLogin">
      <div className="PaginaContacto">
        {/* Botón de volver en la esquina superior derecha */}
        <Link to="/" className="LoginVolver" aria-label="Volver al inicio">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 12H5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M11 6L5 12L11 18"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Volver</span>
        </Link>

        {/* Tarjeta Glassmorphism de Contacto */}
        <div className="ContactoCard">
          {/* ===== COLUMNA IZQUIERDA: INFORMACIÓN Y CONFIANZA ===== */}
          <div className="ContactoColumnaInfo">
            <div>
              <span className="ContactoEyebrow">CONTÁCTANOS</span>
              <h1 className="ContactoTitulo">
                Estamos aquí<br />para ayudarte.
              </h1>
              <p className="ContactoDescripcion">
                Si tienes dudas, sugerencias o simplemente quieres saber más
                sobre Softstop, completa el formulario y te responderemos lo
                antes posible.
              </p>
            </div>

            {/* Badges de Confianza */}
            <div className="ContactoBeneficios">
              <div className="ContactoBeneficioItem">
                <span className="ContactoBeneficioIcono" role="img" aria-label="Mensaje">
                  💬
                </span>
                <div className="ContactoBeneficioTexto">
                  <h4>Respuesta rápida</h4>
                  <p>Te contestamos en menos de 24 h.</p>
                </div>
              </div>

              <div className="ContactoBeneficioItem">
                <span className="ContactoBeneficioIcono" role="img" aria-label="Seguridad">
                  🔒
                </span>
                <div className="ContactoBeneficioTexto">
                  <h4>Información segura</h4>
                  <p>Tus datos están protegidos y son confidenciales.</p>
                </div>
              </div>
            </div>

            {/* Enlaces de Contacto Directo */}
            <div className="ContactoDirecto">
              <p className="ContactoDirectoTitulo">O también puedes escribirnos a:</p>
              <div className="ContactoDirectoLinks">
                <a href="mailto:hola@softstop.com" className="ContactoDirectoChip">
                  <span>✉️</span>
                  <span>hola@softstop.com</span>
                </a>
                <a href="tel:+573001234567" className="ContactoDirectoChip">
                  <span>📱</span>
                  <span>+57 300 123 4567</span>
                </a>
              </div>
            </div>
          </div>

          {/* ===== COLUMNA DERECHA: FORMULARIO ===== */}
          <div className="ContactoColumnaForm">
            <h2 className="ContactoFormTitulo">Envíanos un mensaje</h2>
            <p className="ContactoFormSubtitulo">
              Cuéntanos en qué podemos ayudarte hoy.
            </p>

            {/* Mensajes de feedback (error o éxito) */}
            {estado.texto && (
              <div
                className={`LoginStatusMessage${
                  estado.tipo === 'exito' ? ' exito' : ''
                }`}
                role="alert"
              >
                {estado.texto}
              </div>
            )}

            <form className="LoginForm" onSubmit={manejarEnvio} noValidate>
              {/* Nombre completo */}
              <div
                className={`LoginCampo${errores.nombre ? ' error' : ''}`}
              >
                <label htmlFor="contacto-nombre">Nombre completo *</label>
                <div className="LoginInputWrap">
                  <span className="LoginInputIcono">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M3 21C3 17.134 7.02944 14 12 14C16.9706 14 21 17.134 21 21"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <input
                    type="text"
                    id="contacto-nombre"
                    placeholder="Tu nombre"
                    autoComplete="name"
                    value={nombre}
                    onChange={alEscribir(setNombre, 'nombre')}
                  />
                </div>
                {errores.nombre && (
                  <p className="LoginError">El nombre es obligatorio (máximo 100 caracteres).</p>
                )}
              </div>

              {/* Correo electrónico */}
              <div
                className={`LoginCampo${errores.email ? ' error' : ''}`}
              >
                <label htmlFor="contacto-email">Correo electrónico *</label>
                <div className="LoginInputWrap">
                  <span className="LoginInputIcono">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 6.5L10.89 12.1C11.5624 12.5773 12.4376 12.5773 13.11 12.1L21 6.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </span>
                  <input
                    type="email"
                    id="contacto-email"
                    placeholder="tu@ejemplo.com"
                    autoComplete="email"
                    value={email}
                    onChange={alEscribir(setEmail, 'email')}
                  />
                </div>
                {errores.email && (
                  <p className="LoginError">Por favor ingresa un correo electrónico válido.</p>
                )}
              </div>

              {/* Asunto */}
              <div
                className={`LoginCampo${errores.asunto ? ' error' : ''}`}
              >
                <label htmlFor="contacto-asunto">Asunto *</label>
                <div className="LoginInputWrap">
                  <span className="LoginInputIcono">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 6H20M4 12H20M4 18H12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <select
                    id="contacto-asunto"
                    value={asunto}
                    onChange={alEscribir(setAsunto, 'asunto')}
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    <option value="duda">Duda o soporte técnico</option>
                    <option value="sugerencia">Sugerencia para la app</option>
                    <option value="otro">Otro motivo</option>
                  </select>
                  <span className="SelectFlecha">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </div>
                {errores.asunto && (
                  <p className="LoginError">Selecciona un asunto válido.</p>
                )}
              </div>

              {/* Mensaje */}
              <div
                className={`LoginCampo${errores.mensaje ? ' error' : ''}`}
              >
                <label htmlFor="contacto-mensaje">Mensaje *</label>
                <div className="LoginTextareaWrap">
                  <span className="LoginInputIcono" style={{ marginTop: '2px' }}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.5 20 9.09 19.67 7.84 19.08L3 20L4.2 16.2C3.44 14.95 3 13.52 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <textarea
                    id="contacto-mensaje"
                    placeholder="Escribe tu mensaje aquí (mínimo 10 caracteres)..."
                    rows={4}
                    value={mensaje}
                    onChange={alEscribir(setMensaje, 'mensaje')}
                  />
                </div>
                {errores.mensaje && (
                  <p className="LoginError">El mensaje debe tener entre 10 y 2000 caracteres.</p>
                )}
              </div>

              {/* Botón de Enviar */}
              <div style={{ textAlign: 'center', width: '100%', marginTop: '8px' }}>
                <button
                  type="submit"
                  className="LoginBotonSubmit"
                  disabled={cargando}
                >
                  <span>{cargando ? 'Enviando mensaje...' : 'Enviar mensaje →'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactoPage
