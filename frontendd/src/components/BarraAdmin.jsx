// Barra superior exclusiva del panel admin: solo lo que la administradora necesita.
export default function BarraAdmin({ nombre, alVerSitio, alSalir }) {
  return (
    <header className="AdminBarra">
      <span className="AdminMarca">SOFTSTOP</span>

      <div className="AdminBarraAcciones">
        <button type="button" className="AdminBoton" onClick={alVerSitio}>
          Ver sitio
        </button>
        <button type="button" className="AdminBoton AdminBotonPrimario" onClick={alSalir}>
          Salir
        </button>
      </div>
    </header>
  );
}