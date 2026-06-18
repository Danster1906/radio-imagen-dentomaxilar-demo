# Deployment en Neubox

## Paquete listo

Carpeta actual para publicar sitio público:

```text
deploy/neubox-radio-imagen/
```

Incluye:

- `index.html`
- `styles.css`
- `portal.html` como puente temporal si aún no se configura URL externa del portal
- `admin.css` y `app.js` sólo por compatibilidad temporal
- Imágenes públicas y assets de marca en `img/`
- `img/brand/radio-imagen-logo.png`
- `img/brand/radio-imagen-logo-white.png`

## Opción recomendada

Subir el contenido de `deploy/neubox-radio-imagen/` al hosting de Neubox usando cPanel.

Neubox debe funcionar como sitio institucional público. El portal operativo real debe vivir en Replit + Supabase y el botón `Portal doctores` debe apuntar al URL publicado de Replit cuando esté definido.

## Pasos en cPanel

1. Entrar a Neubox.
2. Abrir cPanel del hosting.
3. Ir a `Administrador de archivos`.
4. Entrar a `public_html` o a la carpeta del dominio.
5. Subir los archivos dentro de `deploy/neubox-radio-imagen/`.
6. Confirmar que `index.html` quede directamente dentro de `public_html`, no dentro de una carpeta anidada.
7. Abrir el dominio en el navegador.

## Si ya hay una página publicada

Antes de extraer:

- Descargar respaldo de los archivos actuales.
- Si existe un `index.html` viejo, renombrarlo como `index-backup.html`.
- Extraer el ZIP nuevo.

## Con Supabase después

Este deployment publica el sitio público. Para doctores reales, usar el portal operativo en Replit conectado a Supabase Auth, Postgres y Storage.

La ruta operativa completa está en:

```text
DEPLOY_OPERATIVO_DOCTORES.md
```

## Nota importante

Neubox/cPanel puede publicar el sitio público como estático. El agente local, llaves privadas de Supabase y archivos maestros de estudios no deben subirse a `public_html`.
