# Deployment en Replit

## Arquitectura

```text
Replit
-> Portal web del doctor (portal.html + js/)
-> server.js: archivos estáticos + API JSON (/api/*)
-> Persistencia en data/*.json, data/uploads/ y data/avatars/
```

## Qué aloja Replit

- `portal.html` (el login es la página principal; `/` la sirve directamente)
- `styles.css`, `admin.css`, `js/`, `img/`
- `server.js` (API y estáticos)
- `data/` (persistencia JSON, uploads y avatares)

## Ejecución

```bash
npm start
```

El servidor escucha en `PORT` (por defecto 5000; `.replit` mapea 5000 → 80).

## Secretos del entorno

Configura en Replit Secrets:

- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — credenciales del administrador (sin ellos el servidor usa `data/doctors.json` como respaldo y advierte al arrancar).
- `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` — opcional, para notificaciones por correo al subir resultados.
- `PORTAL_URL` — opcional, URL pública usada en los correos.

## Tipo de deployment

```text
Autoscale Deployment
```

Motivo: ejecuta `server.js` (la API JSON y las subidas de archivos lo requieren). Un Static Deployment NO funciona porque no ejecuta el servidor.

> Nota: el disco de `data/` es efímero entre redeploys de Autoscale; los JSON, uploads y avatares viven mientras la instancia exista.
