import { createReadStream, existsSync, statSync, writeFileSync, mkdirSync, unlinkSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { randomBytes } from "node:crypto";
import { Transform } from "node:stream";
import nodemailer from "nodemailer";
import { putObjectStream, getObjectStream, listKeys, deletePrefix } from "./storage.js";
import {
  initDb,
  getAccounts,
  getAccountByEmail,
  findDoctorByIdOrEmail,
  createAccount,
  updatePassword,
  updatePartner,
  updateProfile,
  updateNotifications,
  deleteAccount,
  getClinicRoster,
  addClinicDoctor,
  listOrders,
  createOrder,
  updateOrder,
  listEvents,
  addEvent,
  getFilesIndex,
  getFilesForOrder,
  getFileEntry,
  updateFileEntry,
  upsertFileEntry,
  markFileDownloaded,
  markOrderDownloaded,
  createUploadSession,
  getUploadSession,
  recordUploadPart,
  setUploadSessionStatus,
  deleteUploadSession,
  listStaleUploadSessions,
  addPlusInterest,
  listPlusInterest,
  getPlusInterestForEmail,
  verifyPassword,
  upgradePasswordHash,
  getFilesOwner,
  createSession,
  getSession,
  deleteSession,
} from "./db.js";

const rootDir = resolve(".");
const preferredPort = Number(process.env.PORT || 5000);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || randomBytes(32).toString("hex");
const UPLOADS_DIR = resolve("data/uploads");
const PART_SIZE = 15 * 1024 * 1024; // 15 MiB por fragmento
const MAX_FILE_SIZE = 2.5 * 1024 * 1024 * 1024; // 2.5 GB
const PLUS_MODULES = ["agenda", "finanzas", "kpis", "coach"];

mkdirSync(UPLOADS_DIR, { recursive: true });

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".zip": "application/zip",
  ".pdf": "application/pdf"
};

function createMailTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  return nodemailer.createTransport({
    host,
    port: 587,
    secure: false,
    auth: { user, pass }
  });
}

async function sendNotificationEmail({ doctorEmail, doctorName, patientName, studyType }) {
  const transport = createMailTransport();
  if (!transport) {
    console.warn("SMTP no configurado — correo de notificación omitido.");
    return;
  }
  const devDomain = process.env.REPLIT_DEV_DOMAIN;
  const portalUrl = process.env.PORTAL_URL ||
    (devDomain ? `https://${devDomain}` : "http://localhost:5000");
  const subject = `Resultados listos: ${patientName}`;
  const html = `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;">
      <h2 style="color:#1a1a2e;">Radio Imagen Dentomaxilar</h2>
      <p>Hola <strong>${doctorName}</strong>,</p>
      <p>Los resultados de tu paciente están disponibles para descarga en el portal:</p>
      <table style="border-collapse:collapse;width:100%;margin:16px 0;">
        <tr>
          <td style="padding:8px;background:#f5f5f5;font-weight:bold;width:40%;">Paciente</td>
          <td style="padding:8px;">${patientName}</td>
        </tr>
        <tr>
          <td style="padding:8px;background:#f5f5f5;font-weight:bold;">Tipo de estudio</td>
          <td style="padding:8px;">${studyType}</td>
        </tr>
      </table>
      <a href="${portalUrl}/?goto=results" style="display:inline-block;background:#1a1a2e;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">
        Descargar resultados →
      </a>
      <p style="margin-top:16px;color:#555;font-size:0.9em;">
        <strong>Descarga única:</strong> al completar la descarga, el archivo se elimina de nuestros
        servidores para proteger la información de tu paciente. Si lo necesitas de nuevo,
        solicita el reenvío desde el portal.
      </p>
      <p style="margin-top:24px;color:#888;font-size:0.85em;">
        Radio Imagen Dentomaxilar · Portal privado para doctores
      </p>
    </div>
  `;
  try {
    await transport.sendMail({
      from: `"Radio Imagen Dentomaxilar" <${process.env.SMTP_USER}>`,
      to: doctorEmail,
      subject,
      html
    });
    console.log(`Correo enviado a ${doctorEmail} — paciente: ${patientName}`);
  } catch (err) {
    console.error(`Error al enviar correo a ${doctorEmail}:`, err.message);
  }
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => { try { resolve(JSON.parse(body)); } catch { reject(new Error("Invalid JSON")); } });
    req.on("error", reject);
  });
}

