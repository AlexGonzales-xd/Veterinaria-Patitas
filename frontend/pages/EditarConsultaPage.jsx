import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listarCitas, editarCita } from "../service/ConsultaService";
import { listarApoderados } from "../service/ApoderadoService";
import { listarVeterinarios } from "../service/VeterinarioService";
import { listarMascotas } from "../service/MascotaService";

export default function EditarConsultaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [apoderados, setApoderados] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    listarApoderados().then(setApoderados);
    listarVeterinarios().then(setVeterinarios);
    listarMascotas().then(setMascotas);

    listarCitas().then((citas) => {
      const c = citas.find((x) => String(x.id) === id);
      if (c) {
        setForm({
          fecha: c.fecha,
          idApoderado: c.apoderado?.id ?? c.idApoderado ?? "",
          idVeterinario: c.veterinario?.id ?? c.idVeterinario ?? "",
          idMascota: c.mascota?.id ?? c.idMascota ?? "",
        });
      }
    });
  }, [id]);

  if (!form) return <p>Cargando...</p>;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await editarCita(id, form);
      navigate("/consultas");
    } catch (err) {
      alert("No se pudo actualizar: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="datetime-local" name="fecha" value={form.fecha} onChange={handleChange} required />

      <select name="idApoderado" value={form.idApoderado} onChange={handleChange} required>
        {apoderados.map((a) => (
          <option key={a.id} value={a.id}>{a.nombre}</option>
        ))}
      </select>

      <select name="idVeterinario" value={form.idVeterinario} onChange={handleChange} required>
        {veterinarios.map((v) => (
          <option key={v.id} value={v.id}>{v.nombre}</option>
        ))}
      </select>

      <select name="idMascota" value={form.idMascota} onChange={handleChange} required>
        {mascotas.map((m) => (
          <option key={m.id} value={m.id}>{m.nombre}</option>
        ))}
      </select>

      <button type="submit">Actualizar</button>
    </form>
  );
}