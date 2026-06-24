import { createReadStream, existsSync, statSync, readFileSync, writeFileSync, mkdirSync, unlinkSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const Busboy = require("busboy");

const rootDir = resolve(".");
const preferredPort = Number(process.env.PORT || 5000);
const DB_PATH = resolve("data/doctors.json");
const UPLOADS_DIR = resolve("data/uploads");

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

function readDB() {
  try { return JSON.parse(readFileSync(DB_PATH, "utf-8")); }
  catch { return { doctors: {}, admin: { email: "admin@radioimagen.mx", password: "RadioImagen2026!" } }; }
}

function writeDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
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

function readFilesIndex() {
  const indexPath = resolve("data/files-index.json");
  try { return JSON.parse(readFileSync(indexPath, "utf-8")); }
  catch { return {}; }
}

function writeFilesIndex(data) {
  writeFileSync(resolve("data/files-index.json"), JSON.stringify(data, null, 2), "utf-8");
}

function handleUpload(req, res) {
  return new Promise((resolve) => {
    const bb = Busboy({ headers: req.headers, limits: { fileSize: 200 * 1024 * 1024 } });
    let orderId = "";
    let doctorId = "";
    let fileLabel = "";
    let savedFile = null;

    bb.on("field", (name, val) => {
      if (name === "orderId") orderId = val;
      if (name === "doctorId") doctorId = val;
      if (name === "fileLabel") fileLabel = val;
    });

    bb.on("file", (name, stream, info) => {
      const { filename } = info;
      const safeFilename = filename.replace(/[^a-zA-Z0-9._\-áéíóúüñÁÉÍÓÚÜÑ ]/g, "_");
      const orderDir = join(UPLOADS_DIR, orderId || "sin-orden");
      mkdirSync(orderDir, { recursive: true });
      const filePath = join(orderDir, safeFilename);
      const chunks = [];
      stream.on("data", chunk => chunks.push(chunk));
      stream.on("end", () => {
        const buf = Buffer.concat(chunks);
        writeFileSync(filePath, buf);
        savedFile = { filename: safeFilename, size: buf.length, label: fileLabel };
      });
    });

    bb.on("finish", () => {
      if (!savedFile || !orderId) {
        json(res, 400, { error: "Falta orderId o archivo" });
        resolve();
        return;
      }
      const index = readFilesIndex();
      if (!index[orderId]) index[orderId] = { doctorId, files: [] };
      const exists = index[orderId].files.find(f => f.filename === savedFile.filename);
      if (!exists) index[orderId].files.push({ ...savedFile, uploadedAt: new Date().toISOString() });
      writeFilesIndex(index);
      json(res, 201, { ok: true, file: savedFile });
      resolve();
    });

    bb.on("error", () => { json(res, 500, { error: "Error al procesar el archivo" }); resolve(); });
    req.pipe(bb);
  });
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
        "Access-Control-Allow-Headers": "Content-Type"
      });
      res.end();
      return;
    }

    // GET /api/doctors
    if (urlPath === "/api/doctors" && req.method === "GET") {
      const db = readDB();
      const safeDoctors = {};
      for (const [email, doc] of Object.entries(db.doctors)) {
        safeDoctors[email] = doc;
      }
      json(res, 200, { doctors: safeDoctors, admin: { email: db.admin.email } });
      return;
    }

    // POST /api/doctors
    if (urlPath === "/api/doctors" && req.method === "POST") {
      try {
        const body = await readBody(req);
        const { email, name, password, specialty, clinic, contactPhone, city, validatedPatients } = body;
        if (!email || !name || !password) { json(res, 400, { error: "email, name y password son obligatorios" }); return; }
        const db = readDB();
        if (db.doctors[email]) { json(res, 409, { error: "El correo ya existe" }); return; }
        const count = Object.keys(db.doctors).length + 1;
        const id = `DR-${String(count).padStart(4, "0")}`;
        const handle = "@" + name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        const pts = (validatedPatients || 0) * 100;
        db.doctors[email] = { id, handle, name, specialty: specialty || "", clinic: clinic || "", contactPhone: contactPhone || "", email, city: city || "", password, partner: { referredPatients: validatedPatients || 0, points: pts } };
        writeDB(db);
        json(res, 201, { doctor: db.doctors[email] });
      } catch (e) { json(res, 400, { error: e.message }); }
      return;
    }

    // PUT /api/doctors/:email/password
    if (urlPath.match(/^\/api\/doctors\/[^/]+\/password$/) && req.method === "PUT") {
      try {
        const email = decodeURIComponent(urlPath.replace("/api/doctors/", "").replace("/password", ""));
        const body = await readBody(req);
        const { password } = body;
        if (!password) { json(res, 400, { error: "La contraseña no puede estar vacía" }); return; }
        const db = readDB();
        if (!db.doctors[email]) { json(res, 404, { error: "Doctor no encontrado" }); return; }
        db.doctors[email].password = password;
        writeDB(db);
        json(res, 200, { ok: true });
      } catch (e) { json(res, 400, { error: e.message }); }
      return;
    }

    // DELETE /api/doctors/:email
    if (urlPath.startsWith("/api/doctors/") && req.method === "DELETE") {
      const email = decodeURIComponent(urlPath.replace("/api/doctors/", ""));
      const db = readDB();
      if (!db.doctors[email]) { json(res, 404, { error: "Doctor no encontrado" }); return; }
      delete db.doctors[email];
      writeDB(db);
      json(res, 200, { ok: true });
      return;
    }

    // POST /api/login
    if (urlPath === "/api/login" && req.method === "POST") {
      try {
        const { email, password } = await readBody(req);
        const db = readDB();
        const normalEmail = email.toLowerCase();
        if (normalEmail === db.admin.email && password === db.admin.password) {
          json(res, 200, { role: "admin", email: normalEmail });
          return;
        }
        const doc = db.doctors[normalEmail];
        if (doc && doc.password === password) {
          const { password: _pw, ...safeDoc } = doc;
          json(res, 200, { role: "doctor", email: normalEmail, doctor: safeDoc });
          return;
        }
        json(res, 401, { error: "Correo o contraseña incorrectos" });
      } catch (e) { json(res, 400, { error: e.message }); }
      return;
    }

    // POST /api/upload  (multipart)
    if (urlPath === "/api/upload" && req.method === "POST") {
      await handleUpload(req, res);
      return;
    }

    // GET /api/files/:orderId
    if (urlPath.startsWith("/api/files/") && req.method === "GET") {
      const orderId = decodeURIComponent(urlPath.replace("/api/files/", ""));
      const index = readFilesIndex();
      json(res, 200, { files: index[orderId]?.files || [], orderId });
      return;
    }

    // GET /api/files-index  (all orders with files, for admin)
    if (urlPath === "/api/files-index" && req.method === "GET") {
      json(res, 200, readFilesIndex());
      return;
    }

    // GET /api/uploads/:orderId/:filename  (serve file for download, then delete)
    if (urlPath.startsWith("/api/uploads/") && req.method === "GET") {
      const parts = urlPath.replace("/api/uploads/", "").split("/");
      const orderId = decodeURIComponent(parts[0] || "");
      const filename = decodeURIComponent(parts[1] || "");
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
      stream.on("end", () => {
        try {
          unlinkSync(filePath);
          const index = readFilesIndex();
          if (index[orderId]) {
            const fileEntry = index[orderId].files.find(f => f.filename === filename);
            if (fileEntry) {
              fileEntry.downloaded = true;
              fileEntry.downloadedAt = new Date().toISOString();
            }
            const allDownloaded = index[orderId].files.every(f => f.downloaded);
            if (allDownloaded) index[orderId].allDownloaded = true;
            writeFilesIndex(index);
          }
        } catch {}
      });
      return;
    }

    // POST /api/mark-downloaded/:orderId  (mark order as fully downloaded)
    if (urlPath.startsWith("/api/mark-downloaded/") && req.method === "POST") {
      const orderId = decodeURIComponent(urlPath.replace("/api/mark-downloaded/", ""));
      const index = readFilesIndex();
      if (index[orderId]) {
        index[orderId].allDownloaded = true;
        index[orderId].downloadedAt = new Date().toISOString();
        writeFilesIndex(index);
      }
      json(res, 200, { ok: true });
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

listen(preferredPort);
