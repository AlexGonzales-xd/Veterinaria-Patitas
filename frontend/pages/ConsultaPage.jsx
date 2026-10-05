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
    <>
      <header className="page-header">
        <div>
          <h1>Consultas</h1>
          <p>Historial completo de citas registradas</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary" onClick={cargar} disabled={cargando}>Actualizar</button>
          <button className="btn-primary" onClick={() => setFormulario({})}>+ Nueva consulta</button>
        </div>
      </header>

      {formulario && (
        <div className="form-card">
          <NuevaConsultaPage
            key={formulario.id ?? "nueva"}
            consulta={formulario}
            onCancelar={() => setFormulario(null)}
            onGuardar={() => { setFormulario(null); cargar(); }}
          />
        </div>
      )}

      <section className="card">
        <div className="card-title">
          <h2>Todas las consultas</h2>
          <p>{citas.length} {citas.length === 1 ? "consulta registrada" : "consultas registradas"}</p>
        </div>

        {cargando && <p role="status">Cargando...</p>}
        {error && <p className="error" role="alert">{error}</p>}
        {!cargando && !error && citas.length === 0 && <p>No hay consultas.</p>}
        <div className="table-scroll">
          <table>
            <thead><tr><th>Fecha</th><th>Mascota</th><th>Apoderado</th><th>Veterinario</th><th>Acciones</th></tr></thead>
            <tbody>
              {citas.map((c) => (
                <tr key={c.id}>
                  <td>{c.fechaCon?.replace("T", " ")}</td>
                  <td>{c.mascota?.nombre}</td>
                  <td>{c.apoderado?.nombre}</td>
                  <td>{c.veterinario?.nombre}</td>
                  <td>
                    <div className="acciones-fila">
                      <button className="link-editar" onClick={() => setFormulario(c)}>Editar</button>
                      <button className="link-eliminar" onClick={() => eliminar(c.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
