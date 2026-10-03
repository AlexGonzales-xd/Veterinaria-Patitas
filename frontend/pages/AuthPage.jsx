import { useState } from "react";
import { login, register } from "../service/AuthService";
import "../css/Auth.css";

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
    <main className="auth-wrap">
      <form className="auth-card" onSubmit={submit} noValidate>
        <h1>{isRegister ? "Crear cuenta" : "Iniciar sesión"}</h1>
        <p className="auth-sub">Veterinaria Patitas</p>

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
            <label htmlFor="email">Correo</label>
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
        <input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={change}
          autoComplete={isRegister ? "new-password" : "current-password"}
        />

        {isRegister && (
          <>
            <label htmlFor="confirm">Repetir contraseña</label>
            <input
              id="confirm"
              name="confirm"
              type="password"
              value={form.confirm}
              onChange={change}
              autoComplete="new-password"
            />
          </>
        )}

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Procesando..." : isRegister ? "Registrarme" : "Entrar"}
        </button>

        <p className="auth-switch">
          {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button type="button" className="auth-link" onClick={switchMode} disabled={loading}>
            {isRegister ? "Inicia sesión" : "Regístrate"}
          </button>
        </p>
      </form>
    </main>
  );
}