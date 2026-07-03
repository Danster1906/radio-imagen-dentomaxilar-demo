# Agente local Radio Imagen

Este agente corre en la computadora/servidor local de Radio Imagen.

Su trabajo:

1. Revisar solicitudes de descarga en Supabase.
2. Buscar el archivo en disco local.
3. Subirlo temporalmente a Supabase Storage.
4. Crear un signed URL.
5. Actualizar la solicitud para que el doctor pueda descargar.
6. Borrar archivos temporales de nube cuando expiren o ya fueron descargados.

## Instalación

Desde esta carpeta:

```bash
npm install
cp .env.example .env
```

Edita `.env`:

```text
SUPABASE_URL=https://TU-PROYECTO.supabase.co
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY
SUPABASE_STORAGE_BUCKET=result-temp
LOCAL_RESULTS_ROOT=/Users/radioimagen/Resultados
```

Importante:

```text
SUPABASE_SERVICE_ROLE_KEY nunca debe estar en Replit ni en el frontend público.
```

## Probar una vez

```bash
npm run once
```

## Correr permanentemente

```bash
npm start
```

## Cómo dejarlo corriendo en macOS

Para MVP, puede correr en una Terminal abierta.

Para producción local, conviene configurarlo como servicio con `launchd`, `pm2`, o un proceso administrado por el equipo técnico.

## Requisitos de datos

La base en Supabase debe tener:

- `result_files`
- `download_requests`

Y el bucket privado:

```text
result-temp
```

## Seguridad

El agente bloquea archivos fuera de:

```text
LOCAL_RESULTS_ROOT
```

Esto evita que una ruta mal escrita o maliciosa intente subir archivos fuera de la carpeta de resultados.
