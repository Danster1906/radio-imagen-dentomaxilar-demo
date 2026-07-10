# Plan de migración: salir de Replit a hosting propio

> Guía para mover el portal completo (app + base de datos + archivos de resultados)
> de Replit a un proveedor propio, sin perder información y con posibilidad de
> regresar si algo falla. Escrito para ejecutarse el día que se decida; no hay que
> hacer nada de esto mientras Replit siga funcionando bien.

## 1. Qué nos ata a Replit hoy (y qué no)

La app es Node.js estándar sin framework. Casi todo es portable tal cual:

| Pieza | ¿Atada a Replit? | Qué se necesita en el destino |
| --- | --- | --- |
| `server.js` (API + estáticos) | No | Cualquier host con Node 20+ |
| `db.js` (PostgreSQL vía `pg`) | No (el esquema es Postgres estándar) | Cualquier Postgres 14+ |
| `storage.js` (archivos de resultados) | **Sí** (`@replit/object-storage`) | Reescribir este único archivo contra S3 u otro proveedor |
| Correos (nodemailer + SMTP) | No | Las mismas variables `SMTP_*` |
| Frontend (`portal.html`, `app.js`, CSS) | No | Lo sirve el mismo `server.js` |

Solo hay **dos piezas reales de migración**: la base de datos (mover los datos) y
el object storage (reescribir `storage.js`, que ya está aislado en 5 funciones
justo para esto).

Punto a favor del diseño actual: los archivos de resultados son **temporales por
diseño** (descarga única, se borran al descargarse). En cualquier momento dado el
storage solo tiene los estudios pendientes de descarga, así que casi no hay
archivos históricos que mover.

## 2. Arquitectura destino equivalente

```text
Hoy (Replit)                          Destino (hosting propio)
──────────────                        ────────────────────────
Replit Autoscale (Node)          →    Host Node (Railway/Render/Fly/VPS)
Replit PostgreSQL (Neon)         →    Postgres gestionado (Neon/Supabase/RDS) o en el VPS
Replit Object Storage (GCS)      →    S3 compatible (Cloudflare R2/Backblaze B2/AWS S3)
Secrets de Replit                →    Variables de entorno del host
URL *.replit.app                 →    Dominio propio + HTTPS del host
```

## 3. Opciones de destino

### Hosting de la app

| Opción | Pros | Contras | Costo aprox. |
| --- | --- | --- | --- |
| **Railway** (recomendada) | Muy parecido a Replit (deploy desde GitHub, Postgres integrado, cero servidores que administrar) | Menos control fino | ~5-10 USD/mes |
| Render | Similar a Railway, plan gratuito con limitaciones | La instancia gratis se duerme | 0-7 USD/mes |
| Fly.io | Buen control, regiones cercanas a México | Más configuración (Dockerfile) | ~5 USD/mes |
| VPS (Hetzner/DigitalOcean) | Control total, precio fijo | Tú administras SO, seguridad, respaldos, HTTPS | 5-12 USD/mes |

Recomendación: **Railway** como primer destino (menor fricción, Postgres y deploy
desde GitHub incluidos). VPS solo si se quiere control total y hay quien lo
administre.

### Base de datos

- **Neon** (es lo que Replit usa por debajo; migrar ahí es casi transparente).
- Postgres de Railway/Render (integrado al hosting, un proveedor menos).
- Supabase Postgres (si además se quisiera su panel).

Cualquiera funciona: el esquema no usa nada específico de Replit.

### Object storage (para `storage.js`)

- **Cloudflare R2** (recomendada: API S3, sin costo de salida de datos, 10 GB gratis).
- Backblaze B2 (muy barato, API S3).
- AWS S3 (estándar, algo más caro).

## 4. Migración paso a paso

### Fase 0. Preparación (sin tocar producción)

1. Crear cuenta en el hosting elegido y proyecto vacío conectado al repo de GitHub.
2. Crear la base Postgres destino y anotar su `DATABASE_URL`.
3. Crear el bucket S3/R2 destino y anotar credenciales (endpoint, access key, secret, bucket).
4. Reescribir `storage.js` contra S3 manteniendo el mismo contrato de 5 funciones
   (`putObjectStream`, `getObjectStream`, `listKeys`, `deletePrefix`, `objectExists`)
   con `@aws-sdk/client-s3` + `@aws-sdk/lib-storage`. Nada más del código cambia:
   `server.js` no se toca.
5. Probar en local: `DATABASE_URL` apuntando a la base destino vacía +
   credenciales S3 → `npm start`, crear orden, subir resultado, descargarlo.
