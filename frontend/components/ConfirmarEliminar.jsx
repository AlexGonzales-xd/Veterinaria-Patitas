import { useEffect } from "react";

// Diálogo "¿Estás seguro de eliminar...?" reutilizable.
export default function ConfirmarEliminar({ abierto, mensaje, cargando = false, onConfirmar, onCancelar }) {
  useEffect(() => {
    if (!abierto) return;
    const alTeclear = (e) => { if (e.key === "Escape" && !cargando) onCancelar(); };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [abierto, cargando, onCancelar]);

  if (!abierto) return null;

  return (
    <div className="modal-fondo" onClick={() => { if (!cargando) onCancelar(); }}>
      <div
        className="modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmar-titulo"
        aria-describedby="confirmar-mensaje"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-icono" aria-hidden="true">🗑️</div>
        <h2 id="confirmar-titulo">¿Estás seguro?</h2>
        <p id="confirmar-mensaje">{mensaje}</p>
        <div className="modal-acciones">
          <button type="button" className="btn-secondary" onClick={onCancelar} disabled={cargando} autoFocus>
            Cancelar
          </button>
          <button type="button" className="btn-danger" onClick={onConfirmar} disabled={cargando}>
            {cargando ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </div>
    </div>
  );
}
