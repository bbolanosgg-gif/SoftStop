import Boton from '../Boton/Boton';

// Tabla con los usuarios registrados en SoftStop.
// Muestra nombre, correo, estado y fecha de registro, y un botón
// para activar o desactivar cada cuenta.
//
// Este componente NO habla con el backend. Solo dibuja lo que recibe.
// Quien hace el fetch es AdminPage, que le pasa la lista y la función.
//
// Props:
//   usuarios         -> lista de usuarios (viene de MongoDB vía AdminPage)
//   onCambiarEstado  -> función que se ejecuta al presionar el botón de estado
export default function TablaUsuarios({ usuarios, onCambiarEstado }) {
  // Convierte la fecha de MongoDB (ej: "2026-11-03T15:20:00.000Z")
  // en un formato legible para Colombia (ej: "3/11/2026")
  function formatearFecha(fechaTexto) {
    return new Date(fechaTexto).toLocaleDateString('es-CO');
  }

  // Si no hay usuarios, mostramos un mensaje en vez de una tabla vacía
  if (usuarios.length === 0) {
    return <p className="AdminVacio">Aún no hay usuarios registrados.</p>;
  }

  return (
    <table className="AdminTabla">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Estado</th>
          <th>Registro</th>
          <th>Acción</th>
        </tr>
      </thead>

      <tbody>
        {/* map() crea una fila <tr> por cada usuario de la lista */}
        {usuarios.map((usuario) => {
          // Un usuario está activo salvo que su estado sea "inactivo".
          // Así los usuarios antiguos, sin el campo "estado", cuentan como activos.
          const estaActivo = usuario.estado !== 'inactivo';

          return (
            // "key" ayuda a React a identificar cada fila. Usamos el _id de MongoDB.
            <tr key={usuario._id}>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>
                <span className={estaActivo ? 'AdminBadge AdminBadgeActivo' : 'AdminBadge AdminBadgeInactivo'}>
                  {estaActivo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>{formatearFecha(usuario.createdAt)}</td>
              <td>
                <Boton
                  variante="contorno"
                  tamano="sm"
                  onClick={() => onCambiarEstado(usuario)}
                >
                  {estaActivo ? 'Desactivar' : 'Activar'}
                </Boton>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}