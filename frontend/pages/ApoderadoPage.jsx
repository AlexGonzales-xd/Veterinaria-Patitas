import { useEffect, useState } from "react";
import Nabar from "../components/Nabar";
import { listarApoderados, eliminarApoderado } from "../service/ApoderadoService";

export default function ApoderadosPage() {
  const [apoderados, setApoderados] = useState([]);
  const [error, setError] = useState("");

  const cargar = () =>
    listarApoderados().then(setApoderados).catch((e) => setError(e.message));

  useEffect(() => {
    cargar();
  }, []);

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
      <Nabar />
      <main className="container">
        <h1>Apoderados</h1>
        {error && <p className="error">{error}</p>}
        <table>
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
        </table>
      </main>
    </>
  );
}