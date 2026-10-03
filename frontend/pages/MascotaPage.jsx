import { useEffect, useState } from "react";
import { listarMascotas, crearMascota, actualizarMascota, eliminarMascota } from "../service/MascotaService";
import { listarApoderados } from "../service/ApoderadoService";

const VACIO = { nombre: "", raza: "", peso: "", genero: "Macho", idApoderado: "" };

export default function MascotasPage() {
  const [mascotas, setMascotas] = useState([]);
  const [apoderados, setApoderados] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  const [formulario, setFormulario] = useState(null); // null = cerrado, {} = nuevo, {...} = editando
  const [form, setForm] = useState(VACIO);
  const [guardando, setGuardando] = useState(false);

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

  useEffect(() => {
    cargar();
    listarApoderados().then(setApoderados).catch(() => {});
  }, []);

  function abrirAgregar() {
    setForm(VACIO);
    setFormulario({});
  }

  function abrirEditar(m) {
    setForm({
      nombre: m.nombre,
      raza: m.raza,
      peso: m.peso,
      genero: m.genero,
      idApoderado: m.idApoderado ?? "",
    });
    setFormulario(m);
  }

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      const datos = { ...form, peso: parseFloat(form.peso), idApoderado: Number(form.idApoderado) };
      if (formulario?.id) {
        await actualizarMascota(formulario.id, datos);
      } else {
        await crearMascota(datos);
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
    if (!confirm("¿Eliminar esta mascota?")) return;
    try {
      await eliminarMascota(id);
      cargar();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section>
      <h2>Mascotas</h2>
      <div className="acciones-barra">
        <button onClick={cargar} disabled={cargando}>Actualizar lista</button>
        <button className="btn-agregar" onClick={abrirAgregar}>+ Agregar mascota</button>
      </div>

      {formulario && (
        <div className="form-card">
          <h3>{formulario.id ? "Editar mascota" : "Nueva mascota"}</h3>
          <form onSubmit={guardar}>
            <div className="form-grid">
              <label>Nombre
                <input name="nombre" value={form.nombre} onChange={cambiar} required />
              </label>
              <label>Raza
                <input name="raza" value={form.raza} onChange={cambiar} required />
              </label>
              <label>Peso (kg)
                <input name="peso" type="number" step="0.1" value={form.peso} onChange={cambiar} required />
              </label>
              <label>Género
                <select name="genero" value={form.genero} onChange={cambiar} required>
                  <option value="Macho">Macho</option>
                  <option value="Hembra">Hembra</option>
                </select>
              </label>
              <label>Apoderado (dueño)
                <select name="idApoderado" value={form.idApoderado} onChange={cambiar} required>
                  <option value="">-- Selecciona --</option>
                  {apoderados.map((a) => (
                    <option key={a.id} value={a.id}>{a.nombre} (tel: {a.telefono})</option>
                  ))}
                </select>
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
      {!cargando && !error && mascotas.length === 0 && <p>No hay registros.</p>}
      <div className="table-scroll"><table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Raza</th>
            <th>Peso (kg)</th>
            <th>Género</th>
            <th>Dueño</th>
            <th>Acciones</th>
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
                <button className="btn-editar" onClick={() => abrirEditar(m)}>Editar</button>
                <button className="btn-eliminar" onClick={() => eliminar(m.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table></div>
    </section>
  );
}
