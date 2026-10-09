import { useEffect, useState } from "react";
import ConfirmarEliminar from "../components/ConfirmarEliminar";
import { listarCitas, listarCitasPorApoderado, eliminarCita } from "../service/ConsultaService";
import NuevaConsultaPage from "./NuevaConsultaPage";

// Fecha de hoy en hora local (YYYY-MM-DD). No usamos toISOString porque
// devuelve la fecha en UTC y de noche marcaría el día siguiente.
function hoyLocal() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

// Solo consultas de hoy o de fechas posteriores, de la más próxima a la más lejana.
function soloVigentes(citas) {
  const hoy = hoyLocal();
  return citas
    .filter((c) => !c.fechaCon || c.fechaCon.slice(0, 10) >= hoy)
    .sort((a, b) => (a.fechaCon ?? "").localeCompare(b.fechaCon ?? ""));
}

// admin y veterinario crean, editan y eliminan consultas.
// El apoderado solo ve las consultas de sus mascotas.
export default function ConsultaPage({ usuario, rol, puedeEditar = false }) {
  const esApoderado = rol === "apoderado";
  const idPropio = usuario?.idApoderado ?? null;

  const [citas, setCitas] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);
  const [formulario, setFormulario] = useState(null);

  const [porEliminar, setPorEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  async function cargar() {
    setCargando(true);
    setError("");
    try {
      let lista;
      if (esApoderado) {
        if (idPropio == null) {
          lista = [];
          setError("Tu cuenta aún no está vinculada a un apoderado. Pide al administrador que la configure.");
        } else {
          lista = await listarCitasPorApoderado(idPropio);
        }
      } else {
        lista = await listarCitas();
      }
      setCitas(soloVigentes(lista));
    } catch (e) {
      setError(e.message);
    } finally {
      setCargando(false);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { cargar(); }, []);

  async function confirmarEliminar() {
    setEliminando(true);
    try {
      await eliminarCita(porEliminar.id);
      setPorEliminar(null);
      await cargar();
    } catch (e) {
      setPorEliminar(null);
      setError(e.message);
    } finally {
      setEliminando(false);
    }
  }

  const fechaTexto = (c) => c.fechaCon?.replace("T", " ").slice(0, 16);

  return (
    <>
      <header className="page-header">
        <div>
          <h1>{esApoderado ? "Mis consultas" : "Consultas"}</h1>
          <p>
            {esApoderado
              ? "Consultas programadas para tus mascotas"
              : "Consultas de hoy y de los próximos días"}
          </p>
        </div>
        <div className="page-header-actions">
          <button className="btn-secondary" onClick={cargar} disabled={cargando}>Actualizar</button>
          {puedeEditar && (
            <button className="btn-primary" onClick={() => setFormulario({})}>+ Nueva consulta</button>
          )}
        </div>
      </header>

      {puedeEditar && formulario && (
        <div className="form-card">
          <NuevaConsultaPage
            key={formulario.id ?? "nueva"}
            consulta={formulario}
            onCancelar={() => setFormulario(null)}
            onGuardar={() => { setFormulario(null); cargar(); }}
          />
        </div>
      )}

      <section className="card">
        <div className="card-title">
          <h2>{esApoderado ? "Tus próximas consultas" : "Próximas consultas"}</h2>
          <p>{citas.length} {citas.length === 1 ? "consulta programada" : "consultas programadas"}</p>
        </div>

        {cargando && <p role="status">Cargando...</p>}
        {error && <p className="error" role="alert">{error}</p>}
        {!cargando && !error && citas.length === 0 && <p>No hay consultas programadas.</p>}
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Mascota</th>
                {!esApoderado && <th>Apoderado</th>}
                <th>Veterinario</th>
                {puedeEditar && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {citas.map((c) => (
                <tr key={c.id}>
                  <td>{fechaTexto(c)}</td>
                  <td>{c.mascota?.nombre}</td>
                  {!esApoderado && <td>{c.apoderado?.nombre}</td>}
                  <td>{c.veterinario?.nombre}</td>
                  {puedeEditar && (
                    <td>
                      <div className="acciones-fila">
                        <button className="btn-sm btn-editar" onClick={() => setFormulario(c)}>Editar</button>
                        <button className="btn-sm btn-eliminar" onClick={() => setPorEliminar(c)}>Eliminar</button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <ConfirmarEliminar
        abierto={Boolean(porEliminar)}
        mensaje={`Vas a eliminar la consulta de «${porEliminar?.mascota?.nombre ?? "la mascota"}» del ${porEliminar ? fechaTexto(porEliminar) : ""}. Esta acción no se puede deshacer.`}
        cargando={eliminando}
        onConfirmar={confirmarEliminar}
        onCancelar={() => setPorEliminar(null)}
      />
    </>
  );
}