function json(res, code, data) {
  res.writeHead(code, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(JSON.stringify(data));
}

// Transmite los fragmentos de un archivo, en orden, dentro de una sola
// respuesta HTTP. Si el cliente se desconecta a medias, lanza para que el
// caller NO borre el archivo (podrá reintentar la descarga).
async function pipeSequential(keys, res) {
  for (let i = 0; i < keys.length; i += 1) {
    if (res.destroyed) {
      throw new Error("Cliente desconectado");
    }
    await new Promise((resolvePart, rejectPart) => {
      const source = getObjectStream(keys[i]);
      const onClose = () => {
        source.destroy();
        rejectPart(new Error("Cliente desconectado"));
      };
      res.once("close", onClose);
      source.on("error", (err) => {
        res.removeListener("close", onClose);
        rejectPart(err);
      });
      source.on("end", () => {
        res.removeListener("close", onClose);
        resolvePart();
      });
      source.pipe(res, { end: false });
    });
  }
  await new Promise((resolveEnd) => res.end(resolveEnd));
}

const uploadPrefix = (uploadId) => `uploads/${uploadId}/`;
const partKey = (uploadId, index) => `${uploadPrefix(uploadId)}part-${String(index).padStart(5, "0")}`;

async function sweepStaleUploads() {
  try {
    const stale = await listStaleUploadSessions(24);
    for (const session of stale) {
      try {
        await deletePrefix(uploadPrefix(session.upload_id));
        await deleteUploadSession(session.upload_id);
      } catch (err) {
        console.error(`No se pudo limpiar la subida ${session.upload_id}:`, err.message);
      }
    }
    if (stale.length) {
      console.log(`Limpieza: ${stale.length} subidas abandonadas eliminadas del storage.`);
    }
  } catch (err) {
    console.error("Error en la limpieza de subidas:", err.message);
  }
}

function requireAdmin(req, res) {
  const token = req.headers["x-admin-token"];
  if (!token || token !== ADMIN_TOKEN) {
    json(res, 401, { error: "No autorizado. Se requiere sesión de administrador." });
    return false;
  }
  return true;
}

function isAdminRequest(req) {
  const token = req.headers["x-admin-token"];
  return Boolean(token) && token === ADMIN_TOKEN;
}

// Sesión de doctor: exige un token válido (emitido en /api/login) y lo
// devuelve. Escribe la respuesta 401 y regresa null si falta o no es válido.
async function requireDoctorSession(req, res) {
  const token = req.headers["x-session-token"];
  if (!token) {
    json(res, 401, { error: "Sesión requerida. Vuelve a iniciar sesión." });
    return null;
  }
  const session = await getSession(token);
  if (!session) {
    json(res, 401, { error: "Sesión inválida o expirada. Vuelve a iniciar sesión." });
    return null;
  }
  return session;
}

function resolveRequestPath(urlPath) {
  const cleanPath = normalize(decodeURIComponent(urlPath.split("?")[0])).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = cleanPath === "/" ? "/portal.html" : cleanPath;
  const absolutePath = resolve(join(rootDir, requestedPath));
  if (!absolutePath.startsWith(rootDir)) return null;
  if (existsSync(absolutePath) && statSync(absolutePath).isFile()) return absolutePath;
  return null;
}

function createAppServer() {
  return createServer(async (req, res) => {
    const urlPath = (req.url || "/").split("?")[0];

    if (req.method === "OPTIONS") {
      res.writeHead(204, {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE",
        "Access-Control-Allow-Headers": "Content-Type,x-admin-token"
      });
      res.end();
      return;
    }

    // GET /api/doctors
    if (urlPath === "/api/doctors" && req.method === "GET") {
      try {
        const { doctors, admin } = await getAccounts();
        json(res, 200, { doctors, admin: { email: admin?.email || "" } });
      } catch (e) { json(res, 500, { error: e.message }); }
      return;
    }

    // POST /api/doctors
    if (urlPath === "/api/doctors" && req.method === "POST") {
      if (!requireAdmin(req, res)) return;
      try {
        const body = await readBody(req);
        const { email, name, password, specialty, clinic, contactPhone, city, validatedPatients, accountType } = body;
        if (!email || !name || !password) { json(res, 400, { error: "email, name y password son obligatorios" }); return; }
        const doctor = await createAccount({ email, name, password, specialty, clinic, contactPhone, city, validatedPatients, accountType });
        json(res, 201, { doctor });
      } catch (e) {
        if (e.code === "23505") { json(res, 409, { error: "El correo ya existe" }); return; }
        json(res, 400, { error: e.message });
      }
      return;
    }

    // PUT /api/doctors/:email/password
    if (urlPath.match(/^\/api\/doctors\/[^/]+\/password$/) && req.method === "PUT") {
      if (!requireAdmin(req, res)) return;
      try {
        const email = decodeURIComponent(urlPath.replace("/api/doctors/", "").replace("/password", ""));
        const body = await readBody(req);
        const { password } = body;
        if (!password) { json(res, 400, { error: "La contraseña no puede estar vacía" }); return; }
        const updated = await updatePassword(email, password);
        if (!updated) { json(res, 404, { error: "Doctor no encontrado" }); return; }
        json(res, 200, { ok: true });
      } catch (e) { json(res, 400, { error: e.message }); }
      return;
    }

    // PUT /api/doctors/:email/partner
    if (urlPath.match(/^\/api\/doctors\/[^/]+\/partner$/) && req.method === "PUT") {
      if (!requireAdmin(req, res)) return;
      try {
        const email = decodeURIComponent(urlPath.replace("/api/doctors/", "").replace("/partner", ""));
        const body = await readBody(req);
        const partner = await updatePartner(email, {
          referredPatients: typeof body.referredPatients === "number" ? body.referredPatients : undefined,
          points: typeof body.points === "number" ? body.points : undefined,
        });
        if (!partner) { json(res, 404, { error: "Doctor no encontrado" }); return; }
        json(res, 200, { ok: true, partner });
      } catch (e) { json(res, 400, { error: e.message }); }
      return;
    }

    // PUT /api/doctors/:email/notifications
    if (urlPath.match(/^\/api\/doctors\/[^/]+\/notifications$/) && req.method === "PUT") {
      if (!requireAdmin(req, res)) return;
      try {
        const email = decodeURIComponent(urlPath.replace("/api/doctors/", "").replace("/notifications", ""));
        const body = await readBody(req);
        const notifications = body.notifications !== false;
        const updated = await updateNotifications(email, notifications);
        if (!updated) { json(res, 404, { error: "Doctor no encontrado" }); return; }
        json(res, 200, { ok: true, notifications });
      } catch (e) { json(res, 400, { error: e.message }); }
      return;
    }

    // DELETE /api/doctors/:email
    if (urlPath.startsWith("/api/doctors/") && req.method === "DELETE") {
      if (!requireAdmin(req, res)) return;
      const email = decodeURIComponent(urlPath.replace("/api/doctors/", ""));
      try {
        const deleted = await deleteAccount(email);
        if (!deleted) { json(res, 404, { error: "Doctor no encontrado" }); return; }
        json(res, 200, { ok: true });
      } catch (e) { json(res, 500, { error: e.message }); }
      return;
    }

    // POST /api/login
    if (urlPath === "/api/login" && req.method === "POST") {
      try {
        const { email, password } = await readBody(req);
        const normalEmail = email.toLowerCase();
        const account = await getAccountByEmail(normalEmail);
        let validCredentials = false;
        if (account?.password_hash) {
          validCredentials = verifyPassword(password, account.password_hash);
        } else if (account?.password && account.password === password) {
          // Cuenta aún con contraseña en texto plano: se acepta y se migra a hash
          validCredentials = true;
          await upgradePasswordHash(normalEmail, password);
        }
        if (!validCredentials) {
          json(res, 401, { error: "Correo o contraseña incorrectos" });
          return;
        }
        if (account.role === "admin") {
          json(res, 200, { role: "admin", email: normalEmail, adminToken: ADMIN_TOKEN });
          return;
        }
        const doctor = await findDoctorByIdOrEmail(normalEmail);
        const { password: _pw, ...safeDoc } = doctor;
        if (safeDoc.accountType === "clinic") {
          safeDoc.clinicDoctors = await getClinicRoster(normalEmail);
        }
        const sessionToken = await createSession(normalEmail, doctor.id, "doctor");
        json(res, 200, { role: "doctor", email: normalEmail, doctor: safeDoc, sessionToken });
      } catch (e) { json(res, 400, { error: e.message }); }
      return;
    }

    // PUT /api/profile — el doctor actualiza su propio perfil (datos, foto y encuadre)
    if (urlPath === "/api/profile" && req.method === "PUT") {
      const session = await requireDoctorSession(req, res);
      if (!session) return;
      try {
        const body = await readBody(req);
        if (typeof body.photo === "string" && body.photo.length > 1_500_000) {
          json(res, 413, { error: "La foto es demasiado grande. Usa una imagen más pequeña." });
          return;
        }
        const doctor = await updateProfile(session.email, {
          name: typeof body.name === "string" ? body.name.trim() : undefined,
          specialty: typeof body.specialty === "string" ? body.specialty.trim() : undefined,
          clinic: typeof body.clinic === "string" ? body.clinic.trim() : undefined,
          contactPhone: typeof body.contactPhone === "string" ? body.contactPhone.trim() : undefined,
          city: typeof body.city === "string" ? body.city.trim() : undefined,
          photo: typeof body.photo === "string" ? body.photo : undefined,
          photoCrop: body.photoCrop && typeof body.photoCrop === "object" ? body.photoCrop : undefined,
          profileNotes: typeof body.profileNotes === "string" ? body.profileNotes : undefined,
        });
        if (!doctor) { json(res, 404, { error: "Cuenta no encontrada" }); return; }
        json(res, 200, { doctor });
      } catch (e) { json(res, 400, { error: e.message }); }
      return;
    }

    // POST /api/logout — invalida el token de sesión del doctor
    if (urlPath === "/api/logout" && req.method === "POST") {
      try {
        const token = req.headers["x-session-token"];
        if (token) await deleteSession(token);
        json(res, 200, { ok: true });
      } catch (e) { json(res, 400, { error: e.message }); }
      return;
    }

    // POST /api/upload/start  — inicia una subida por fragmentos
    if (urlPath === "/api/upload/start" && req.method === "POST") {
      if (!requireAdmin(req, res)) return;
      try {
        const body = await readBody(req);
        const { orderId, doctorId, filename, size, label, patientName, studyType } = body;
        if (!orderId || !filename || !Number.isFinite(size) || size <= 0) {
          json(res, 400, { error: "orderId, filename y size son obligatorios" });
          return;
        }
        if (size > MAX_FILE_SIZE) {
          json(res, 413, { error: "El archivo excede el máximo de 2.5 GB" });
          return;
        }
        const safeFilename = filename.replace(/[^a-zA-Z0-9._\-áéíóúüñÁÉÍÓÚÜÑ ]/g, "_");
        const uploadId = randomBytes(12).toString("hex");
        const totalParts = Math.ceil(size / PART_SIZE);
        await createUploadSession({
          uploadId,
          orderId,
          doctorId,
          filename: safeFilename,
          label,
          patientName,
          studyType,
          sizeBytes: size,
          partSize: PART_SIZE,
          totalParts,
        });
        json(res, 201, { uploadId, partSize: PART_SIZE, totalParts, filename: safeFilename });
      } catch (e) { json(res, 400, { error: e.message }); }
      return;
    }

    // PUT /api/upload/part/:uploadId/:index  — un fragmento, cuerpo crudo
    const partMatch = urlPath.match(/^\/api\/upload\/part\/([a-f0-9]+)\/(\d+)$/);
    if (partMatch && req.method === "PUT") {
      if (!requireAdmin(req, res)) return;
      const uploadId = partMatch[1];
      const index = Number(partMatch[2]);
      let tooBig = false;
      try {
        const session = await getUploadSession(uploadId);
        if (!session || session.status !== "pending") {
          json(res, 404, { error: "Sesión de subida no encontrada o cerrada" });
          return;
        }
        if (index >= session.total_parts) {
          json(res, 400, { error: "Índice de fragmento inválido" });
          return;
        }
        const maxBytes = session.part_size + 64 * 1024;
        let bytes = 0;
        const meter = new Transform({
          transform(chunk, _enc, callback) {
            bytes += chunk.length;
            if (bytes > maxBytes) {
              tooBig = true;
              callback(new Error("Fragmento demasiado grande"));
              return;
            }
            callback(null, chunk);
          },
        });
        req.on("error", (err) => meter.destroy(err));
        req.pipe(meter);
        await putObjectStream(partKey(uploadId, index), meter);
        await recordUploadPart(uploadId, index, bytes);
        json(res, 200, { ok: true, index, bytes });
      } catch (e) {
        if (tooBig) {
          json(res, 413, { error: "El fragmento excede el tamaño permitido" });
        } else {
          json(res, 500, { error: e.message });
        }
      }
      return;
    }

    // POST /api/upload/complete  — valida fragmentos y registra el archivo
    if (urlPath === "/api/upload/complete" && req.method === "POST") {
      if (!requireAdmin(req, res)) return;
      try {
        const { uploadId } = await readBody(req);
        const session = await getUploadSession(uploadId);
        if (!session || session.status !== "pending") {
          json(res, 404, { error: "Sesión de subida no encontrada o cerrada" });
          return;
        }
        const parts = session.parts || {};
        const missing = [];
        let sum = 0;
        for (let i = 0; i < session.total_parts; i += 1) {
          if (String(i) in parts) {
            sum += Number(parts[String(i)]);
          } else {
            missing.push(i);
          }
        }
        const storedKeys = await listKeys(uploadPrefix(uploadId));
        if (missing.length || sum !== Number(session.size_bytes) || storedKeys.length !== session.total_parts) {
          json(res, 409, { error: "Faltan fragmentos o el tamaño no coincide", missing, expected: session.total_parts, stored: storedKeys.length });
          return;
        }
        const fileEntry = {
          filename: session.filename,
          size: Number(session.size_bytes),
          label: session.label || "",
          storagePrefix: uploadPrefix(uploadId),
          parts: session.total_parts,
        };
        await upsertFileEntry(session.order_id, session.doctor_id, fileEntry);
        await setUploadSessionStatus(uploadId, "complete");
        json(res, 201, { ok: true, file: { ...fileEntry, uploadedAt: new Date().toISOString() } });

        try {
          const doctorEntry = await findDoctorByIdOrEmail(session.doctor_id);
          if (doctorEntry && doctorEntry.notifications !== false && doctorEntry.email) {
            await sendNotificationEmail({
              doctorEmail: doctorEntry.email,
              doctorName: doctorEntry.name,
              patientName: session.patient_name || session.order_id,
              studyType: session.study_type || session.label || "Estudio",
            });
          }
        } catch (err) {
          console.error("Error al intentar enviar notificación:", err.message);
        }
      } catch (e) { json(res, 400, { error: e.message }); }
      return;
    }

    // POST /api/upload/abort  — cancela y limpia una subida
    if (urlPath === "/api/upload/abort" && req.method === "POST") {
      if (!requireAdmin(req, res)) return;
      try {
        const { uploadId } = await readBody(req);
        const session = await getUploadSession(uploadId);
        if (!session) { json(res, 404, { error: "Sesión de subida no encontrada" }); return; }
        if (session.status !== "pending") {
          // La subida ya se completó: sus objetos pertenecen a un archivo
          // registrado y no deben borrarse desde abort.
          json(res, 409, { error: "La subida ya se completó; no se puede cancelar" });
          return;
        }
        await deletePrefix(uploadPrefix(uploadId));
        await deleteUploadSession(uploadId);
        json(res, 200, { ok: true });
      } catch (e) { json(res, 400, { error: e.message }); }
      return;
    }

    // POST /api/request-resend  — el doctor pide que se vuelva a subir un archivo
    if (urlPath === "/api/request-resend" && req.method === "POST") {
      try {
        const { orderId, filename } = await readBody(req);
        if (!orderId || !filename) {
          json(res, 400, { error: "orderId y filename son obligatorios" });
          return;
        }
        const entry = await updateFileEntry(orderId, filename, {
          resendRequested: true,
          resendRequestedAt: new Date().toISOString(),
        });
        if (!entry) { json(res, 404, { error: "Archivo no encontrado" }); return; }
        json(res, 200, { ok: true });
      } catch (e) { json(res, 400, { error: e.message }); }
      return;
    }

    // DELETE /api/files/:orderId/:filename  — limpieza manual del admin
    const deleteFileMatch = urlPath.match(/^\/api\/files\/([^/]+)\/([^/]+)$/);
    if (deleteFileMatch && req.method === "DELETE") {
      if (!requireAdmin(req, res)) return;
      try {
        const orderId = decodeURIComponent(deleteFileMatch[1]);
        const filename = decodeURIComponent(deleteFileMatch[2]);
        const entry = await getFileEntry(orderId, filename);
        if (!entry) { json(res, 404, { error: "Archivo no encontrado" }); return; }
        if (entry.storagePrefix) {
          await deletePrefix(entry.storagePrefix);
        }
        await updateFileEntry(orderId, filename, { deleted: true, deletedAt: new Date().toISOString(), deletedBy: "admin" });
        json(res, 200, { ok: true });
      } catch (e) { json(res, 500, { error: e.message }); }
      return;
    }


    // GET /api/files/:orderId
    if (urlPath.startsWith("/api/files/") && req.method === "GET") {
      const orderId = decodeURIComponent(urlPath.replace("/api/files/", ""));
      if (!isAdminRequest(req)) {
        const session = await requireDoctorSession(req, res);
        if (!session) return;
        const owner = await getFilesOwner(orderId);
        if (owner && owner !== session.accountId) {
          json(res, 403, { error: "No autorizado para ver estos archivos" });
          return;
        }
      }
      try {
        json(res, 200, { files: await getFilesForOrder(orderId), orderId });
      } catch (e) { json(res, 500, { error: e.message }); }
      return;
    }

    // GET /api/files-index  (all orders with files, for admin)
    if (urlPath === "/api/files-index" && req.method === "GET") {
      if (!requireAdmin(req, res)) return;
      try {
        json(res, 200, await getFilesIndex());
      } catch (e) { json(res, 500, { error: e.message }); }
      return;
    }

    // GET /api/uploads/:orderId/:filename  — descarga de un solo uso: al
    // completarse, el archivo se elimina del storage.
    if (urlPath.startsWith("/api/uploads/") && req.method === "GET") {
      const parts = urlPath.replace("/api/uploads/", "").split("/");
      const orderId = decodeURIComponent(parts[0] || "");
      const filename = decodeURIComponent(parts[1] || "");

      try {
        const entry = await getFileEntry(orderId, filename);
        if (entry?.storagePrefix) {
          if (entry.deleted) {
            res.writeHead(410, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("El archivo ya fue descargado y eliminado de nuestros servidores. Solicita el reenvío a Radio Imagen desde el portal.");
            return;
          }
          const keys = await listKeys(entry.storagePrefix);
          if (keys.length !== entry.parts) {
            res.writeHead(410, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("El archivo ya no está disponible. Solicita el reenvío a Radio Imagen desde el portal.");
            return;
          }
          const ext = extname(filename).toLowerCase();
          res.writeHead(200, {
            "Content-Type": mimeTypes[ext] || "application/octet-stream",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Length": String(entry.size),
            "Cache-Control": "no-store",
          });
          try {
            await pipeSequential(keys, res);
          } catch (err) {
            // Descarga interrumpida: NO se borra, el doctor puede reintentar.
            console.warn(`Descarga interrumpida de ${orderId}/${filename}:`, err.message);
            res.destroy();
            return;
          }
          // Descarga completa: borrar del storage y marcar.
          try {
            await deletePrefix(entry.storagePrefix);
            await updateFileEntry(orderId, filename, {
              downloaded: true,
              deleted: true,
              downloadedAt: new Date().toISOString(),
              resendRequested: false,
            });
          } catch (err) {
            console.error(`No se pudo limpiar ${orderId}/${filename} tras la descarga:`, err.message);
          }
          return;
        }
      } catch (err) {
        json(res, 500, { error: err.message });
        return;
      }

      // Entradas antiguas sin storagePrefix: servir desde disco (comportamiento previo).
      const filePath = resolve(join(UPLOADS_DIR, orderId, filename));
      if (!filePath.startsWith(UPLOADS_DIR) || !existsSync(filePath)) {
        res.writeHead(404); res.end("Archivo no encontrado"); return;
      }
      const ext = extname(filename).toLowerCase();
      const ct = mimeTypes[ext] || "application/octet-stream";
      res.writeHead(200, {
        "Content-Type": ct,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store"
      });
      const stream = createReadStream(filePath);
      stream.pipe(res);
      stream.on("end", async () => {
        try {
          unlinkSync(filePath);
          await markFileDownloaded(orderId, filename);
        } catch {}
      });
      return;
    }

    // POST /api/mark-downloaded/:orderId  (mark order as fully downloaded)
    if (urlPath.startsWith("/api/mark-downloaded/") && req.method === "POST") {
      const orderId = decodeURIComponent(urlPath.replace("/api/mark-downloaded/", ""));
      try {
        await markOrderDownloaded(orderId);
        json(res, 200, { ok: true });
      } catch (e) { json(res, 500, { error: e.message }); }
      return;
    }

    // GET /api/partner-events
    if (urlPath === "/api/partner-events" && req.method === "GET") {
      if (!requireAdmin(req, res)) return;
      try {
        json(res, 200, { events: await listEvents() });
      } catch (e) { json(res, 500, { error: e.message }); }
      return;
    }

    // POST /api/partner-events
    if (urlPath === "/api/partner-events" && req.method === "POST") {
      if (!requireAdmin(req, res)) return;
      try {
        const body = await readBody(req);
        if (!body.email || typeof body.delta !== "number") {
          json(res, 400, { error: "email y delta son obligatorios" });
          return;
        }
        const event = await addEvent(body);
        json(res, 201, { ok: true, event });
      } catch (e) { json(res, 400, { error: e.message }); }
      return;
    }

    // GET /api/orders — el admin ve todas (opcionalmente filtradas por
    // doctorId); un doctor solo ve las suyas, sin importar qué doctorId pida.
    if (urlPath === "/api/orders" && req.method === "GET") {
      try {
        if (isAdminRequest(req)) {
          const doctorId = new URL(req.url, "http://localhost").searchParams.get("doctorId");
          json(res, 200, { orders: await listOrders(doctorId) });
          return;
        }
        const session = await requireDoctorSession(req, res);
        if (!session) return;
        json(res, 200, { orders: await listOrders(session.accountId) });
      } catch (e) { json(res, 500, { error: e.message }); }
      return;
    }

    // POST /api/orders — siempre bajo la identidad de la sesión, nunca la
    // que mande el cliente en el cuerpo.
    if (urlPath === "/api/orders" && req.method === "POST") {
      try {
        const session = await requireDoctorSession(req, res);
        if (!session) return;
        const body = await readBody(req);
        body.doctorId = session.accountId;
        if (!body.id || !body.patient || !body.doctorId) {
          json(res, 400, { error: "id, patient y doctorId son obligatorios" });
          return;
        }
        const account = await findDoctorByIdOrEmail(body.doctorId);
        if (account?.accountType === "clinic") {
          const treatingDoctor = (body.treatingDoctor || "").trim();
          if (treatingDoctor) {
            await addClinicDoctor(account.email, treatingDoctor);
          }
        } else if (!body.treatingDoctor) {
          body.treatingDoctor = body.doctor || account?.name || "";
        }
        const order = await createOrder(body);
        json(res, 201, { order });
      } catch (e) {
        if (e.code === "23505") { json(res, 409, { error: "Ya existe una orden con ese id" }); return; }
        json(res, 400, { error: e.message });
      }
      return;
    }

    // PUT /api/orders/:id — cambios de estado/agenda: solo Radio Imagen (admin)
    if (urlPath.match(/^\/api\/orders\/[^/]+$/) && req.method === "PUT") {
      if (!requireAdmin(req, res)) return;
      try {
        const orderId = decodeURIComponent(urlPath.replace("/api/orders/", ""));
        const body = await readBody(req);
        const order = await updateOrder(orderId, body);
        if (!order) { json(res, 404, { error: "Orden no encontrada" }); return; }
        json(res, 200, { order });
      } catch (e) { json(res, 400, { error: e.message }); }
      return;
    }

    // GET /api/clinic-doctors/:email  (roster de doctores de una cuenta clínica)
    if (urlPath.startsWith("/api/clinic-doctors/") && req.method === "GET") {
      const email = decodeURIComponent(urlPath.replace("/api/clinic-doctors/", ""));
      try {
        json(res, 200, { doctors: await getClinicRoster(email) });
      } catch (e) { json(res, 500, { error: e.message }); }
      return;
    }

    // POST /api/plus-interest  — registrar interés en un módulo de Consulta plus
    if (urlPath === "/api/plus-interest" && req.method === "POST") {
      try {
        const { email, module } = await readBody(req);
        if (!email || !PLUS_MODULES.includes(module)) {
          json(res, 400, { error: "email y module (agenda/finanzas/kpis/coach) son obligatorios" });
          return;
        }
        const doctor = await findDoctorByIdOrEmail(email);
        if (!doctor) { json(res, 404, { error: "Cuenta no encontrada" }); return; }
        const inserted = await addPlusInterest(email, module);
        json(res, inserted ? 201 : 200, { ok: true, already: !inserted });
      } catch (e) { json(res, 400, { error: e.message }); }
      return;
    }

    // GET /api/plus-interest  (admin) — todos los intereses registrados
    if (urlPath === "/api/plus-interest" && req.method === "GET") {
      if (!requireAdmin(req, res)) return;
      try {
        json(res, 200, { interests: await listPlusInterest() });
      } catch (e) { json(res, 500, { error: e.message }); }
      return;
    }

    // GET /api/plus-interest/:email — módulos registrados por una cuenta
    if (urlPath.startsWith("/api/plus-interest/") && req.method === "GET") {
      const email = decodeURIComponent(urlPath.replace("/api/plus-interest/", ""));
      try {
        json(res, 200, { modules: await getPlusInterestForEmail(email) });
      } catch (e) { json(res, 500, { error: e.message }); }
      return;
    }

    // Static files
    const filePath = resolveRequestPath(req.url || "/");
    if (!filePath) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Archivo no encontrado");
      return;
    }
    const contentType = mimeTypes[extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType, "Cache-Control": "no-store" });
    createReadStream(filePath).pipe(res);
  });
}

function listen(port) {
  const server = createAppServer();
  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && !process.env.PORT) { listen(port + 1); return; }
    throw error;
  });
  server.listen(port, "0.0.0.0", () => {
    console.log(`Radio Imagen portal disponible en http://localhost:${port}`);
  });
}

try {
  await initDb();
} catch (err) {
  console.error("No se pudo inicializar la base de datos PostgreSQL:", err.message);
  console.error("Verifica que DATABASE_URL esté configurada en el entorno de Replit.");
  process.exit(1);
}

// Limpieza de subidas abandonadas: al arrancar y cada hora.
sweepStaleUploads();
setInterval(sweepStaleUploads, 60 * 60 * 1000).unref();

listen(preferredPort);

// Puerto alternativo solo en desarrollo: los deployments (autoscale) exigen un único puerto
// y definen PORT en el entorno, así que ahí este bloque no corre.
if (!process.env.PORT && preferredPort !== 8003) {
  const fallback = createAppServer();
  fallback.listen(8003, "0.0.0.0", () => {
    console.log("Puerto alternativo 8003 activo");
  });
  fallback.on("error", () => {});
}
