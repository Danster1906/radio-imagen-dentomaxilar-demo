# Deployment en Replit

## Arquitectura

```text
Replit
-> Portal web del doctor (portal.html + app.js)
-> server.js: archivos estáticos + API JSON (/api/*)
-> Persistencia en data/*.json

Computadora local Radio Imagen
-> Archivos maestros por 3 meses
-> Agente local (local-agent/)
-> Sube archivos solo bajo demanda
```

## Qué aloja Replit

- `portal.html` (el login es la página principal; `/` la sirve directamente)
- `styles.css`, `admin.css`, `app.js`, `img/`
- `server.js` (API y estáticos)
- `data/` (persistencia JSON y uploads)

## Qué NO va en Replit

- Llaves privadas (p. ej. `SUPABASE_SERVICE_ROLE_KEY`).
- Archivos pesados de estudios.
- El agente local con acceso al disco de Radio Imagen.

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

## Flujo de descarga

```text
Doctor entra al portal
-> click Solicitar descarga
-> se crea la solicitud en el servidor
-> agente local la procesa y sube el archivo
-> doctor descarga desde el portal
```

## Agente local

```bash
cd local-agent
npm install
cp .env.example .env
npm run once
npm start
```

El agente local no depende de Replit para acceder al disco local; Replit solo publica solicitudes que el agente procesa.
