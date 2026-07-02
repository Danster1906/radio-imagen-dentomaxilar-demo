# Radio Imagen Dentomaxilar — Portal de doctores

Portal para que doctores generen órdenes digitales y Radio Imagen pueda darles seguimiento operativo.

- Login de doctores y administrador (el login es la página principal).
- Panel del doctor con métricas y programa de socios.
- Captura de orden digital y selección de estudios.
- Consulta y descarga de resultados.
- Panel de administración (órdenes, doctores, subida de resultados).

## Arquitectura

- `portal.html` — única página de la app (login + SPA de vistas).
- `app.js` — lógica del cliente (vanilla JS, sin framework).
- `styles.css` / `admin.css` — estilos.
- `server.js` — servidor Node (sin dependencias de framework): archivos estáticos + API JSON en `/api/*`.
- `data/` — persistencia en archivos JSON (`doctors.json`, `orders.json`, `partner-events.json`) y `data/uploads/`.
- `local-agent/` — agente local Node.js para subir resultados bajo demanda.
- `supabase/` y `database/schema.sql` — artefactos del backend Supabase propuesto (no activo en el frontend actual).

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

- `DATA_MODEL.md` — estructura escalable de base de datos.
- `REPLIT_DEPLOYMENT.md` — guía para publicar el portal en Replit.