6. Configurar en el host las variables: `DATABASE_URL`, `ADMIN_TOKEN`, `SMTP_HOST`,
   `SMTP_USER`, `SMTP_PASS`, `PORTAL_URL` (la URL nueva), más las nuevas de S3
   (`S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`).

### Fase 1. Migrar la base de datos

Desde la Shell de Replit (o cualquier máquina con acceso a ambas bases):

```bash
# 1) Respaldo completo de la base actual
npm run backup            # genera backups/backup-<fecha>.dump (usa pg_dump)

# 2) Restaurar en la base destino
pg_restore --clean --if-exists --no-owner \
  -d "$DATABASE_URL_DESTINO" backups/backup-<fecha>.dump

# 3) Verificar conteos en ambas bases (deben coincidir)
psql "$DATABASE_URL_ORIGEN"  -c "SELECT count(*) FROM accounts; SELECT count(*) FROM orders;"
psql "$DATABASE_URL_DESTINO" -c "SELECT count(*) FROM accounts; SELECT count(*) FROM orders;"
```

Se migran completos: cuentas y contraseñas (ya hasheadas, siguen funcionando),
órdenes, historial de puntos, índice de archivos, fotos de perfil e intereses de
Consulta plus. Las sesiones activas no importa perderlas: los doctores vuelven a
iniciar sesión.

### Fase 2. Migrar archivos pendientes del storage

Solo existen los resultados aún no descargados. Dos caminos:

- **Camino simple (recomendado)**: elegir un momento de corte con pocos pendientes.
  Avisar a los doctores con estudios listos que descarguen antes del cambio; lo que
  quede, el admin lo vuelve a subir en el sistema nuevo (la subida re-crea el
  archivo en el bucket nuevo).
- **Camino técnico**: script puntual que lea cada entrada de `files_index` con
  `storagePrefix` activo, baje los fragmentos del storage de Replit y los suba al
  bucket S3 con las mismas claves. Solo vale la pena si hay muchos pendientes.

### Fase 3. Corte (cutover)

Elegir un horario de poco uso (por ejemplo, domingo en la noche):

1. **Congelar**: avisar al admin que no suba resultados durante la ventana.
2. Backup final + restore (Fase 1 de nuevo; tarda minutos porque ya se ensayó).
3. Verificar la app nueva con el checklist de la sección 5.
4. **Apuntar el acceso**: actualizar el enlace del botón "Portal" en la landing de
   Neubox hacia la URL nueva (o cambiar el DNS si se usa dominio propio).
5. Dejar Replit encendido pero **avisado como solo lectura** durante 1-2 semanas
   por si hay que consultar algo; después, apagarlo.

### Fase 4. Dominio propio (opcional pero recomendado)

1. Registrar/usar subdominio, por ejemplo `portal.radioimagendentomaxilar.com`.
2. Apuntarlo al host (CNAME); Railway/Render/Fly dan HTTPS automático.
3. Actualizar `PORTAL_URL` (se usa en los correos de aviso) y el enlace en Neubox.

## 5. Checklist de verificación post-migración

- [ ] Login de doctor y de admin funcionan.
- [ ] Un doctor ve solo sus órdenes; el admin las ve todas.
- [ ] Crear una orden nueva de prueba y verla aparecer en el admin.
- [ ] Cambiar el estado de una orden como admin.
- [ ] Subir un archivo de resultado (prueba la escritura al bucket nuevo).
- [ ] Descargarlo como doctor y confirmar que se elimina tras la descarga.
- [ ] Llega el correo de aviso (si SMTP está configurado).
- [ ] Foto de perfil: subir y recargar (prueba la columna photo en la base nueva).
- [ ] Conteos de `accounts` y `orders` coinciden con el respaldo.
- [ ] Programar respaldo periódico en el destino (`npm run backup` con cron del
      host, o los respaldos automáticos del Postgres gestionado).

## 6. Plan de rollback

Si algo falla en las primeras horas: volver a apuntar el enlace del portal a la
URL de Replit (que sigue encendida con los datos del momento del corte). Lo único
que se perdería son las órdenes creadas en el sistema nuevo durante la ventana;
por eso el corte se hace en horario de poco uso y se verifica el checklist antes
de anunciar el cambio.

## 7. Costo estimado del escenario recomendado

| Servicio | Costo mensual aprox. |
| --- | --- |
| Railway (app + Postgres) | 5-10 USD |
| Cloudflare R2 (storage) | 0 USD (bajo el nivel gratuito con archivos temporales) |
| Dominio (si aplica) | ~1 USD prorrateado |
| **Total** | **~6-11 USD/mes** |

Comparable al costo de Replit, con la diferencia de que ninguna pieza queda atada
a un proveedor: Postgres estándar + API S3 se pueden mover de nuevo a cualquier
lado con este mismo plan.
