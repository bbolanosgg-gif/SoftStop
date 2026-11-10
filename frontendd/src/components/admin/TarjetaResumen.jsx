
/*
 * TARJETA DE RESUMEN
 *
 * Componente reutilizable que muestra:
 * - Una imagen ilustrativa.
 * - Una etiqueta descriptiva.
 * - Un número que representa una estadística.
 *
 * Recibe estos datos mediante props.
 */

export default function TarjetaResumen({
  imagen,
  numero,
  etiqueta
}) {
  return (
    <div className="AdminResumen">

      {/* Imagen ubicada a la izquierda */}
      <img
        src={imagen}
        alt=""
        className="AdminResumenImagen"
      />

      {/* Información ubicada a la derecha */}
      <div className="AdminResumenContenido">

        {/* Primero mostramos la descripción */}
        <p className="AdminResumenEtiqueta">
          {etiqueta}
        </p>

        {/* Después mostramos el número */}
        <p className="AdminResumenNumero">
          {numero}
        </p>

      </div>

    </div>
  );
}
