import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { agendarCita } from "../service/ConsultaService";
import { listarApoderados } from "../service/ApoderadoService";
import { listarVeterinarios } from "../service/VeterinarioService";
import { listarMascotas } from "../service/MascotaService";

export default function NuevaConsultaPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fecha: "",
    idApoderado: "",
    idVeterinario: "",
    idMascota: "",
  });
  const [apoderados, setApoderados] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [mascotas, setMascotas] = useState([]);

  useEffect(() => {
    listarApoderados().then(setApoderados);
    listarVeterinarios().then(setVeterinarios);
    listarMascotas().then(setMascotas);
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await agendarCita(form);
      navigate("/consultas");
    } catch (err) {
      alert("No se pudo agendar: " + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="datetime-local" name="fecha" value={form.fecha} onChange={handleChange} required />

      <select name="idApoderado" value={form.idApoderado} onChange={handleChange} required>
        <option value="">Apoderado</option>
        {apoderados.map((a) => (
          <option key={a.id} value={a.id}>{a.nombre}</option>
        ))}
      </select>

      <select name="idVeterinario" value={form.idVeterinario} onChange={handleChange} required>
        <option value="">Veterinario</option>
        {veterinarios.map((v) => (
          <option key={v.id} value={v.id}>{v.nombre}</option>
        ))}
      </select>

      <select name="idMascota" value={form.idMascota} onChange={handleChange} required>
        <option value="">Mascota</option>
        {mascotas.map((m) => (
          <option key={m.id} value={m.id}>{m.nombre}</option>
        ))}
      </select>

      <button type="submit">Agendar</button>
    </form>
  );
}