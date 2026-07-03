# Radio Imagen Dentomaxilar - Portal de doctores

Portal para que doctores y clínicas generen órdenes digitales de estudios radiológicos y Radio Imagen les dé seguimiento operativo (agenda, resultados, programa de puntos "Socios Radio Imagen").

## Arquitectura

- `server.js` — servidor Node.js (sin framework) que sirve `portal.html` y expone el API REST.
- `db.js` — capa de datos sobre la **base PostgreSQL integrada de Replit** (`DATABASE_URL`). Crea las tablas al arrancar y, si están vacías, las siembra desde `data/*.json`.
- `app.js` — frontend en JavaScript vanilla (todas las vistas del portal).
- `portal.html` — SPA: login + vistas de doctor/clínica y de administración.
- `index.html` — página pública informativa.
- `data/` — fixtures de semilla (solo se importan cuando la base está vacía) y archivos subidos temporalmente en `data/uploads/`.

## Tipos de cuenta

- **Personal**: doctor individual; las órdenes quedan a su nombre.
- **Clínica**: al crear una orden elige el doctor tratante de su propia lista (o agrega uno nuevo al vuelo; queda guardado para futuras órdenes). Los puntos de Socios se acumulan a la cuenta clínica.

El admin elige el tipo de cuenta al dar de alta en el panel de administración.

## Seguridad

- Las contraseñas se guardan **hasheadas con scrypt** (`password_hash`); las cuentas antiguas en texto plano se migran automáticamente al arrancar o al iniciar sesión.
- El API nunca devuelve contraseñas; el admin puede asignarlas pero no verlas.
- El token de admin se puede fijar con la variable de entorno `ADMIN_TOKEN` (recomendado en producción, para que sobreviva reinicios/escala); si no existe, se genera uno aleatorio por instancia.

## Archivos de resultados (descarga única)

- El admin sube los archivos (ZIP, DCM, PDF, STL… hasta 2 GB) desde el panel Resultados con arrastrar-y-soltar; la subida va **por fragmentos de 15 MB** con barra de progreso y reintentos, directo al **Object Storage de Replit**.
- El doctor recibe un correo de aviso. **Al completar su descarga, el archivo se elimina del storage** — el almacenamiento nunca se acumula. Si lo necesita de nuevo, usa "Solicitar reenvío" y el admin lo ve marcado en su panel.
- Si una descarga se corta a medias, el archivo NO se borra y se puede reintentar. Las subidas abandonadas se limpian solas a las 24 h.
- Todo el acceso al storage está encapsulado en `storage.js` (5 funciones): migrar a S3/GCS u otro proveedor después es reimplementar solo ese archivo.

## Comandos

```bash
npm start        # arranca el portal en :5000 (inicializa/siembra la BD si hace falta)
npm run migrate  # solo crea tablas + seed (útil antes de deployar)
npm run smoke    # smoke test de UI con Playwright (requiere el servidor corriendo)
npm run backup   # respaldo de la BD con pg_dump → backups/backup-<fecha>.dump
```

## Migración y respaldos

La base es **PostgreSQL estándar** — no hay dependencia de Replit en el esquema:

1. `npm run backup` genera `backups/backup-<fecha>.dump` (correr desde el workspace; los deployments no traen pg_dump).
2. Restaurar en cualquier proveedor (Neon, Supabase, Railway, RDS…): `pg_restore --clean --if-exists -d "$NUEVA_DATABASE_URL" backups/backup-....dump`.
3. La app solo necesita que cambie la variable `DATABASE_URL` (más SMTP_* y PORTAL_URL si aplican).

Los archivos de resultados NO forman parte del respaldo: son temporales por diseño (se eliminan al descargarse).

## Documentación

- `PDR_RADIO_IMAGEN.md`: definición funcional del producto.
- `PDR_CAMBIOS.md`: registro de cambios de producto.
- `LOGICA_INFORMACION.md`: lógica de datos, permisos y seguimiento.
- `LOGICA_PUNTOS_SOCIOS.md`: reglas de puntos, niveles y auditoría del programa de socios.
- `REPLIT_DEPLOYMENT.md`: guía para publicar el portal en Replit.
- `DEPLOY_OPERATIVO_DOCTORES.md`: ruta para iniciar operación real con doctores.
- `DATA_MODEL.md`: estructura escalable de base de datos (referencia).

## Pendientes conocidos

- Los archivos de resultados se guardan en disco (`data/uploads/`), que es efímero en el deployment autoscale: si la instancia se reinicia entre la subida y la descarga, el archivo se pierde. El siguiente paso es moverlos al Object Storage de Replit (bucket ya configurado en `.replit`).
- Los endpoints de doctor no exigen sesión (mismo modelo que la versión anterior); conviene agregar tokens de sesión.
