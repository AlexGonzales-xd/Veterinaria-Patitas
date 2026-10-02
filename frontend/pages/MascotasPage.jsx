import { useEffect, useState } from "react";
import Nabar from "../components/Nabar";
import { listarMascotas, eliminarMascota } from "../service/MascotaService";

export default function MascotasPage() {
  const [mascotas, setMascotas] = useState([]);
  const [error, setError] = useState("");

  const cargar = () =>
    listarMascotas().then(setMascotas).catch((e) => setError(e.message));

  useEffect(() => {
    cargar();
  }, []);

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
      <Nabar />
      <main className="container">
        <h1>Mascotas</h1>
        {error && <p className="error">{error}</p>}
        <table>
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
        </table>
      </main>
    </>
  );
}