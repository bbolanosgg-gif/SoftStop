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

  // Se ejecuta una sola vez, al abrir el panel
  useEffect(() => {
    cargarMensajes();
    cargarUsuarios();
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
          Administra el catálogo, revisa mensajes y gestiona los usuarios.
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
