import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listarCitas, eliminarCita } from "../service/ConsultaService";

export default function ConsultaPage() {
  const [citas, setCitas] = useState([]);
  const [error, setError] = useState(null);

  const cargar = () =>
    listarCitas().then(setCitas).catch((e) => setError(e.message));

  useEffect(() => { cargar(); }, []);

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar esta cita?")) return;
    await eliminarCita(id);
    cargar();
  };

  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Link to="/consultas/nueva">Nueva consulta</Link>
      {citas.map((c) => (
        <div key={c.id}>
          <span>{c.fecha}</span>
          <Link to={`/consultas/editar/${c.id}`}>Editar</Link>
          <button onClick={() => handleEliminar(c.id)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
}