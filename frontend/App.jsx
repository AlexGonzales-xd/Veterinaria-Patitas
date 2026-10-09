import { useState } from "react";
import MascotasPage from "./pages/MascotaPage";
import ApoderadosPage from "./pages/ApoderadoPage";
import VeterinariosPage from "./pages/VeterinariosPage";
import ConsultaPage from "./pages/ConsultaPage";
import AuthPage from "./pages/AuthPage";
import { getSession, logout, getRol } from "./service/AuthService";
import "./css/style.css";

// Secciones visibles según el rol
const SECCIONES_POR_ROL = {
  admin: ["Mascotas", "Apoderados", "Veterinarios", "Consultas"],
  veterinario: ["Mascotas", "Consultas"],
  apoderado: ["Mascotas", "Consultas", "Veterinarios"],
};

export default function App() {
  const [usuario, setUsuario] = useState(getSession);
  const [seccion, setSeccion] = useState("Mascotas");

  function cerrarSesion() {
    logout();
    setUsuario(null);
    setSeccion("Mascotas");
  }

  function iniciarSesion(u) {
    setUsuario(u);
    setSeccion("Mascotas");
  }

  if (!usuario) return <AuthPage onLogin={iniciarSesion} />;

  const rol = getRol(usuario);
  const secciones = SECCIONES_POR_ROL[rol];
  const puedeEditar = rol === "admin"; // solo el admin crea, edita y elimina
  const seccionActual = secciones.includes(seccion) ? seccion : secciones[0];

  const inicial = (usuario.username || "?").charAt(0).toUpperCase();

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="mark">🐾</div>
          <span className="wordmark">Patitas</span>
        </div>

        <nav className="sidebar-nav" aria-label="Secciones">
          {secciones.map((nombre) => (
            <button
              key={nombre}
              onClick={() => setSeccion(nombre)}
              aria-pressed={seccionActual === nombre}
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
          {seccionActual === "Mascotas" && <MascotasPage usuario={usuario} rol={rol} puedeEditar={puedeEditar} />}
          {seccionActual === "Apoderados" && rol === "admin" && <ApoderadosPage />}
          {seccionActual === "Veterinarios" && <VeterinariosPage puedeEditar={puedeEditar} />}
          {seccionActual === "Consultas" && <ConsultaPage usuario={usuario} rol={rol} puedeEditar={puedeEditar} />}
        </div>
      </div>
    </div>
  );
}
