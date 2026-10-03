import { useEffect, useState } from "react";
import { listarCitas, eliminarCita } from "../service/ConsultaService";
import NuevaConsultaPage from "./NuevaConsultaPage";

export default function ConsultaPage() {
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [formulario, setFormulario] = useState(null);

  async function cargar() {
    setCargando(true);
    setError("");
    try {
      setCitas(await listarCitas());
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function eliminar(id) {
    if (!confirm("¿Eliminar esta consulta?")) return;
    try {
      await eliminarCita(id);
      await cargar();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <section>
      <h2>Consultas</h2>
      <button onClick={cargar} disabled={cargando}>Actualizar lista</button>{" "}
      <button onClick={() => setFormulario({})}>Nueva consulta</button>
      {formulario && (
        <NuevaConsultaPage
          key={formulario.id ?? "nueva"}
          consulta={formulario}
          onCancelar={() => setFormulario(null)}
          onGuardar={() => { setFormulario(null); cargar(); }}
        />
      )}
      {cargando && <p role="status">Cargando...</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {!cargando && !error && citas.length === 0 && <p>No hay consultas.</p>}
      <div className="table-scroll">
        <table>
          <thead><tr><th>ID</th><th>Fecha</th><th>Mascota</th><th>Apoderado</th><th>Veterinario</th><th>Acciones</th></tr></thead>
          <tbody>
            {citas.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.fechaCon?.replace("T", " ")}</td>
                <td>{c.mascota?.nombre}</td>
                <td>{c.apoderado?.nombre}</td>
                <td>{c.veterinario?.nombre}</td>
                <td>
                  <button onClick={() => setFormulario(c)}>Editar</button>{" "}
                  <button onClick={() => eliminar(c.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
