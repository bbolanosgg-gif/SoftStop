import { useState, Fragment } from 'react';
import Boton from '../Boton/Boton';

// Tabla con los mensajes recibidos desde el formulario de Contacto.
// Muestra nombre, correo, tipo y fecha. Al presionar la flecha de una fila
// se despliega el mensaje completo, y desde ahí se puede marcar como
// leído/no leído o eliminar.
//
// Igual que TablaUsuarios, este componente NO habla con el backend:
// solo dibuja y avisa a AdminPage lo que la persona hizo.
//
// Props:
//   mensajes         -> lista de mensajes (viene de MongoDB vía AdminPage)
//   onAlternarLeido  -> función que se ejecuta al marcar leído / no leído
//   onEliminar       -> función que se ejecuta al eliminar un mensaje
export default function TablaMensajes({ mensajes, onAlternarLeido, onEliminar }) {
  // Guarda el ID del mensaje que está desplegado (o null si no hay ninguno).
  // Es un estado propio de este componente porque solo le importa a él:
  // AdminPage no necesita saber qué fila está abierta.
  const [idAbierto, setIdAbierto] = useState(null);

  // Si la fila ya estaba abierta la cierra; si no, abre la que se presionó
  function alternarFila(id) {
    setIdAbierto(idAbierto === id ? null : id);
  }

  // Convierte "2026-11-03T15:20:00.000Z" en "3/11/2026"
  function formatearFecha(fechaTexto) {
    return new Date(fechaTexto).toLocaleDateString('es-CO');
  }

  // El modelo guarda el tipo en minúscula ("duda"); lo mostramos con mayúscula inicial
  function ponerMayuscula(texto) {
    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  // Si no hay mensajes, mostramos un texto en vez de una tabla vacía
  if (mensajes.length === 0) {
    return (
      <p className="AdminVacio">
        Aún no se han recibido mensajes desde el formulario público.
      </p>
    );
  }

  return (
    <table className="AdminTabla">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Tipo</th>
          <th>Fecha</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        {mensajes.map((mensaje) => {
          const estaAbierto = idAbierto === mensaje._id;

          return (
            // Cada mensaje genera DOS filas: la normal y la del texto desplegado.
            // Fragment agrupa las dos filas, y la "key" va en el Fragment.
            <Fragment key={mensaje._id}>
              <tr>
                {/* Si el mensaje no se ha leído, el nombre se ve en negrita con un punto */}
                <td>
                  {!mensaje.leido && '● '}
                  {mensaje.leido ? mensaje.nombre : <strong>{mensaje.nombre}</strong>}
                </td>
                <td>{mensaje.email}</td>
                <td>
                  <span className="AdminBadge">{ponerMayuscula(mensaje.asunto)}</span>
                </td>
                <td>{formatearFecha(mensaje.createdAt)}</td>
                <td>
                  <Boton
                    variante="contorno"
                    tamano="sm"
                    onClick={() => alternarFila(mensaje._id)}
                  >
                    {estaAbierto ? '▲' : '▼'}
                  </Boton>
                </td>
              </tr>

              {/* Segunda fila: solo se dibuja si este mensaje está abierto.
                  colSpan={5} hace que la celda ocupe el ancho de las 5 columnas. */}
              {estaAbierto && (
                <tr>
                  <td colSpan={5}>
                    <p className="AdminMensajeTexto">{mensaje.mensaje}</p>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                      <Boton
                        variante="contorno"
                        tamano="sm"
                        onClick={() => onAlternarLeido(mensaje)}
                      >
                        {mensaje.leido ? 'Marcar como no leído' : 'Marcar como leído'}
                      </Boton>

                      <Boton
                        variante="peligro"
                        tamano="sm"
                        icono="🗑️"
                        onClick={() => onEliminar(mensaje._id)}
                      >
                        Eliminar
                      </Boton>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}