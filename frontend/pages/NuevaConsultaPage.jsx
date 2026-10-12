import { useEffect, useState } from "react";
import { agendarCita, editarCita } from "../service/ConsultaService";
import { listarApoderados } from "../service/ApoderadoService";
import { listarVeterinarios } from "../service/VeterinarioService";
import { listarMascotas } from "../service/MascotaService";

// Inicio del día de hoy en hora local, formato datetime-local
function inicioDeHoy() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}T00:00`;
}

export default function NuevaConsultaPage({ consulta, onGuardar, onCancelar }) {
  const [form, setForm] = useState({
    fecha: consulta.fechaCon?.slice(0, 16) ?? "",
    idApoderado: consulta.apoderado?.id ?? "",
    idVeterinario: consulta.veterinario?.id ?? "",
    idMascota: consulta.mascota?.id ?? "",
  });
  const [apoderados, setApoderados] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    Promise.all([listarApoderados(), listarVeterinarios(), listarMascotas()])
      .then(([a, v, m]) => { setApoderados(a); setVeterinarios(v); setMascotas(m); })
      .catch((e) => setError(e.message))
      .finally(() => setCargando(false));
  }, []);

  // Solo las mascotas del apoderado seleccionado
  const mascotasDelApoderado = form.idApoderado
    ? mascotas.filter((m) => String(m.idApoderado) === String(form.idApoderado))
    : [];

  function cambiar(e) {
    const { name, value } = e.target;
    if (name === "idApoderado") {
      // Al cambiar de apoderado, la mascota elegida antes deja de ser válida
      setForm({ ...form, idApoderado: value, idMascota: "" });
    } else {
      setForm({ ...form, [name]: value });
    }
  }

  async function guardar(e) {
    e.preventDefault();
    setGuardando(true);
    setError("");
    try {
      if (consulta.id) await editarCita(consulta.id, form);
      else await agendarCita(form);
      onGuardar();
    } catch (e) {
      setError(e.message);
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={guardar}>
      <h3>{consulta.id ? "Editar consulta" : "Nueva consulta"}</h3>
      {error && <p className="error" role="alert">{error}</p>}
      {cargando && <p role="status">Cargando opciones...</p>}
      <div className="form-grid">
        <label>Fecha y hora
          {/* El mínimo solo aplica al crear: así se pueden editar consultas pasadas */}
          <input
            type="datetime-local"
            name="fecha"
            min={consulta.id ? undefined : inicioDeHoy()}
            value={form.fecha}
            onChange={cambiar}
            required
          />
        </label>
        <label>Apoderado
          <select name="idApoderado" value={form.idApoderado} onChange={cambiar} required>
            <option value="">Seleccionar apoderado</option>
            {apoderados.map((a) => <option key={a.id} value={a.id}>{a.nombre}</option>)}
          </select>
        </label>
        <label>Veterinario
          <select name="idVeterinario" value={form.idVeterinario} onChange={cambiar} required>
            <option value="">Seleccionar veterinario</option>
            {veterinarios.map((v) => <option key={v.id} value={v.id}>{v.nombre}</option>)}
          </select>
        </label>
        <label>Mascota
          <select
            name="idMascota"
            value={form.idMascota}
            onChange={cambiar}
            disabled={!form.idApoderado}
            required
          >
            <option value="">
              {form.idApoderado ? "Seleccionar mascota" : "Primero elige un apoderado"}
            </option>
            {mascotasDelApoderado.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
          </select>
          {!cargando && form.idApoderado && mascotasDelApoderado.length === 0 && (
            <small>Este apoderado aún no tiene mascotas registradas.</small>
          )}
        </label>
      </div>
      <div className="form-acciones">
        <button
          className="btn-primary"
          disabled={cargando || guardando || !apoderados.length || !veterinarios.length || !mascotasDelApoderado.length}
        >
          {guardando ? "Guardando..." : "Guardar consulta"}
        </button>
        <button type="button" className="btn-secondary" onClick={onCancelar} disabled={guardando}>Cancelar</button>
      </div>
    </form>
  );
}