# Migración de la base de datos PostgreSQL, paso a paso

> Instrucciones detalladas para copiar TODA la información del portal (doctores,
> contraseñas, órdenes, puntos, fotos de perfil) desde la base de Replit hacia una
> base nueva en otro proveedor. Escrito para seguirse comando por comando, sin
> experiencia previa. Es la versión ampliada de la Fase 1 de
> `PLAN_MIGRACION_HOSTING.md`.

---

## Antes de empezar: cómo pensar esta migración

La base de datos es como un archivero. Migrarla son 3 movimientos:

1. **Fotocopiar todo el archivero** (respaldo / "dump").
2. **Vaciar la fotocopia en el archivero nuevo** (restaurar / "restore").
3. **Contar los expedientes en ambos** para confirmar que no falta ninguno (verificar).

Nada de esto borra la base original. Si algo sale mal, la base de Replit sigue
intacta y se puede intentar de nuevo las veces que haga falta.

**Tiempo estimado**: 30-60 minutos la primera vez (la mayoría es preparación; la
copia real tarda segundos con el tamaño actual de datos).

---

## Paso 0. Lo que necesitas tener a la mano

1. **La dirección de la base actual (origen)**. En Replit: abre tu Repl →
   herramienta "Secrets" (candado) → copia el valor de `DATABASE_URL`.
   Se ve así (una sola línea larga):

   ```
   postgresql://usuario:contraseña@ep-algo-123.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

2. **La dirección de la base nueva (destino)**. La da el proveedor nuevo al crear
   la base (en Railway: pestaña de la base → "Connect" → "Postgres Connection URL";
   en Neon: botón "Connection string"). Tiene el mismo formato.

3. **Dónde correr los comandos**. La opción más simple: la **Shell de Replit**
   (pestaña "Shell" en tu Repl), porque ya tiene las herramientas `pg_dump`,
   `pg_restore` y `psql` instaladas y ya conoce la base origen. Todos los pasos
   siguientes asumen que estás ahí.

> Consejo: pega las dos direcciones en un archivo de notas temporal, etiquetadas
> "ORIGEN" y "DESTINO". El error más común de toda la migración es confundirlas.
> Regla de oro: **pg_dump usa la ORIGEN, pg_restore usa la DESTINO.**

---

## Paso 1. Hacer el respaldo (fotocopia) de la base actual

En la Shell de Replit, escribe:

```bash
npm run backup
```

**Qué hace**: ejecuta `pg_dump` contra la base actual y crea un archivo
`backups/backup-<fecha>.dump` con TODO el contenido: tablas, doctores,
contraseñas (ya cifradas, siguen funcionando tal cual), órdenes, puntos, fotos.

**Qué debes ver**: una línea que dice dónde quedó el archivo, por ejemplo:

```
Respaldo creado: backups/backup-2026-07-13.dump
```

**Verifica que el archivo existe y pesa algo**:

```bash
ls -lh backups/
```

Debes ver el archivo con un tamaño mayor a 0 (típicamente entre 50 KB y algunos MB).
Si pesa 0 o el comando falló, no continúes: revisa que `DATABASE_URL` exista en
los Secrets.

> Alternativa sin `npm run backup` (hace lo mismo, por si el script fallara):
>
> ```bash
> pg_dump -Fc "$DATABASE_URL" > backups/respaldo-manual.dump
> ```

---

## Paso 2. Restaurar el respaldo en la base nueva

Primero guarda la dirección de la base DESTINO en una variable temporal (así el
comando largo queda legible). Pega tu URL real entre las comillas:

```bash
DESTINO="postgresql://usuario:contraseña@host-nuevo/basededatos?sslmode=require"
```

Ahora vacía la fotocopia en el archivero nuevo (ajusta el nombre del archivo al
que viste en el Paso 1):

```bash
pg_restore --clean --if-exists --no-owner -d "$DESTINO" backups/backup-2026-07-13.dump
```

**Qué significa cada parte** (por si quieres entenderla, no memorizarla):

- `--clean --if-exists`: si ya habías intentado antes y quedaron tablas a medias
  en el destino, las quita primero. Hace el comando repetible sin miedo.
- `--no-owner`: ignora el "dueño" de las tablas del sistema viejo (el usuario de
  la base nueva será el dueño). Sin esto suelen salir errores de permisos.
- `-d "$DESTINO"`: a dónde va la información. **Siempre la base NUEVA aquí.**

**Qué debes ver**: normalmente el comando termina **en silencio** (sin mensajes =
todo bien). Es normal ver 1-2 avisos tipo `warning` sobre "public schema" — se
ignoran. Lo que NO es normal: errores rojos de `connection refused` (URL mal
copiada) o `authentication failed` (contraseña mal copiada).

---

## Paso 3. Verificar que no falta nada

Cuenta los registros en AMBAS bases y compara. Primero la origen:

```bash
psql "$DATABASE_URL" -c "SELECT 'doctores' AS tabla, count(*) FROM accounts UNION ALL SELECT 'ordenes', count(*) FROM orders UNION ALL SELECT 'puntos', count(*) FROM partner_events UNION ALL SELECT 'archivos', count(*) FROM files_index;"
```

Luego exactamente lo mismo contra la destino:

```bash
psql "$DESTINO" -c "SELECT 'doctores' AS tabla, count(*) FROM accounts UNION ALL SELECT 'ordenes', count(*) FROM orders UNION ALL SELECT 'puntos', count(*) FROM partner_events UNION ALL SELECT 'archivos', count(*) FROM files_index;"
```

**Qué debes ver**: dos tablitas con los mismos números. Ejemplo:

```
  tabla   | count
