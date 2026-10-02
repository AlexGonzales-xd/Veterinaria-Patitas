import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { estaAutenticado } from "./service/AuthService";

import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ConsultaPage from "./pages/ConsultaPage";
import NuevaConsultaPage from "./pages/NuevaConsultaPage";
import EditarConsultaPage from "./pages/EditarConsultaPage";
import MascotasPage from "./pages/MascotasPage";
import ApoderadosPage from "./pages/ApoderadoPage";
import VeterinariosPage from "./pages/VeterinariosPage";

function RutaProtegida({ children }) {
  return estaAutenticado() ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage />} />

        <Route path="/" element={<RutaProtegida><HomePage /></RutaProtegida>} />

        <Route path="/consultas" element={<RutaProtegida><ConsultaPage /></RutaProtegida>} />
        <Route path="/consultas/nueva" element={<RutaProtegida><NuevaConsultaPage /></RutaProtegida>} />
        <Route path="/consultas/editar/:id" element={<RutaProtegida><EditarConsultaPage /></RutaProtegida>} />

        <Route path="/mascotas" element={<RutaProtegida><MascotasPage /></RutaProtegida>} />
        <Route path="/apoderados" element={<RutaProtegida><ApoderadosPage /></RutaProtegida>} />
        <Route path="/veterinarios" element={<RutaProtegida><VeterinariosPage /></RutaProtegida>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}