import { useEffect, useState } from "react";
import { listarVeterinarios, crearVeterinario, actualizarVeterinario, eliminarVeterinario } from "../service/VeterinarioService";

const VACIO = { nombre: "", especialidad: "", telefono: "" };

export default function VeterinariosPage() {
  const [veterinarios, setVeterinarios] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  const [formulario, setFormulario] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);

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

  function abrirAgregar() {
    setForm(VACIO);
    setFormulario({});
  }

  function abrirEditar(v) {
    setForm({ nombre: v.nombre, especialidad: v.especialidad, telefono: v.telefono });
    setFormulario(v);
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
        await actualizarVeterinario(formulario.id, form);
      } else {
        await crearVeterinario(form);
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
    if (!confirm("¿Eliminar este veterinario?")) return;
    try {
      await eliminarVeterinario(id);
      cargar();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section>
      <h2>Veterinarios</h2>
      <div className="acciones-barra">
        <button onClick={cargar} disabled={cargando}>Actualizar lista</button>
        <button className="btn-agregar" onClick={abrirAgregar}>+ Agregar veterinario</button>
      </div>

      {formulario && (
        <div className="form-card">
          <h3>{formulario.id ? "Editar veterinario" : "Nuevo veterinario"}</h3>
          <form onSubmit={guardar}>
            <div className="form-grid">
              <label>Nombre
                <input name="nombre" value={form.nombre} onChange={cambiar} required />
              </label>
              <label>Especialidad
                <input name="especialidad" value={form.especialidad} onChange={cambiar} required />
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
      {!cargando && !error && veterinarios.length === 0 && <p>No hay registros.</p>}
      <div className="table-scroll"><table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Especialidad</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {veterinarios.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.nombre}</td>
              <td>{v.especialidad}</td>
              <td>{v.telefono}</td>
              <td>
                <button className="btn-editar" onClick={() => abrirEditar(v)}>Editar</button>
                <button className="btn-eliminar" onClick={() => eliminar(v.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </section>
  );
}
