import { useState } from "react";
import MascotasPage from "./pages/MascotaPage";
import ApoderadosPage from "./pages/ApoderadoPage";
import VeterinariosPage from "./pages/VeterinariosPage";
import ConsultaPage from "./pages/ConsultaPage";
import AuthPage from "./pages/AuthPage";
import { getSession, logout } from "./service/AuthService";
import "./css/style.css";

const SECCIONES = ["Mascotas", "Apoderados", "Veterinarios", "Consultas"];

export default function App() {
  const [usuario, setUsuario] = useState(getSession);
  const [seccion, setSeccion] = useState("Mascotas");

  function cerrarSesion() {
    logout();
    setUsuario(null);
    setSeccion("Mascotas");
  }

  if (!usuario) return <AuthPage onLogin={setUsuario} />;

  const inicial = (usuario.username || "?").charAt(0).toUpperCase();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="mark">🐾</div>
          <span className="wordmark">Patitas</span>
        </div>

        <nav className="sidebar-nav" aria-label="Secciones">
          {SECCIONES.map((nombre) => (
            <button
              key={nombre}
              onClick={() => setSeccion(nombre)}
              aria-pressed={seccion === nombre}
            >
              {nombre}
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />

        <button className="sidebar-logout" onClick={cerrarSesion}>Cerrar sesión</button>
      </aside>

      <div className="content-area">
        <div className="content-topbar">
          <div className="user-pill">
            <div className="avatar">{inicial}</div>
            <div className="datos">
              <strong>{usuario.username}</strong>
              <span>{usuario.rol || "Usuario"}</span>
            </div>
          </div>
        </div>

        <div className="content-body">
          {seccion === "Mascotas" && <MascotasPage />}
          {seccion === "Apoderados" && <ApoderadosPage />}
          {seccion === "Veterinarios" && <VeterinariosPage />}
          {seccion === "Consultas" && <ConsultaPage />}
        </div>
      </div>
    </div>
  );
}
