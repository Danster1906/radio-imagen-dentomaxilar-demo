# Configuración de Supabase como almacenamiento temporal

## Objetivo

Usar la computadora/servidor local de Radio Imagen como almacenamiento principal y Supabase Storage como puente temporal de descarga.

```text
Servidor local Radio Imagen
-> guarda archivos maestros por 3 meses
-> doctor solicita descarga
-> agente local sube archivo temporal a Supabase
-> Supabase genera link firmado
-> doctor descarga
-> archivo temporal se borra
```

## Principio de seguridad

El doctor nunca debe descargar directo desde la computadora local.

La app tampoco debe exponer:

- Ruta local del archivo.
- IP del servidor local.
- `service_role key` de Supabase.
- Carpetas compartidas del CPU.

El frontend solo debe llamar una API segura.

## Componentes necesarios

### 1. Supabase

Crear:

- Proyecto Supabase.
- Bucket privado para archivos temporales.
- Tablas para resultados y solicitudes de descarga.
- Edge Function o backend seguro para autorizar solicitudes.

### 2. Servidor local Radio Imagen

Puede ser la computadora de 1TB.

Debe tener:

- Carpeta local de resultados.
- Pequeño agente local.
- Variables seguras de Supabase.
- Acceso a internet para subir archivos cuando se soliciten.

### 3. Portal del doctor

El doctor solo ve:

- Estado del resultado.
- Botón `Solicitar descarga`.
- Botón `Descargar` cuando el archivo temporal esté listo.

## Bucket recomendado

Nombre:

```text
result-temp
```

Configuración:

```text
Public bucket: OFF
```

Debe ser privado. La descarga se hace con signed URLs temporales.

## Tablas recomendadas

### result_files

Guarda el archivo maestro y su versión temporal en nube.

```sql
create table result_files (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null,
  doctor_id uuid not null,
  file_name text not null,
  local_path text not null,
  local_created_at timestamptz not null default now(),
  local_expires_at timestamptz not null,
  storage_mode text not null default 'local_first',
  cloud_bucket text,
  cloud_path text,
  cloud_uploaded_at timestamptz,
  cloud_expires_at timestamptz,
  downloaded_at timestamptz,
  cloud_deleted_at timestamptz,
  status text not null default 'local_ready'
);
```

Estados sugeridos:

```text
local_ready
upload_requested
cloud_ready
downloaded
cloud_deleted
local_expired
migrated_to_cloud
```

### download_requests

Registra cuándo un doctor pide descargar.

```sql
create table download_requests (
  id uuid primary key default gen_random_uuid(),
  result_file_id uuid not null references result_files(id),
  doctor_id uuid not null,
  status text not null default 'requested',
  signed_url text,
  signed_url_expires_at timestamptz,
  requested_at timestamptz not null default now(),
  fulfilled_at timestamptz,
  downloaded_at timestamptz,
  error_message text
);
```

Estados sugeridos:

```text
requested
uploading
ready
downloaded
expired
failed
```

## Flujo de descarga

### Paso 1. Radio Imagen termina estudio

El archivo queda local:

```text
/RadioImagen/resultados/2026/ORD-2026-0018/estudio.zip
```

En base de datos:

```text
result_files.status = local_ready
result_files.local_expires_at = fecha de creación + 3 meses
```

### Paso 2. Doctor solicita descarga

Frontend llama:

```text
POST /request-download
```

El backend valida:

- Doctor autenticado.
- Resultado pertenece a ese doctor.
- Resultado está dentro de vigencia local.
- No existe una solicitud activa.

Luego crea:

```text
download_requests.status = requested
result_files.status = upload_requested
```

### Paso 3. Agente local sube archivo

El agente local revisa solicitudes `requested`.

Cuando encuentra una:

1. Lee `local_path`.
2. Sube el archivo a Supabase Storage.
3. Crea signed URL temporal.
4. Actualiza `download_requests`.

Ruta sugerida en Supabase:

```text
doctor_id/order_id/result_file_id/file_name
```

Ejemplo:

```text
doc_sofia/ord_001/res_001/ORD-2026-0001.zip
```

### Paso 4. Doctor descarga

El portal muestra `Descargar`.

Cuando el doctor descarga:

