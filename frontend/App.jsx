import { useState } from "react";
import MascotasPage from "./pages/MascotaPage";
import ApoderadosPage from "./pages/ApoderadoPage";
import VeterinariosPage from "./pages/VeterinariosPage";
import ConsultaPage from "./pages/ConsultaPage";
import AuthPage from "./pages/AuthPage";
import { getSession, logout } from "./service/AuthService";
import "./css/style.css";

export default function App() {
  const [usuario, setUsuario] = useState(getSession);
  const [seccion, setSeccion] = useState("Mascotas");

  function cerrarSesion() {
    logout();
    setUsuario(null);
    setSeccion("Mascotas");
  }

  if (!usuario) return <AuthPage onLogin={setUsuario} />;

  return (
    <main className="container">
      <header className="encabezado">
        <div>
          <h1>Veterinaria Patitas</h1>
          <p>Bienvenido, {usuario.username}</p>
        </div>
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </header>
      <p>Consulta los datos registrados en el backend.</p>
      <nav aria-label="Secciones">
        {["Mascotas", "Apoderados", "Veterinarios", "Consultas"].map((nombre) => (
          <button key={nombre} onClick={() => setSeccion(nombre)} aria-pressed={seccion === nombre}>
            {nombre}
          </button>
        ))}
      </nav>
      {seccion === "Mascotas" && <MascotasPage />}
      {seccion === "Apoderados" && <ApoderadosPage />}
      {seccion === "Veterinarios" && <VeterinariosPage />}
      {seccion === "Consultas" && <ConsultaPage />}
    </main>
  );
}
