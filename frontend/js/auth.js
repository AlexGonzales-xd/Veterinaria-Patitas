// js/auth.js -> cargar con: <script type="module" src="js/auth.js"></script>
const API_URL = import.meta.env.VITE_API_URL; // https://.../api

const loginWrapper = document.getElementById('login-form-wrapper');
const registerWrapper = document.getElementById('register-form-wrapper');

// Si ya hay sesión, no mostrar el login
if (localStorage.getItem('token') || localStorage.getItem('user')) {
    window.location.replace('home.html');
}

document.getElementById('show-register')?.addEventListener('click', (e) => {
    e.preventDefault();
    loginWrapper.classList.remove('active');
    registerWrapper.classList.add('active');
});

document.getElementById('show-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    registerWrapper.classList.remove('active');
    loginWrapper.classList.add('active');
});

// Lee el JSON de error del backend ({"error": "..."})
async function leerError(response) {
    try {
        const data = await response.json();
        return data.error || data.message || JSON.stringify(data);
    } catch {
        return `HTTP ${response.status}`;
    }
}

// LOGIN
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const errorAlert = document.getElementById('login-error');
    errorAlert.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // credentials: 'include', // <- solo si tu backend usa sesión/cookie (ver notas)
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json().catch(() => ({}));

            // Guardamos lo que devuelva el backend
            if (data.token) localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({
                username: data.username || username,
                ...data
            }));
            // Si el backend no devuelve token, igual queda 'user' como marca de sesión

            window.location.href = 'home.html';
        } else {
            const msg = await leerError(response);
            console.error('LOGIN falló:', response.status, msg);
            errorAlert.textContent = response.status === 401 || response.status === 403
                ? 'Usuario o contraseña incorrectos'
                : `Error (${response.status}): ${msg}`;
            errorAlert.style.display = 'block';
        }
    } catch (error) {
        console.error('LOGIN error de red:', error);
        errorAlert.textContent = 'No se pudo conectar con el servidor. Revisa tu conexión o CORS.';
        errorAlert.style.display = 'block';
    }
});

// REGISTRO
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const errorAlert = document.getElementById('register-error');
    const successAlert = document.getElementById('register-success');
    errorAlert.style.display = 'none';
    successAlert.style.display = 'none';

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password, id_rol: 4 })
        });

        if (response.ok) {
            successAlert.textContent = 'Cuenta creada. Ya puedes iniciar sesión.';
            successAlert.style.display = 'block';
            e.target.reset();
        } else {
            const msg = await leerError(response);
            console.error('REGISTRO falló:', response.status, msg);
            errorAlert.textContent = `Error (${response.status}): ${msg}`;
            errorAlert.style.display = 'block';
        }
    } catch (error) {
        console.error('REGISTRO error de red:', error);
        errorAlert.textContent = 'No se pudo conectar con el servidor.';
        errorAlert.style.display = 'block';
    }
});