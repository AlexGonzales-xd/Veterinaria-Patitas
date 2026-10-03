import { useEffect, useState } from "react";
import { listarApoderados, crearApoderado, actualizarApoderado, eliminarApoderado } from "../service/ApoderadoService";

const VACIO = { nombre: "", telefono: "" };

export default function ApoderadosPage() {
  const [apoderados, setApoderados] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  const [formulario, setFormulario] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);

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

  function abrirAgregar() {
    setForm(VACIO);
    setFormulario({});
  }

  function abrirEditar(a) {
    setForm({ nombre: a.nombre, telefono: a.telefono });
    setFormulario(a);
  }

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      if (formulario?.id) {
        await actualizarApoderado(formulario.id, form);
      } else {
        await crearApoderado(form);
      }
      setFormulario(null);
      cargar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

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
    <section>
      <h2>Apoderados</h2>
      <div className="acciones-barra">
        <button onClick={cargar} disabled={cargando}>Actualizar lista</button>
        <button className="btn-agregar" onClick={abrirAgregar}>+ Agregar apoderado</button>
      </div>

      {formulario && (
        <div className="form-card">
          <h3>{formulario.id ? "Editar apoderado" : "Nuevo apoderado"}</h3>
          <form onSubmit={guardar}>
            <div className="form-grid">
              <label>Nombre
                <input name="nombre" value={form.nombre} onChange={cambiar} required />
              </label>
              <label>Teléfono
                <input name="telefono" value={form.telefono} onChange={cambiar} maxLength={11} required />
              </label>
            </div>
            <div className="form-acciones">
              <button type="submit" className="btn-guardar" disabled={guardando}>
                {guardando ? "Guardando..." : "Guardar"}
              </button>
              <button type="button" className="btn-secundario" onClick={() => setFormulario(null)} disabled={guardando}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {cargando && <p role="status">Cargando...</p>}
      {error && <p className="error" role="alert">{error}</p>}
      {!cargando && !error && apoderados.length === 0 && <p>No hay registros.</p>}
      <div className="table-scroll"><table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {apoderados.map((a) => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.nombre}</td>
              <td>{a.telefono}</td>
              <td>
                <button className="btn-editar" onClick={() => abrirEditar(a)}>Editar</button>
                <button className="btn-eliminar" onClick={() => eliminar(a.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </section>
  );
}
