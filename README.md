# Radio Imagen Dentomaxilar — Portal de doctores

Portal para que doctores generen órdenes digitales y Radio Imagen pueda darles seguimiento operativo.

- Login de doctores y administrador (el login es la página principal).
- Panel del doctor con métricas y programa de socios.
- Captura de orden digital y selección de estudios.
- Consulta y descarga de resultados.
- Panel de administración (órdenes, doctores, subida de resultados).
- Cuentas de clínica con varios dentistas bajo un mismo perfil (los puntos se comparten).

## Arquitectura

- `portal.html` — única página de la app (login + SPA de vistas).
- `js/` — lógica del cliente en módulos ES (vanilla JS, sin framework; `js/main.js` es el punto de entrada).
- `styles.css` / `admin.css` — estilos (tokens de diseño compartidos en `:root` de `styles.css`).
- `server.js` — servidor Node (sin dependencias de framework): archivos estáticos + API JSON en `/api/*`.
- `data/` — persistencia en archivos JSON (`doctors.json`, `orders.json`, `partner-events.json`), `data/uploads/` y `data/avatars/`.

## Uso local

```bash
npm start
```

Abre `http://localhost:5000` (el login es la página inicial).

## Credenciales

- Las contraseñas de doctores se guardan como hash `scrypt` en `data/doctors.json` (los valores legados en texto plano se migran automáticamente al iniciar sesión).
- Credenciales de administrador: configura `ADMIN_EMAIL` y `ADMIN_PASSWORD` como secretos del entorno. Sin ellos, el servidor usa `data/doctors.json` como respaldo y muestra una advertencia al arrancar.
- Notificaciones por correo: configura `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (opcional).

## Documentación

- `REPLIT_DEPLOYMENT.md` — guía para publicar el portal en Replit.
