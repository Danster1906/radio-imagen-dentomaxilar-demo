# Deployment en Replit

> Esta guía refleja la arquitectura **real** del proyecto. Reemplaza a versiones anteriores
> que describían un stack con Supabase y un "agente local"; ese diseño fue descartado.

## Arquitectura real

```text
Replit (una sola app Node)
-> server.js  : servidor HTTP nativo (sin framework), sirve portal.html y el API REST
-> db.js      : PostgreSQL integrado de Replit (DATABASE_URL)
-> storage.js : Object Storage de Replit para los archivos de resultados
```

No hay Supabase, ni Edge Functions, ni agente local. Todo corre dentro de la misma app de Replit.

## Qué contiene el proyecto

Archivos que se publican y ejecutan en Replit:

- `server.js` — servidor y API (punto de entrada).
- `db.js` — capa de datos (PostgreSQL).
- `storage.js` — capa de Object Storage.
- `portal.html` — único HTML; el servidor lo entrega en la raíz `/`.
- `app.js`, `styles.css`, `admin.css` — frontend.
- `data/*.json` — fixtures de semilla (solo se importan si la base está vacía).
- `.replit`, `package.json` — configuración y scripts.

> No es un Static Deployment: la app **ejecuta `server.js`** (Node). Usa **Autoscale Deployment**.

## Ejecución

Comando de arranque (definido en `package.json` y `.replit`):

```bash
npm start
```

Puertos (según `.replit`):

- **Puerto principal: `5000`** → se expone como `externalPort 80` en producción.
- `8003` es solo un puerto **alternativo de desarrollo local** (fallback); no se usa en el deployment.

En producción Replit define la variable `PORT` automáticamente y el servidor la respeta (`server.js`).

## Variables de entorno

El código lee estas variables (ninguna de Supabase):

| Variable | Uso | ¿Obligatoria? |
| --- | --- | --- |
| `DATABASE_URL` | Conexión a PostgreSQL de Replit | Sí (la app no arranca sin ella) |
| `ADMIN_TOKEN` | Token fijo de administrador (recomendado en producción para que sobreviva reinicios) | Recomendada |
| `SMTP_HOST` / `SMTP_USER` / `SMTP_PASS` | Envío de correos de aviso de resultados | Opcional (sin ellas, se omite el correo) |
| `PORTAL_URL` | URL base del portal usada en los correos | Opcional |
| `PORT` | Puerto de escucha (lo define Replit en deploy) | La define Replit |

El Object Storage usa el bucket configurado en `.replit` bajo `[objectStorage]` (`defaultBucketID`).

## Pasos para desplegar

1. Abrir Replit e importar desde GitHub:
   `https://github.com/Danster1906/radio-imagen-dentomaxilar-demo`
2. Asegurar que exista la base de datos PostgreSQL de Replit (variable `DATABASE_URL` presente).
3. Configurar `ADMIN_TOKEN` (y `SMTP_*` / `PORTAL_URL` si se quieren correos) en los Secrets de Replit.
4. Presionar `Run`: al arrancar, `initDb()` crea las tablas y, si la base está vacía, siembra desde `data/*.json`.
5. Abrir el preview: la raíz `/` muestra `portal.html`.
6. Crear el deployment como **Autoscale Deployment**.

## Flujo real de resultados (subida y descarga)

```text
Admin (panel Resultados)
-> arrastra el archivo (ZIP/DCM/PDF/STL… hasta 2.5 GB)
-> subida por fragmentos de 15 MB directo al Object Storage de Replit
-> se registra en files_index; se envía correo de aviso al doctor (si hay SMTP)

Doctor
-> descarga el archivo (descarga de un solo uso)
-> al completar la descarga, el objeto se elimina del storage
-> si lo necesita otra vez, usa "Solicitar reenvío" y el admin lo ve marcado
```

Los archivos de resultados son temporales por diseño y **no** forman parte de los respaldos de la base.

## Comandos útiles

```bash
npm start        # arranca la app en :5000 (inicializa/siembra la BD)
npm run migrate  # solo crea tablas + seed (útil antes de deployar)
npm run smoke    # smoke test de UI con Playwright (requiere el servidor corriendo)
npm run backup   # respaldo de la BD con pg_dump → backups/backup-<fecha>.dump
```

## Respaldos y portabilidad

La base es PostgreSQL estándar (sin dependencias del esquema hacia Replit):

1. `npm run backup` genera `backups/backup-<fecha>.dump` (correr desde el workspace).
2. Restaurar en cualquier proveedor: `pg_restore --clean --if-exists -d "$NUEVA_DATABASE_URL" backups/backup-....dump`.
3. Para mover la app basta con cambiar `DATABASE_URL` (más `SMTP_*` / `PORTAL_URL` si aplican) y reimplementar `storage.js` si se cambia de proveedor de Object Storage.
