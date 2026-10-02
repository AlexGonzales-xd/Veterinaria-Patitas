const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function http(path, { method = "GET", body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || `Error ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}º