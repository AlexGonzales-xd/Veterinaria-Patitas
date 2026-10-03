# Veterinaria Patitas

## Ejecutar el frontend

Requiere Node.js 22.12 o superior.

Desde la carpeta `frontend`:

```sh
npm install
npm run dev
```

Abrir la dirección que indique Vite, normalmente http://localhost:5173.

## Configuración

La aplicación utiliza por defecto la API desplegada:

```text
https://veterinaria-patitas-production.up.railway.app/api
```

Para usar otra dirección, crear `.env.local`:

```env
VITE_API_URL=http://localhost:8080/api
```

La dirección debe terminar en `/api`. Reiniciar Vite después de cambiarla.

## Estructura

- `App.jsx`: sesión y navegación entre secciones.
- `pages/`: formularios y tablas.
- `service/`: consumo de los endpoints del backend.
- `service/ClientService.jsx`: cliente HTTP y manejo de errores.
- `css/`: estilos de la aplicación.

Las pantallas llaman a los servicios, que realizan las peticiones mediante `ClientService`.

El login y el registro utilizan `/api/auth/login` y `/api/auth/register`. La sesión se conserva en el navegador y se elimina al cerrar sesión.

## Compilar

```sh
npm run build
```

Este comando genera `dist/` para publicar el frontend. No se necesita esa carpeta para ejecutar `npm run dev`.

Las dependencias (`node_modules/`), la compilación (`dist/`) y los archivos de configuración local (`.env`, `.env.local`) no se incluyen en Git. `package-lock.json` mantiene las versiones de las dependencias.
