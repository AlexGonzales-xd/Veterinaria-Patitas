import { useEffect, useState } from "react";
import { listarVeterinarios } from "../service/VeterinarioService";

export default function VeterinariosPage() {
  const [veterinarios, setVeterinarios] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    setCargando(true);
    setError("");
    try {
      setVeterinarios(await listarVeterinarios());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  return (
    <>
      <section>
        <h2>Veterinarios</h2>
        <button onClick={cargar} disabled={cargando}>Actualizar lista</button>
        {cargando && <p role="status">Cargando...</p>}
        {error && <p className="error" role="alert">{error}</p>}
        {!cargando && !error && veterinarios.length === 0 && <p>No hay registros.</p>}
        <div className="table-scroll"><table>
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
        </table></div>
      </section>
    </>
  );
}