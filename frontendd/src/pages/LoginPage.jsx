import { useState } from 'react';

// Página de Login para acceder al Panel de Administración
export default function LoginPage({ apiUrl, alIniciarSesion }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorLogin, setErrorLogin] = useState('');

  async function manejarLogin(event) {
    event.preventDefault();
    setErrorLogin('');

    if (!email.trim() || !password.trim()) {
      setErrorLogin('Debes ingresar tu correo y contraseña.');
      return;
    }

    try {
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
    <section className="contenedor" style={{ maxWidth: '480px' }}>
      <div className="tarjeta-glass">
        <span className="eyebrow">Gestión Interna</span>
        <h1 className="titulo-seccion" style={{ fontSize: '30px' }}>Acceso Administrador</h1>
        <p style={{ fontSize: '13px', color: 'var(--color-suave)', marginBottom: '12px' }}>
          Ingresa tus credenciales para gestionar el catálogo de SoftStop y revisar los mensajes de contacto.
        </p>

        <form className="formulario" onSubmit={manejarLogin}>
          <div className="campo-form">
            <label>Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@softstop.com"
            />
          </div>

          <div className="campo-form">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
            />
          </div>

          {errorLogin && <p className="alerta-error">{errorLogin}</p>}

          <button type="submit" className="btn-morado">
            Iniciar sesión
          </button>
        </form>
      </div>
    </section>
  );
}