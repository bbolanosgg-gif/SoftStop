import { useState, useEffect } from 'react';

// Componentes reutilizables del panel (carpeta components/admin)
import TarjetaResumen from '../components/admin/TarjetaResumen';
import TablaUsuarios from '../components/admin/TablaUsuarios';
import TablaMensajes from '../components/admin/TablaMensajes';
import HerramientaCard from '../components/HerramientaCard';
import Boton from '../components/Boton/Boton';

import iconoUsuarios from '../assets/img/iconoUsuarios.png';
import iconoHerramientas from '../assets/img/iconoHerramientas.png';
import iconoMensajes from '../assets/img/iconoMensajes.png';

import '../styles/admin.css'; // estilos propios del panel

// Panel de Administración de SoftStop.
// Esta página es el "director": pide los datos al backend, guarda las
// funciones que modifican la información y se las pasa a los componentes
// hijos, que solo se encargan de dibujar.
export default function AdminPage({ apiUrl, token, herramientas, recargarHerramientas }) {
  // =====================================================
  // 1. ESTADOS (la "memoria" del componente)
  // =====================================================

  // Listas que vienen de MongoDB
  // (las herramientas llegan por props desde App.jsx)
  const [mensajes, setMensajes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  // Configuración del Check-in con Gemini guardada en MongoDB.
  // null indica que todavía no se ha recibido la información del backend.
  const [configuracionIA, setConfiguracionIA] = useState(null);
  const [iaActiva, setIaActiva] = useState(false);
  const [limiteIA, setLimiteIA] = useState(10);
  const [cargandoIA, setCargandoIA] = useState(true);
  const [guardandoIA, setGuardandoIA] = useState(false);
  const [avisoIA, setAvisoIA] = useState('');

  // Campos del formulario de herramientas
  const [nombre, setNombre] = useState('');
  const [lema, setLema] = useState(''); // NUEVO: frase corta bajo el título de la carta
  const [descripcion, setDescripcion] = useState('');
  const [beneficio, setBeneficio] = useState('');
  const [icono, setIcono] = useState('🌸');
  const [estadoDisponibilidad, setEstadoDisponibilidad] = useState('Disponible en catálogo');

  // Aviso para la persona que administra (éxito o error)
  const [aviso, setAviso] = useState('');

  // ID de la herramienta que se está editando:
  //   null  -> el formulario está en modo CREAR
  //   un ID -> el formulario está en modo EDITAR esa herramienta
  const [idEditando, setIdEditando] = useState(null);

  // Cabeceras para peticiones del administrador.
  // Authorization lleva el JWT que Express comprueba con verificarToken.
  // JSON solo se declara cuando enviamos datos en el cuerpo de la petición.
  function encabezadosAdmin(conJson = false) {
    return {
      Authorization: `Bearer ${token}`,
      ...(conJson ? { 'Content-Type': 'application/json' } : {})
    };
  }

  // =====================================================
  // 2. READ: cargar datos desde el backend
  // =====================================================

  // Trae los mensajes de contacto desde MongoDB
  async function cargarMensajes() {
    try {
      const respuesta = await fetch(`${apiUrl}/api/contacto`, {
        headers: encabezadosAdmin()
      });
      const datos = await respuesta.json();
      if (respuesta.ok) {
        setMensajes(datos);
      } else {
        console.warn('No se pudieron cargar los mensajes:', datos.error);
      }
    } catch (error) {
      console.log('Error cargando mensajes:', error);
    }
  }

  // Trae los usuarios (clientes) desde MongoDB
  async function cargarUsuarios() {
    try {
      const respuesta = await fetch(`${apiUrl}/api/usuarios`, {
        headers: encabezadosAdmin()
      });
      const datos = await respuesta.json();
      if (respuesta.ok) {
        setUsuarios(datos);
      } else {
        console.warn('No se pudieron cargar los usuarios:', datos.error);
      }
    } catch (error) {
      console.log('Error cargando usuarios:', error);
    }
  }

  // =====================================================
  // 3. CONFIGURACIÓN DE GEMINI (rutas protegidas con JWT)
  // =====================================================

  // GET: recupera la configuración real almacenada en MongoDB.
  async function cargarConfiguracionIA() {
    setCargandoIA(true);
    try {
      const respuesta = await fetch(`${apiUrl}/api/ia/configuracion`, {
        headers: encabezadosAdmin()
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo cargar la configuración.');
      }

      // Guardamos el documento y rellenamos el formulario con sus valores.
      setConfiguracionIA(datos);
      setIaActiva(datos.activo);
      setLimiteIA(datos.limiteConsultas);
      setAvisoIA('');
    } catch (error) {
      setAvisoIA(error.message);
    } finally {
      setCargandoIA(false);
    }
  }

  // PUT: guarda el interruptor y el límite en MongoDB.
  // Cambiar el checkbox por sí solo NO cambia la configuración real.
  async function guardarConfiguracionIA(event) {
    event.preventDefault();
    setAvisoIA('');
    setGuardandoIA(true);

    try {
      const respuesta = await fetch(`${apiUrl}/api/ia/configuracion`, {
        method: 'PUT',
        headers: encabezadosAdmin(true),
        body: JSON.stringify({
          activo: iaActiva,
          limiteConsultas: Number(limiteIA)
        })
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo guardar la configuración.');
      }

      setConfiguracionIA(datos);
      setIaActiva(datos.activo);
      setLimiteIA(datos.limiteConsultas);
      setAvisoIA('¡Configuración de Gemini guardada!');
    } catch (error) {
      setAvisoIA(error.message);
    } finally {
      setGuardandoIA(false);
    }
  }

  // PUT: pone el contador en cero, sin modificar el límite ni el interruptor.
  async function reiniciarContadorIA() {
    const seguro = window.confirm('¿Reiniciar las consultas utilizadas por Gemini?');
    if (!seguro) return;

    setGuardandoIA(true);
    setAvisoIA('');
    try {
      const respuesta = await fetch(`${apiUrl}/api/ia/configuracion/reiniciar`, {
        method: 'PUT',
        headers: encabezadosAdmin(true)
      });
      const datos = await respuesta.json();
      if (!respuesta.ok) {
        throw new Error(datos.error || 'No se pudo reiniciar el contador.');
      }

      // El backend responde { mensaje, configuracion }.
      setConfiguracionIA(datos.configuracion);
      setIaActiva(datos.configuracion.activo);
      setLimiteIA(datos.configuracion.limiteConsultas);
      setAvisoIA(datos.mensaje);
    } catch (error) {
      setAvisoIA(error.message);
    } finally {
      setGuardandoIA(false);
    }
  }

  // Al abrir el panel, cargamos los tres conjuntos de datos.
  useEffect(() => {
    cargarMensajes();
    cargarUsuarios();
    cargarConfiguracionIA();
  }, []);

  // =====================================================
  // 3. HERRAMIENTAS: crear, editar, ocultar y eliminar
  // =====================================================

  // Deja el formulario vacío y en modo CREAR
  function limpiarFormulario() {
    setNombre('');
    setLema(''); // NUEVO
    setDescripcion('');
    setBeneficio('');
    setIcono('🌸');
    setEstadoDisponibilidad('Disponible en catálogo');
    setIdEditando(null);
  }

  // CREATE y UPDATE: el mismo formulario hace las dos cosas
  async function guardarHerramienta(event) {
    event.preventDefault();
    setAviso('');

    // El lema NO es obligatorio, por eso no se valida aquí
    if (!nombre.trim() || !descripcion.trim() || !beneficio.trim()) {
      setAviso('Completa nombre, descripción y beneficio de la herramienta.');
      return;
    }

    // Si hay un ID guardado estamos editando; si no, creando
    const estaEditando = idEditando !== null;

    const url = estaEditando
      ? `${apiUrl}/api/herramientas/${idEditando}` // PUT /api/herramientas/:id
      : `${apiUrl}/api/herramientas`;              // POST /api/herramientas
    const metodo = estaEditando ? 'PUT' : 'POST';

    try {
      const respuesta = await fetch(url, {
        method: metodo,
        headers: encabezadosAdmin(true),
        body: JSON.stringify({
          nombre,
          lema, // NUEVO: ahora también se envía el lema
          descripcion,
          beneficio,
          icono,
          estadoDisponibilidad
        })
      });

      if (respuesta.ok) {
        setAviso(estaEditando ? '¡Herramienta actualizada!' : '¡Herramienta agregada al catálogo!');
        limpiarFormulario();
        recargarHerramientas(); // vuelve a pedir el catálogo a MongoDB
      } else {
        // Si el backend rechazó los datos, mostramos su explicación
        const datosError = await respuesta.json();
        setAviso(datosError.detalle ? datosError.detalle.join(' ') : datosError.error);
      }
    } catch (error) {
      setAviso('Error al guardar la herramienta.');
    }
  }

  // Pasa una herramienta al formulario para editarla (botón "Editar" de la tarjeta)
  function empezarEdicion(herramienta) {
    setNombre(herramienta.nombre);
    setLema(herramienta.lema || ''); // NUEVO: las herramientas viejas pueden no tener lema
    setDescripcion(herramienta.descripcion);
    setBeneficio(herramienta.beneficio);
    setIcono(herramienta.icono || '🌸');
    setEstadoDisponibilidad(herramienta.estadoDisponibilidad);
    setIdEditando(herramienta._id); // activa el modo EDITAR
    setAviso('');
    window.scrollTo({ top: 0, behavior: 'smooth' }); // sube hasta el formulario
  }

  // UPDATE: mostrar u ocultar una herramienta (solo cambia el campo "activa")
  async function alternarVisible(herramienta) {
    const estaVisible = herramienta.activa !== false;

    try {
      const respuesta = await fetch(`${apiUrl}/api/herramientas/${herramienta._id}`, {
        method: 'PUT',
        headers: encabezadosAdmin(true),
        body: JSON.stringify({ activa: !estaVisible }) // invierte el valor actual
      });

      if (respuesta.ok) {
        recargarHerramientas();
      }
    } catch (error) {
      console.log('Error al cambiar visibilidad:', error);
    }
  }

  // DELETE: eliminar una herramienta por su ID
  async function eliminarHerramienta(id) {
    // confirm() muestra un cuadro de Aceptar/Cancelar antes de borrar
    const seguro = window.confirm('¿Seguro que quieres eliminar esta herramienta?');
    if (!seguro) return;

    try {
      const respuesta = await fetch(`${apiUrl}/api/herramientas/${id}`, {
        method: 'DELETE',
        headers: encabezadosAdmin()
      });
      if (respuesta.ok) {
        // Si se estaba editando justo la herramienta borrada, limpiamos el formulario
        if (id === idEditando) {
          limpiarFormulario();
        }
        recargarHerramientas();
      }
    } catch (error) {
      console.log('Error al eliminar:', error);
    }
  }

  // =====================================================
  // 4. USUARIOS: activar o desactivar cuentas
  // =====================================================

  // UPDATE: cambia el estado del usuario (activo <-> inactivo)
  async function cambiarEstadoUsuario(usuario) {
    const estaActivo = usuario.estado !== 'inactivo';
    const nuevoEstado = estaActivo ? 'inactivo' : 'activo';

    try {
      const respuesta = await fetch(`${apiUrl}/api/usuarios/${usuario._id}/estado`, {
        method: 'PUT',
        headers: encabezadosAdmin(true),
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (respuesta.ok) {
        cargarUsuarios(); // refresca la tabla con el dato nuevo de MongoDB
      }
    } catch (error) {
      console.log('Error al cambiar el estado del usuario:', error);
    }
  }

  // =====================================================
  // 5. MENSAJES: marcar como leído y eliminar
  // =====================================================

  // UPDATE: marca un mensaje como leído o como no leído
  async function alternarLeido(mensaje) {
    try {
      const respuesta = await fetch(`${apiUrl}/api/contacto/${mensaje._id}/leido`, {
        method: 'PUT',
        headers: encabezadosAdmin(true),
        body: JSON.stringify({ leido: !mensaje.leido }) // invierte el valor actual
      });

      if (respuesta.ok) {
        cargarMensajes();
      }
    } catch (error) {
      console.log('Error al marcar el mensaje:', error);
    }
  }

  // DELETE: elimina un mensaje por su ID
  async function eliminarMensaje(id) {
    const seguro = window.confirm('¿Seguro que quieres eliminar este mensaje?');
    if (!seguro) return;

    try {
      const respuesta = await fetch(`${apiUrl}/api/contacto/${id}`, {
        method: 'DELETE',
        headers: encabezadosAdmin()
      });

      if (respuesta.ok) {
        cargarMensajes();
      }
    } catch (error) {
      console.log('Error al eliminar el mensaje:', error);
    }
  }

  // =====================================================
  // 6. DISEÑO: aquí se arma la pantalla con las piezas
  // =====================================================
  return (
    <div className="AdminPagina">
      <section className="AdminContenedor">
        <span className="AdminEyebrow">Panel Admin</span>
        <h1 className="AdminTitulo">Gestión interna de SoftStop</h1>
        <p className="AdminDescripcion">
          Administra el catálogo, revisa mensajes, gestiona usuarios y configura Gemini.
        </p>

        {/* Tres tarjetas de resumen: los números salen del largo de cada lista */}
        <div className="AdminResumenFila">
          <TarjetaResumen
            imagen={iconoUsuarios}
            numero={usuarios.length}
            etiqueta="Usuarios registrados"
          />
          <TarjetaResumen
            imagen={iconoHerramientas}
            numero={herramientas.length}
            etiqueta="Herramientas en catálogo"
          />
          <TarjetaResumen
            imagen={iconoMensajes}
            numero={mensajes.length}
            etiqueta="Mensajes recibidos"
          />
        </div>

        {/* =============================================
            ADMINISTRACIÓN DEL CHECK-IN CON GEMINI
            Reutiliza los estilos de las tarjetas del panel.
            ============================================= */}
        <h2 className="AdminSubtitulo">Check-in inteligente · Gemini</h2>
        <div className="AdminTarjeta" style={{ marginBottom: '24px' }}>
          <h2 className="AdminTarjetaTitulo">Configuración de la IA</h2>
          <p>Controla si el asistente está disponible y cuántas consultas puede realizar.</p>

          {cargandoIA ? (
            <p>Cargando configuración desde MongoDB...</p>
          ) : !configuracionIA ? (
            <div>
              <p className="AdminAviso">{avisoIA || 'No se encontró la configuración.'}</p>
              <button type="button" onClick={cargarConfiguracionIA}>
                Volver a intentar
              </button>
            </div>
          ) : (
            <form className="AdminForm" onSubmit={guardarConfiguracionIA}>
              {/* El checkbox modifica un estado de React, no la base de datos.
                  Para aplicar el cambio hay que pulsar Guardar configuración. */}
              <div className="AdminCampo">
                <label htmlFor="ia-activa">Asistente disponible</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    id="ia-activa"
                    type="checkbox"
                    checked={iaActiva}
                    disabled={guardandoIA}
                    onChange={(e) => setIaActiva(e.target.checked)}
                    style={{ width: 'auto' }}
                  />
                  <span>{iaActiva ? 'Activado (pendiente de guardar)' : 'Desactivado'}</span>
                </div>
              </div>

              <div className="AdminCampo">
                <label htmlFor="limite-ia">Límite global de consultas (1 a 30)</label>
                <input
                  id="limite-ia"
                  type="number"
                  min="1"
                  max="30"
                  step="1"
                  required
                  value={limiteIA}
                  disabled={guardandoIA}
                  onChange={(e) => setLimiteIA(e.target.value)}
                />
              </div>

              {/* El contador real viene del backend, no se calcula en React. */}
              <p>
                <strong>Consultas utilizadas:</strong>{' '}
                {configuracionIA.consultasUsadas} / {configuracionIA.limiteConsultas}
              </p>
              <progress
                value={Math.min(configuracionIA.consultasUsadas, configuracionIA.limiteConsultas)}
                max={configuracionIA.limiteConsultas}
                style={{ width: '100%', accentColor: '#723D79' }}
              />
              <p style={{ fontSize: '13px' }}>
                Estado guardado en MongoDB: {configuracionIA.activo ? 'Activo' : 'Desactivado'}.
              </p>

              {avisoIA && <p className="AdminAviso" role="status">{avisoIA}</p>}

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <button type="submit" disabled={guardandoIA}>
                  {guardandoIA ? 'Procesando...' : 'Guardar configuración'}
                </button>
                <button
                  type="button"
                  disabled={guardandoIA || configuracionIA.consultasUsadas === 0}
                  onClick={reiniciarContadorIA}
                >
                  Reiniciar contador
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="AdminGrid2">
          {/* Tarjeta 1: formulario para crear o editar herramientas */}
          <div className="AdminTarjeta">
            <h2 className="AdminTarjetaTitulo">
              {idEditando ? 'Editar herramienta' : 'Agregar herramienta al catálogo'}
            </h2>

            <form className="AdminForm" onSubmit={guardarHerramienta}>
              <div className="AdminCampo">
                <label htmlFor="nombre-herramienta">Nombre de la herramienta</label>
                <input
                  id="nombre-herramienta"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej: Think"
                />
              </div>

              {/* NUEVO: campo del lema (frase corta bajo el título de la carta) */}
              <div className="AdminCampo">
                <label htmlFor="lema-herramienta">Lema (frase corta bajo el título)</label>
                <input
                  id="lema-herramienta"
                  type="text"
                  value={lema}
                  onChange={(e) => setLema(e.target.value)}
                  placeholder="Ej: REFLEXIÓN PROFUNDA"
                  maxLength={40}
                />
              </div>

              <div className="AdminCampo">
                <label htmlFor="descripcion-herramienta">Descripción breve</label>
                <textarea
                  id="descripcion-herramienta"
                  rows="3"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Explica en qué consiste..."
                />
              </div>

              <div className="AdminCampo">
                <label htmlFor="beneficio-herramienta">Beneficio para el estudiante</label>
                <input
                  id="beneficio-herramienta"
                  type="text"
                  value={beneficio}
                  onChange={(e) => setBeneficio(e.target.value)}
                  placeholder="Ej: Ayuda a descansar la vista entre bloques"
                />
              </div>

              <div className="AdminCampo">
                <label htmlFor="icono-herramienta">Icono y Disponibilidad</label>
                <div className="AdminFilaIcono">
                  <input
                    id="icono-herramienta"
                    type="text"
                    value={icono}
                    onChange={(e) => setIcono(e.target.value)}
                  />
                  <select
                    value={estadoDisponibilidad}
                    onChange={(e) => setEstadoDisponibilidad(e.target.value)}
                  >
                    <option value="Disponible en catálogo">Disponible en catálogo</option>
                    <option value="Próximamente">Próximamente</option>
                  </select>
                </div>
              </div>

              {/* Solo se dibuja si hay un aviso */}
              {aviso && <p className="AdminAviso">{aviso}</p>}

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Boton type="submit" variante="primario">
                  {idEditando ? 'Guardar cambios' : '+ Guardar en el catálogo'}
                </Boton>

                {/* El botón Cancelar solo aparece en modo EDITAR */}
                {idEditando && (
                  <Boton variante="contorno" onClick={limpiarFormulario}>
                    Cancelar edición
                  </Boton>
                )}
              </div>
            </form>
          </div>

          {/* Tarjeta 2: mensajes de contacto */}
          <div className="AdminTarjeta">
            <h2 className="AdminTarjetaTitulo">Mensajes de contacto</h2>
            <TablaMensajes
              mensajes={mensajes}
              onAlternarLeido={alternarLeido}
              onEliminar={eliminarMensaje}
            />
          </div>
        </div>

        {/* Usuarios registrados */}
        <h2 className="AdminSubtitulo">Usuarios registrados ({usuarios.length})</h2>
        <div className="AdminTarjeta">
          <TablaUsuarios
            usuarios={usuarios}
            onCambiarEstado={cambiarEstadoUsuario}
          />
        </div>

        {/* Catálogo actual, con botones de editar, ocultar y eliminar */}
        <h2 className="AdminSubtitulo">
          Herramientas en el catálogo ({herramientas.length})
        </h2>

        <div className="AdminGrid3">
          {herramientas.map((item) => (
            <HerramientaCard
              key={item._id}
              herramienta={item}
              esAdmin={true}
              onEditar={empezarEdicion}
              onAlternarVisible={alternarVisible}
              onEliminar={eliminarHerramienta}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
