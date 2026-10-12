import { useEffect, useState } from "react";
import ConfirmarEliminar from "../components/ConfirmarEliminar";
import { listarVeterinarios, crearVeterinario, actualizarVeterinario, eliminarVeterinario } from "../service/VeterinarioService";

const VACIO = { nombre: "", especialidad: "", telefono: "" };

export default function VeterinariosPage({ puedeEditar = false }) {
  const [veterinarios, setVeterinarios] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  const [formulario, setFormulario] = useState(null);
  const [form, setForm] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);
  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

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

  async function confirmarEliminar() {
    setEliminando(true);
    try {
      await eliminarVeterinario(porEliminar.id);
      setPorEliminar(null);
      cargar();
    } catch (e) {
      setPorEliminar(null);
      setError(e.message);
    } finally {
      setEliminando(false);
    }
  }

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Veterinarios</h1>
          <p>{puedeEditar ? "Gestiona al personal veterinario de la clínica" : "Conoce al personal veterinario de la clínica"}</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary" onClick={cargar} disabled={cargando}>Actualizar</button>
          {puedeEditar && <button className="btn-primary" onClick={abrirAgregar}>+ Nuevo veterinario</button>}
        </div>
      </header>

      <section className="card">
        <div className="card-title">
          <h2>Personal veterinario</h2>
          <p>{veterinarios.length} {veterinarios.length === 1 ? "veterinario registrado" : "veterinarios registrados"}</p>
        </div>

        {puedeEditar && formulario && (
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
                <button type="submit" className="btn-primary" disabled={guardando}>
                  {guardando ? "Guardando..." : "Guardar"}
                </button>
                <button type="button" className="btn-secondary" onClick={() => setFormulario(null)} disabled={guardando}>
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
              <th>N°</th>
              <th>Nombre</th>
              <th>Especialidad</th>
              <th>Teléfono</th>
              {puedeEditar && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {/* N° = posición en la lista; las acciones usan el ID real (v.id) */}
            {veterinarios.map((v, i) => (
              <tr key={v.id}>
                <td>{i + 1}</td>
                <td>{v.nombre}</td>
                <td>{v.especialidad}</td>
                <td>{v.telefono}</td>
                {puedeEditar && (
                <td>
                  <div className="acciones-fila">
                    <button className="btn-sm btn-editar" onClick={() => abrirEditar(v)}>Editar</button>
                    <button className="btn-sm btn-eliminar" onClick={() => setPorEliminar(v)}>Eliminar</button>
                  </div>
                </td>
                )}
              </tr>
            ))}
          </tbody>
        </table></div>
      </section>
      <ConfirmarEliminar
        abierto={Boolean(porEliminar)}
        mensaje={`Vas a eliminar al veterinario «${porEliminar?.nombre ?? ""}». Esta acción no se puede deshacer.`}
        cargando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}