import { useEffect, useState } from "react";
import { listarMascotas, eliminarMascota } from "../service/MascotaService";

export default function MascotasPage() {
  const [mascotas, setMascotas] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    setCargando(true);
    setError("");
    try {
      setMascotas(await listarMascotas());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar esta mascota?")) return;
    try {
      await eliminarMascota(id);
      cargar();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <section>
        <h2>Mascotas</h2>
        <button onClick={cargar} disabled={cargando}>Actualizar lista</button>
        {cargando && <p role="status">Cargando...</p>}
        {error && <p className="error" role="alert">{error}</p>}
        {!cargando && !error && mascotas.length === 0 && <p>No hay registros.</p>}
        <div className="table-scroll"><table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Raza</th>
              <th>Peso (kg)</th>
              <th>Género</th>
              <th>Dueño</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {mascotas.map((m) => (
              <tr key={m.id}>
                <td>{m.nombre}</td>
                <td>{m.raza}</td>
                <td>{m.peso}</td>
                <td>{m.genero}</td>
                <td>{m.nombreApoderado}</td>
                <td>
                  <button onClick={() => eliminar(m.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </section>
    </>
  );
}