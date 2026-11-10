import Boton from './Boton/Boton';

// Barra superior exclusiva del panel admin: solo lo que la administradora necesita.
export default function BarraAdmin({ nombre, alVerSitio, alSalir }) {
  return (
    <header className="AdminBarra">
      <span className="AdminMarca">SoftStop</span>

      <div className="AdminBarraAcciones">
        <Boton variante="secundario" tamano="sm" onClick={alVerSitio}>
          Ver sitio
        </Boton>
        <Boton variante="primario" tamano="sm" onClick={alSalir}>
          Cerrar sesión
        </Boton>
      </div>
    </header>
  );
}
