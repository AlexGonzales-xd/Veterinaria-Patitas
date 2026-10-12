import { useEffect, useState } from "react";
import ConfirmarEliminar from "../components/ConfirmarEliminar";
import { listarApoderados, crearApoderado, actualizarApoderado, eliminarApoderado } from "../service/ApoderadoService";

const VACIO = { nombre: "", telefono: "" };

export default function ApoderadosPage() {
  const [apoderados, setApoderados] = useState([]);
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

  async function confirmarEliminar() {
    setEliminando(true);
    try {
      await eliminarApoderado(porEliminar.id);
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
          <h1>Apoderados</h1>
          <p>Gestiona a los dueños de las mascotas</p>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary" onClick={cargar} disabled={cargando}>Actualizar</button>
          <button className="btn-primary" onClick={abrirAgregar}>+ Agregar apoderado</button>
        </div>
      </header>

      <section className="card">
        <div className="card-title">
          <h2>Apoderados registrados</h2>
          <p>{apoderados.length} {apoderados.length === 1 ? "registro" : "registros"}</p>
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
        {!cargando && !error && apoderados.length === 0 && <p>No hay registros.</p>}
        <div className="table-scroll"><table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* N° es solo la posición en la lista (1, 2, 3...), así no quedan huecos al eliminar.
                Las acciones siguen usando el ID real (a.id). */}
            {apoderados.map((a, i) => (
              <tr key={a.id}>
                <td>{i + 1}</td>
                <td>{a.nombre}</td>
                <td>{a.telefono}</td>
                <td>
                  <div className="acciones-fila">
                    <button className="btn-sm btn-editar" onClick={() => abrirEditar(a)}>Editar</button>
                    <button className="btn-sm btn-eliminar" onClick={() => setPorEliminar(a)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </section>
      <ConfirmarEliminar
        abierto={Boolean(porEliminar)}
        mensaje={`Vas a eliminar al apoderado «${porEliminar?.nombre ?? ""}». Esta acción no se puede deshacer.`}
        cargando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}