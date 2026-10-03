import { useEffect, useState } from "react";
import { listarApoderados, eliminarApoderado } from "../service/ApoderadoService";

export default function ApoderadosPage() {
  const [apoderados, setApoderados] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  async function cargar() {
    setCargando(true);
    setError("");
    try {
      setApoderados(await listarApoderados());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  const eliminar = async (id) => {
    if (!confirm("¿Eliminar este apoderado?")) return;
    try {
      await eliminarApoderado(id);
      cargar();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <>
      <section>
        <h2>Apoderados</h2>
        <button onClick={cargar} disabled={cargando}>Actualizar lista</button>
        {cargando && <p role="status">Cargando...</p>}
        {error && <p className="error" role="alert">{error}</p>}
        {!cargando && !error && apoderados.length === 0 && <p>No hay registros.</p>}
        <div className="table-scroll"><table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {apoderados.map((a) => (
              <tr key={a.id}>
                <td>{a.id}</td>
                <td>{a.nombre}</td>
                <td>{a.telefono}</td>
                <td>
                  <button onClick={() => eliminar(a.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </section>
    </>
  );
}