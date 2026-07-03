// Capa de almacenamiento de objetos (Replit Object Storage / GCS).
// Todo el acceso al storage pasa por estas 5 funciones: para migrar a otro
// proveedor (S3, GCS directo, etc.) solo hay que reimplementar este archivo.
import { Client } from "@replit/object-storage";
import { PassThrough } from "node:stream";

const client = new Client();

// Sube un stream a un objeto. El SDK no propaga errores del stream de origen
// (p. ej. el navegador corta la conexión a media subida), así que se interpone
// un PassThrough: si el origen falla, el destino recibe el error y la promesa
// rechaza en lugar de colgarse.
export function putObjectStream(key, sourceStream) {
  return new Promise((resolve, reject) => {
    const relay = new PassThrough();
    relay.on("error", reject);
    sourceStream.on("error", (err) => relay.destroy(err));
    sourceStream.pipe(relay);
    client.uploadFromStream(key, relay, { compress: false }).then(resolve, reject);
  });
}

// Devuelve un Readable del objeto. Si no existe, el stream emite 'error'
// (StreamRequestError 404) — el consumidor debe escucharlo.
export function getObjectStream(key) {
  return client.downloadAsStream(key);
}

export async function listKeys(prefix) {
  const result = await client.list({ prefix });
  if (!result.ok) {
    throw new Error(`No se pudo listar el storage (${prefix}): ${result.error?.message || "error desconocido"}`);
  }
  return result.value.map((obj) => obj.name).sort();
}

// Borra todos los objetos bajo un prefijo. Idempotente: los objetos ya
// inexistentes se ignoran, por lo que es seguro ante barridos concurrentes.
export async function deletePrefix(prefix) {
  const keys = await listKeys(prefix);
  let deleted = 0;
  for (const key of keys) {
    const result = await client.delete(key, { ignoreNotFound: true });
    if (!result.ok) {
      throw new Error(`No se pudo borrar ${key}: ${result.error?.message || "error desconocido"}`);
    }
    deleted += 1;
  }
  return deleted;
}

export async function objectExists(key) {
  const result = await client.exists(key);
  if (!result.ok) {
    throw new Error(`No se pudo verificar ${key}: ${result.error?.message || "error desconocido"}`);
  }
  return result.value;
}
