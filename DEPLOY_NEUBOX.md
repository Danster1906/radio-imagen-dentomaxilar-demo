# Deployment en Neubox

## Paquete listo

Archivo generado:

```text
deploy/radio-imagen-operativo-v1.zip
```

Incluye:

- `index.html`
- `styles.css`
- `admin.css`
- `app.js`
- `img/clinic-scanner.png`
- `img/doctor-xray.png`
- `img/brand/radio-imagen-logo.png`
- `img/brand/radio-imagen-logo-white.png`

## Opción recomendada

Subir este ZIP al hosting de Neubox usando cPanel y extraerlo en `public_html` o en la carpeta raíz del dominio/subdominio.

## Pasos en cPanel

1. Entrar a Neubox.
2. Abrir cPanel del hosting.
3. Ir a `Administrador de archivos`.
4. Entrar a `public_html` o a la carpeta del dominio.
5. Subir `deploy/radio-imagen-operativo-v1.zip`.
6. Seleccionar el ZIP y usar `Extraer`.
7. Confirmar que `index.html` quede directamente dentro de `public_html`, no dentro de una carpeta anidada.
8. Abrir el dominio en el navegador.

## Si ya hay una página publicada

Antes de extraer:

- Descargar respaldo de los archivos actuales.
- Si existe un `index.html` viejo, renombrarlo como `index-backup.html`.
- Extraer el ZIP nuevo.

## Con Supabase después

Este deployment publica el frontend exacto del MVP actual.

Para doctores reales, no basta con subir el HTML. Hay que conectar Supabase Auth, Postgres y Storage para que cada doctor tenga su cuenta y sus datos persistan.

La conexión real a Supabase se puede hacer después sin cambiar el hosting:

- Supabase Auth para login.
- Supabase Postgres para doctores, órdenes, resultados y socios.
- Supabase Storage privado para archivos temporales.
- Subida manual de resultados o agente local como apoyo.

La ruta operativa completa está en:

```text
DEPLOY_OPERATIVO_DOCTORES.md
```

## Nota importante

Neubox/cPanel puede publicar este MVP como sitio estático. El agente local y las llaves privadas de Supabase no deben subirse a `public_html`.
