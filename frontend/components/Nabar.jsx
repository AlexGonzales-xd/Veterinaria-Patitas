import { Link } from "react-router-dom";

export default function Nabar() {
  return (
    <nav className="navbar">
      <Link to="/">Inicio</Link>
      <Link to="/consultas">Consultas</Link>
      <Link to="/mascotas">Mascotas</Link>
      <Link to="/apoderados">Apoderados</Link>
      <Link to="/veterinarios">Veterinarios</Link>
    </nav>
  );
}