----------+-------
 doctores |    14
 ordenes  |    87
 puntos   |    52
 archivos |    31
```

Si los números coinciden, la migración de datos está completa. Si no coinciden,
repite el Paso 2 (es seguro repetirlo: `--clean` empieza de cero).

**Prueba final de fuego**: apunta la app a la base nueva y entra de verdad.
En el proveedor nuevo configura la variable `DATABASE_URL` con la dirección
DESTINO, arranca la app, e inicia sesión con tu cuenta admin y con un doctor
real. Si el login funciona, las contraseñas migraron bien (viajan cifradas
dentro del respaldo, no hay que hacerles nada).

---

## Errores comunes y qué hacer

| Error que ves | Qué significa | Solución |
| --- | --- | --- |
| `pg_dump: command not found` | Esa terminal no tiene las herramientas de Postgres | Corre los comandos desde la Shell de Replit, o instala Postgres en tu Mac (`brew install libpq`) |
| `connection refused` / `could not translate host name` | URL mal copiada (le falta un pedazo) | Vuelve a copiar la URL completa, revisa que no se cortara |
| `password authentication failed` | Contraseña incorrecta dentro de la URL | Copia la URL de nuevo desde el panel del proveedor (no la escribas a mano) |
| `SSL connection is required` | Al proveedor le falta el parámetro de seguridad | Agrega `?sslmode=require` al final de la URL |
| `permission denied for schema public` | El usuario de la URL no puede crear tablas | Usa la URL del usuario "owner"/admin que da el proveedor, no una de solo lectura |
| Números no coinciden en el Paso 3 | Restauración a medias | Repite el Paso 2 completo; `--clean` limpia y vuelve a empezar |

---

## Después de migrar

- **No borres la base de Replit todavía.** Déjala 1-2 semanas como respaldo vivo.
- Las **sesiones activas no se migran a propósito**: cada doctor solo vuelve a
  iniciar sesión una vez. Sus contraseñas son las mismas.
- Los **archivos de resultados pendientes** viven en el Object Storage, no en la
  base — eso se maneja aparte (ver Fase 2 de `PLAN_MIGRACION_HOSTING.md`).
- Programa un **respaldo periódico** en el destino: correr `npm run backup` cada
  semana, o activar los respaldos automáticos si el proveedor los ofrece
  (Railway/Neon los incluyen).
- La app crea sola cualquier tabla o columna que le falte al arrancar
  (`initDb()` en `db.js`), así que una base destino "atrasada" se pone al día
  automáticamente con el primer arranque.
