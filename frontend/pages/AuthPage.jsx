import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, register } from "../service/AuthService";

export default function AuthPage() {
  const navigate = useNavigate();
  const [modoRegistro, setModoRegistro] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);
    try {
      if (modoRegistro) {
        await register(form.username, form.email, form.password);
        await login(form.username, form.password);
      } else {
        await login(form.username, form.password);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{modoRegistro ? "Crear cuenta" : "Iniciar sesión"}</h2>

      <input name="username" placeholder="Usuario" value={form.username} onChange={handleChange} required />

      {modoRegistro && (
        <input type="email" name="email" placeholder="Correo" value={form.email} onChange={handleChange} required />
      )}

      <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" disabled={cargando}>
        {cargando ? "Procesando..." : modoRegistro ? "Registrarme" : "Ingresar"}
      </button>

      <p>
        <button type="button" onClick={() => setModoRegistro(!modoRegistro)}>
          {modoRegistro ? "Ya tengo cuenta" : "Crear una cuenta"}
        </button>
      </p>
    </form>
  );
}