```text
download_requests.status = downloaded
result_files.downloaded_at = now()
```

### Paso 5. Borrado temporal de nube

Después de descarga o expiración:

```text
Supabase Storage: delete cloud_path
result_files.status = cloud_deleted
result_files.cloud_deleted_at = now()
```

## Vigencias recomendadas

Archivo local:

```text
3 meses
```

Archivo temporal en Supabase:

```text
24 horas a 7 días
```

Signed URL:

```text
15 minutos a 1 hora
```

Si el doctor no descarga a tiempo, puede solicitar otro link mientras el archivo local siga vigente.

## Configuración de Supabase Storage

### Crear bucket privado

Desde Supabase Dashboard:

1. Storage.
2. New bucket.
3. Nombre: `result-temp`.
4. Public bucket: desactivado.

### Variables necesarias

En backend/agente local:

```text
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=result-temp
LOCAL_RESULTS_ROOT=/ruta/a/resultados
```

Importante:

```text
SUPABASE_SERVICE_ROLE_KEY nunca va en el frontend.
```

## Código base del agente local

Ejemplo conceptual en Node.js:

```js
import { createClient } from "@supabase/supabase-js";
import { readFile } from "node:fs/promises";
import path from "node:path";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

const bucket = process.env.SUPABASE_STORAGE_BUCKET;

async function processDownloadRequests() {
  const { data: requests, error } = await supabase
    .from("download_requests")
    .select("id, result_file_id, result_files(*)")
    .eq("status", "requested")
    .limit(5);

  if (error) throw error;

  for (const request of requests) {
    const file = request.result_files;

    await supabase
      .from("download_requests")
      .update({ status: "uploading" })
      .eq("id", request.id);

    const bytes = await readFile(file.local_path);
    const cloudPath = `${file.doctor_id}/${file.order_id}/${file.id}/${file.file_name}`;

    const upload = await supabase.storage
      .from(bucket)
      .upload(cloudPath, bytes, {
        upsert: true,
        contentType: "application/zip",
      });

    if (upload.error) {
      await supabase
        .from("download_requests")
        .update({ status: "failed", error_message: upload.error.message })
        .eq("id", request.id);
      continue;
    }

    const expiresInSeconds = 60 * 60;
    const signed = await supabase.storage
      .from(bucket)
      .createSignedUrl(cloudPath, expiresInSeconds);

    if (signed.error) throw signed.error;

    const expiresAt = new Date(Date.now() + expiresInSeconds * 1000).toISOString();

    await supabase
      .from("result_files")
      .update({
        status: "cloud_ready",
        cloud_bucket: bucket,
        cloud_path: cloudPath,
        cloud_uploaded_at: new Date().toISOString(),
        cloud_expires_at: expiresAt,
      })
      .eq("id", file.id);

    await supabase
      .from("download_requests")
      .update({
        status: "ready",
        signed_url: signed.data.signedUrl,
        signed_url_expires_at: expiresAt,
        fulfilled_at: new Date().toISOString(),
      })
      .eq("id", request.id);
  }
}
```

Este agente puede correr cada minuto con:

```bash
node local-agent.js
```

O como servicio permanente después.

## Borrado automático

Crear un proceso programado que:

1. Busque archivos `cloud_ready`.
2. Si ya fueron descargados o expiraron, borre `cloud_path` del bucket.
3. Actualice estado a `cloud_deleted`.

Regla:

```text
downloaded_at is not null OR cloud_expires_at < now()
```

## Migración futura

Para migrar a nube permanente, no cambies la lógica del portal. Cambia el proveedor.

Usa:

```text
storage_mode = migrated_to_cloud
```

Y deja de depender de:

```text
local_path
```

Por eso conviene que el portal pregunte por `result_files.status`, no por la ubicación física del archivo.

## Recomendación para el MVP

Orden de implementación:

1. Crear bucket privado `result-temp`.
2. Crear tablas `result_files` y `download_requests`.
3. Crear botón `Solicitar descarga`.
4. Crear agente local que suba archivos pendientes.
5. Crear signed URL temporal.
6. Registrar descarga.
7. Borrar archivo de Supabase.
8. Mantener archivo local máximo 3 meses.
