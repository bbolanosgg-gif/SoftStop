function Header() {
    const nombreEmprendimiento = "SoftStop";
    const descripcion = "Tu solucion para la procastinacion";


    return (
        <header>
            <h1>{nombreEmprendimiento}</h1>
            <p>{descripcion}</p>
        </header>
    )
} 

export default Header;