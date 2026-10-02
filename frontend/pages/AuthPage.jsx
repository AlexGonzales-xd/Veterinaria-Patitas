import { useState } from "react";
import { login, register } from "../service/AuthService";
import "../css/auth.css";

export default function AuthPage({ onSuccess }) {
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
    if (!form.password) return "Ingresa tu contrasena.";
    if (isRegister) {
      if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Ingresa un correo valido.";
      if (form.password.length < 6) return "La contrasena debe tener al menos 6 caracteres.";
      if (form.password !== form.confirm) return "Las contrasenas no coinciden.";
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
      const user = await login(form.username.trim(), form.password);
      onSuccess?.(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-wrap">
      <form className="auth-card" onSubmit={submit} noValidate>
        <h1>{isRegister ? "Crear cuenta" : "Iniciar sesion"}</h1>
        <p className="auth-sub">Veterinaria Patitas</p>

        <label htmlFor="username">Usuario</label>
        <input id="username" name="username" value={form.username} onChange={change}
          autoComplete="username" maxLength={50} />

        {isRegister && (
          <>
            <label htmlFor="email">Correo</label>
            <input id="email" name="email" type="email" value={form.email} onChange={change}
              autoComplete="email" maxLength={100} />
          </>
        )}

        <label htmlFor="password">Contrasena</label>
        <input id="password" name="password" type="password" value={form.password} onChange={change}
          autoComplete={isRegister ? "new-password" : "current-password"} />

        {isRegister && (
          <>
            <label htmlFor="confirm">Repetir contrasena</label>
            <input id="confirm" name="confirm" type="password" value={form.confirm} onChange={change}
              autoComplete="new-password" />
          </>
        )}

        {error && <p className="auth-error" role="alert">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Procesando..." : isRegister ? "Registrarme" : "Entrar"}
        </button>

        <p className="auth-switch">
          {isRegister ? "Ya tienes cuenta?" : "No tienes cuenta?"}{" "}
          <button type="button" className="auth-link" onClick={switchMode}>
            {isRegister ? "Inicia sesion" : "Registrate"}
          </button>
        </p>
      </form>
    </main>
  );
}