import { useEffect, useState } from "react";
import ConfirmarEliminar from "../components/ConfirmarEliminar";
import {
  listarMascotas, listarMascotasPorApoderado,
  crearMascota, actualizarMascota, eliminarMascota,
} from "../service/MascotaService";
import { listarApoderados } from "../service/ApoderadoService";

const VACIO = { nombre: "", raza: "", peso: "", genero: "Macho", idApoderado: "" };

// admin y veterinario gestionan todas las mascotas.
// El apoderado solo ve, agrega, edita y elimina las suyas.
export default function MascotasPage({ usuario, rol }) {
  const esApoderado = rol === "apoderado";
  const idPropio = usuario?.idApoderado ?? null;

  const [mascotas, setMascotas] = useState([]);
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
      if (esApoderado) {
        if (idPropio == null) {
          setMascotas([]);
          setError("No se encontró tu ficha de apoderado. Cierra sesión y vuelve a iniciar sesión; si sigue igual, avisa al administrador.");
        } else {
          setMascotas(await listarMascotasPorApoderado(idPropio));
        }
      } else {
        setMascotas(await listarMascotas());
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
    if (!esApoderado) listarApoderados().then(setApoderados).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function abrirAgregar() {
    setForm({ ...VACIO, idApoderado: esApoderado ? idPropio ?? "" : "" });
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
      // El apoderado siempre guarda a su nombre, sin poder elegir otro dueño
      const idDueno = esApoderado ? idPropio : Number(form.idApoderado);
      const datos = { ...form, peso: parseFloat(form.peso), idApoderado: idDueno };
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

  async function confirmarEliminar() {
    setEliminando(true);
    try {
      await eliminarMascota(porEliminar.id);
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
          <h1>{esApoderado ? "Mis mascotas" : "Mascotas"}</h1>
          <p>
            {esApoderado
              ? "Registra y administra a tus mascotas"
              : "Gestiona las mascotas registradas en el sistema"}
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary" onClick={cargar} disabled={cargando}>Actualizar</button>
          <button className="btn-primary" onClick={abrirAgregar} disabled={esApoderado && idPropio == null}>
            + Agregar mascota
          </button>
        </div>
      </header>

      <section className="card">
        <div className="card-title">
          <h2>{esApoderado ? "Tus mascotas" : "Mascotas registradas"}</h2>
          <p>{mascotas.length} {mascotas.length === 1 ? "registro" : "registros"}</p>
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
                  <input name="peso" type="number" step="0.1" min="0" value={form.peso} onChange={cambiar} required />
                </label>
                <label>Género
                  <select name="genero" value={form.genero} onChange={cambiar} required>
                    <option value="Macho">Macho</option>
                    <option value="Hembra">Hembra</option>
                  </select>
                </label>
                {!esApoderado && (
                  <label>Apoderado (dueño)
                    <select name="idApoderado" value={form.idApoderado} onChange={cambiar} required>
                      <option value="">-- Selecciona --</option>
                      {apoderados.map((a) => (
                        <option key={a.id} value={a.id}>{a.nombre} (tel: {a.telefono})</option>
                      ))}
                    </select>
                  </label>
                )}
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
        {!cargando && !error && mascotas.length === 0 && (
          <p>{esApoderado ? "Aún no has registrado mascotas." : "No hay registros."}</p>
        )}
        <div className="table-scroll"><table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Raza</th>
              <th>Peso (kg)</th>
              <th>Género</th>
              {!esApoderado && <th>Dueño</th>}
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
                {!esApoderado && <td>{m.nombreApoderado}</td>}
                <td>
                  <div className="acciones-fila">
                    <button className="btn-sm btn-editar" onClick={() => abrirEditar(m)}>Editar</button>
                    <button className="btn-sm btn-eliminar" onClick={() => setPorEliminar(m)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      </section>

      <ConfirmarEliminar
        abierto={Boolean(porEliminar)}
        mensaje={`Vas a eliminar a la mascota «${porEliminar?.nombre ?? ""}». Esta acción no se puede deshacer.`}
        cargando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}