// Tarjeta pequeña con un número grande y una etiqueta.
// Ejemplo del diseño: "12 Usuarios registrados".
//
// Es un componente REUTILIZABLE: se escribe una sola vez y se usa tres veces
// (usuarios, herramientas, mensajes), cambiando solo los datos que recibe.
//
// Props:
//   icono    -> emoji que se muestra en el círculo (ej: '👥')
//   numero   -> el número grande (ej: 12)
//   etiqueta -> el texto pequeño de abajo (ej: 'Usuarios registrados')
export default function TarjetaResumen({ icono, numero, etiqueta }) {
  return (
    <div className="AdminResumen">
      <span className="AdminResumenIcono">{icono}</span>

      <div>
        <p className="AdminResumenNumero">{numero}</p>
        <p className="AdminResumenEtiqueta">{etiqueta}</p>
      </div>
    </div>
  );
}