import { Link, useNavigate } from "react-router-dom";
import { logout, usuarioActual } from "../service/AuthService";

export default function HomePage() {
  const navigate = useNavigate();
  const usuario = usuarioActual();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h1>Veterinaria</h1>
      <p>Bienvenido{usuario.username ? `, ${usuario.username}` : ""}</p>

      <nav>
        <Link to="/consultas">Consultas</Link>{" | "}
        <Link to="/mascotas">Mascotas</Link>{" | "}
        <Link to="/apoderados">Apoderados</Link>{" | "}
        <Link to="/veterinarios">Veterinarios</Link>
      </nav>

      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
}