import { useState } from "react";
import { login, register } from "../service/AuthService";
import "../css/Auth.css";

function IconoOjo({ visible }) {
  return visible ? (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function CampoPassword({ id, name, value, onChange, autoComplete }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="password-field">
      <input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        aria-pressed={visible}
        tabIndex={-1}
      >
        <IconoOjo visible={visible} />
      </button>
    </div>
  );
}

export default function AuthPage({ onLogin }) {

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";

  function change(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function switchMode() {
    setMode(isRegister ? "login" : "register");
    setError("");
  }

  function validate() {
    if (!form.username.trim()) return "Ingresa tu usuario.";
    if (form.username.length > 50) return "El usuario no puede pasar de 50 caracteres.";
    if (!form.password) return "Ingresa tu contraseña.";
    if (isRegister) {
      if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Ingresa un correo válido.";
      if (form.password.length < 6) return "La contraseña debe tener al menos 6 caracteres.";
      if (form.password !== form.confirm) return "Las contraseñas no coinciden.";
    }
    return "";
  }

  async function submit(e) {
    e.preventDefault();
    const msg = validate();
    if (msg) return setError(msg);

    setLoading(true);
    setError("");
    try {
      if (isRegister) {
        await register(form.username.trim(), form.email.trim(), form.password);
      }
      const usuario = await login(form.username.trim(), form.password);
      onLogin(usuario);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-panel-izq">
        <div className="sidebar-logo">
          <div className="mark">🐾</div>
          <span className="wordmark">Patitas</span>
        </div>
        <div className="mensaje">
          <h1>{isRegister ? "Cuidamos a los que más quieres" : "Bienvenido a la familia Patitas"}</h1>
          <p>Gestiona las citas, el historial y los datos de tus mascotas desde un solo lugar.</p>
        </div>
        <p className="copy">© Veterinaria Patitas</p>
      </div>

      <div className="auth-panel-der">
        <form className="auth-card" onSubmit={submit} noValidate>
          <div className="sidebar-logo">
            <div className="mark">🐾</div>
            <span className="wordmark">Patitas</span>
          </div>

          <h1>{isRegister ? "Crea tu cuenta" : "Bienvenido de vuelta"}</h1>
          <p className="auth-sub">
            {isRegister
              ? "Regístrate como apoderado para gestionar las citas y el historial de tus mascotas."
              : "Inicia sesión para gestionar las citas y el historial de tus mascotas."}
          </p>

          <label htmlFor="username">Usuario</label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={change}
            autoComplete="username"
            maxLength={50}
          />

          {isRegister && (
            <>
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={change}
                autoComplete="email"
                maxLength={100}
              />
            </>
          )}

          <label htmlFor="password">Contraseña</label>
          <CampoPassword
            id="password"
            name="password"
            value={form.password}
            onChange={change}
            autoComplete={isRegister ? "new-password" : "current-password"}
          />

          {isRegister && (
            <>
              <label htmlFor="confirm">Confirmar contraseña</label>
              <CampoPassword
                id="confirm"
                name="confirm"
                value={form.confirm}
                onChange={change}
                autoComplete="new-password"
              />
            </>
          )}

          {error && <p className="auth-error" role="alert">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Procesando..." : isRegister ? "Crear cuenta" : "Iniciar sesión"}
          </button>

          <p className="auth-switch">
            {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
            <button type="button" className="auth-link" onClick={switchMode} disabled={loading}>
              {isRegister ? "Inicia sesión" : "Regístrate"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
