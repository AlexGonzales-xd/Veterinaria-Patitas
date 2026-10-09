import { useEffect, useState } from "react";
import MascotasPage from "./pages/MascotaPage";
import ApoderadosPage from "./pages/ApoderadoPage";
import VeterinariosPage from "./pages/VeterinariosPage";
import ConsultaPage from "./pages/ConsultaPage";
import AuthPage from "./pages/AuthPage";
import { getSession, logout, getRol } from "./service/AuthService";
import "./css/style.css";
import "./css/ui.css";
import "./css/responsive.css";

// Secciones visibles según el rol
const SECCIONES_POR_ROL = {
  admin: ["Mascotas", "Apoderados", "Veterinarios", "Consultas"],
  veterinario: ["Mascotas", "Consultas"],
  apoderado: ["Mascotas", "Consultas", "Veterinarios"],
};

export default function App() {
  const [usuario, setUsuario] = useState(getSession);
  const [seccion, setSeccion] = useState("Mascotas");
  const [menuAbierto, setMenuAbierto] = useState(false); // menú lateral en móvil

  // Con el menú abierto: bloquea el scroll de fondo, Escape lo cierra
  // y se cierra solo si la pantalla vuelve a ser ancha.
  useEffect(() => {
    if (!menuAbierto) return;
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const alTeclear = (e) => { if (e.key === "Escape") setMenuAbierto(false); };
    const alRedimensionar = () => { if (window.innerWidth > 900) setMenuAbierto(false); };
    window.addEventListener("keydown", alTeclear);
    window.addEventListener("resize", alRedimensionar);

    return () => {
      document.body.style.overflow = overflowPrevio;
      window.removeEventListener("keydown", alTeclear);
      window.removeEventListener("resize", alRedimensionar);
    };
  }, [menuAbierto]);

  function cerrarSesion() {
    logout();
    setUsuario(null);
    setSeccion("Mascotas");
    setMenuAbierto(false);
  }

  function iniciarSesion(u) {
    setUsuario(u);
    setSeccion("Mascotas");
  }

  function irA(nombre) {
    setSeccion(nombre);
    setMenuAbierto(false);
  }

  if (!usuario) return <AuthPage onLogin={iniciarSesion} />;

  const rol = getRol(usuario);
  const secciones = SECCIONES_POR_ROL[rol];
  const esAdmin = rol === "admin";
  const esPersonal = rol === "admin" || rol === "veterinario"; // gestionan consultas
  const seccionActual = secciones.includes(seccion) ? seccion : secciones[0];

  const inicial = (usuario.username || "?").charAt(0).toUpperCase();

  return (
    <div className="app-shell">
      <div
        className={`sidebar-overlay${menuAbierto ? " visible" : ""}`}
        onClick={() => setMenuAbierto(false)}
        aria-hidden="true"
      />

      <aside className={`sidebar${menuAbierto ? " abierto" : ""}`} id="menu-lateral">
        <div className="sidebar-logo">
          <div className="mark">🐾</div>
          <span className="wordmark">Patitas</span>
        </div>

        <nav className="sidebar-nav" aria-label="Secciones">
          {secciones.map((nombre) => (
            <button
              key={nombre}
              onClick={() => irA(nombre)}
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
          <button
            className="menu-toggle"
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú"
            aria-controls="menu-lateral"
            aria-expanded={menuAbierto}
          >
            ☰
          </button>

          <div className="user-pill">
            <div className="avatar">{inicial}</div>
            <div className="datos">
              <strong>{usuario.username}</strong>
              <span>{usuario.rol || "Usuario"}</span>
            </div>
          </div>
        </div>

        <div className="content-body">
          {seccionActual === "Mascotas" && <MascotasPage usuario={usuario} rol={rol} />}
          {seccionActual === "Apoderados" && esAdmin && <ApoderadosPage />}
          {seccionActual === "Veterinarios" && <VeterinariosPage puedeEditar={esAdmin} />}
          {seccionActual === "Consultas" && <ConsultaPage usuario={usuario} rol={rol} puedeEditar={esPersonal} />}
        </div>
      </div>
    </div>
  );
}
