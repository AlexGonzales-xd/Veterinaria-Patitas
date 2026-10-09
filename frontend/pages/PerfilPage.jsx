import { useEffect, useState } from "react";
import { obtenerApoderado } from "../service/ApoderadoService";
import { obtenerVeterinario } from "../service/VeterinarioService";
import { listarMascotasPorApoderado } from "../service/MascotaService";

const ETIQUETA_ROL = {
  admin: "Administrador",
  veterinario: "Veterinario",
  apoderado: "Apoderado",
};

// El registro crea el apoderado con un teléfono provisional de solo ceros
function telefonoLegible(t) {
  return !t || /^0+$/.test(t) ? "Sin registrar" : t;
}

function Dato({ etiqueta, valor }) {
  return (
    <div className="dato">
      <dt>{etiqueta}</dt>
      <dd>{valor ?? "—"}</dd>
    </div>
  );
}

export default function PerfilPage({ usuario, rol }) {
  const idFicha = rol === "apoderado" ? usuario?.idApoderado : rol === "veterinario" ? usuario?.idVeterinario : null;
  const tieneFicha = idFicha != null;

  const [ficha, setFicha] = useState(null);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(tieneFicha);

  useEffect(() => {
    if (!tieneFicha) return;
    let activo = true;

    async function cargar() {
      try {
        if (rol === "apoderado") {
          const [datos, mascotas] = await Promise.all([
            obtenerApoderado(idFicha),
            listarMascotasPorApoderado(idFicha),
          ]);
          if (activo) setFicha({ ...datos, totalMascotas: mascotas.length });
        } else {
          const datos = await obtenerVeterinario(idFicha);
          if (activo) setFicha(datos);
        }
      } catch (e) {
        if (activo) setError(e.message);
      } finally {
        if (activo) setCargando(false);
      }
    }

    cargar();
    return () => { activo = false; };
  }, [rol, idFicha, tieneFicha]);

  const nombre = ficha?.nombre ?? usuario.username;
  const inicial = (nombre || "?").charAt(0).toUpperCase();

  return (
    <>
      <header className="page-header">
        <div>
          <h1>Mi perfil</h1>
          <p>Tu información en Patitas</p>
        </div>
      </header>

      <section className="card">
        <div className="perfil-cabecera">
          <div className="perfil-avatar" aria-hidden="true">{inicial}</div>
          <div>
            <h2>{nombre}</h2>
            <span className="badge-rol">{ETIQUETA_ROL[rol] ?? usuario.rol}</span>
          </div>
        </div>

        <h3 className="perfil-subtitulo">Cuenta</h3>
        <dl className="perfil-datos">
          <Dato etiqueta="Usuario" valor={usuario.username} />
          <Dato etiqueta="Correo" valor={usuario.email} />
          <Dato etiqueta="Rol" valor={ETIQUETA_ROL[rol] ?? usuario.rol} />
        </dl>

        {rol !== "admin" && (
          <>
            <h3 className="perfil-subtitulo">Datos personales</h3>
            {cargando && <p role="status">Cargando...</p>}
            {error && <p className="error" role="alert">{error}</p>}
            {!cargando && !error && !ficha && (
              <p>No hay datos personales vinculados a esta cuenta.</p>
            )}
            {!cargando && !error && ficha && (
              <dl className="perfil-datos">
                <Dato etiqueta="Nombre" valor={ficha.nombre} />
                <Dato etiqueta="Teléfono" valor={telefonoLegible(ficha.telefono)} />
                {rol === "veterinario" && <Dato etiqueta="Especialidad" valor={ficha.especialidad} />}
                {rol === "apoderado" && <Dato etiqueta="Mascotas registradas" valor={ficha.totalMascotas} />}
              </dl>
            )}
          </>
        )}
      </section>
    </>
  );
}