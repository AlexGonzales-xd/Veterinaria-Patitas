import { useEffect, useState } from "react";
import { agendarCita, editarCita } from "../service/ConsultaService";
import { listarApoderados } from "../service/ApoderadoService";
import { listarVeterinarios } from "../service/VeterinarioService";
import { listarMascotas } from "../service/MascotaService";

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

  function cambiar(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
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
      <label>Fecha y hora
        <input type="datetime-local" name="fecha" value={form.fecha} onChange={cambiar} required />
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
        <select name="idMascota" value={form.idMascota} onChange={cambiar} required>
          <option value="">Seleccionar mascota</option>
          {mascotas.map((m) => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
      </label>
      <button disabled={cargando || guardando || !apoderados.length || !veterinarios.length || !mascotas.length}>
        {guardando ? "Guardando..." : "Guardar consulta"}
      </button>{" "}
      <button type="button" onClick={onCancelar} disabled={guardando}>Cancelar</button>
    </form>
  );
}
