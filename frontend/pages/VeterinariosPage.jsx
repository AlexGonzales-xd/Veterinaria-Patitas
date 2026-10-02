import { useEffect, useState } from "react";
import Nabar from "../components/Nabar";
import { listarVeterinarios } from "../service/VeterinarioService";

export default function VeterinariosPage() {
  const [veterinarios, setVeterinarios] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    listarVeterinarios().then(setVeterinarios).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <Nabar />
      <main className="container">
        <h1>Veterinarios</h1>
        {error && <p className="error">{error}</p>}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Teléfono</th>
            </tr>
          </thead>
          <tbody>
            {veterinarios.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.nombre}</td>
                <td>{v.especialidad}</td>
                <td>{v.telefono}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}