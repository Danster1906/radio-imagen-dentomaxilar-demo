import { createReadStream, existsSync, statSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const rootDir = resolve(".");
const preferredPort = Number(process.env.PORT || 5000);
const DB_PATH = resolve("data/doctors.json");

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
  try {
    return JSON.parse(readFileSync(DB_PATH, "utf-8"));
  } catch {
    return { doctors: {}, admin: { email: "admin@radioimagen.mx", password: "RadioImagen2026!" } };
  }
}

function writeDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => { body += chunk; });
    req.on("end", () => {
      try { resolve(JSON.parse(body)); }
      catch { reject(new Error("Invalid JSON")); }
    });
    req.on("error", reject);
  });
}

function json(res, code, data) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(data));
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
      res.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,DELETE", "Access-Control-Allow-Headers": "Content-Type" });
      res.end();
      return;
    }

    if (urlPath === "/api/doctors" && req.method === "GET") {
      const db = readDB();
      json(res, 200, { doctors: db.doctors, admin: { email: db.admin.email } });
      return;
    }

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
      } catch (e) {
        json(res, 400, { error: e.message });
      }
      return;
    }

    if (urlPath.startsWith("/api/doctors/") && req.method === "DELETE") {
      const email = decodeURIComponent(urlPath.replace("/api/doctors/", ""));
      const db = readDB();
      if (!db.doctors[email]) { json(res, 404, { error: "Doctor no encontrado" }); return; }
      delete db.doctors[email];
      writeDB(db);
      json(res, 200, { ok: true });
      return;
    }

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
          json(res, 200, { role: "doctor", email: normalEmail, doctor: { ...doc, password: undefined } });
          return;
        }
        json(res, 401, { error: "Correo o contraseña incorrectos" });
      } catch (e) {
        json(res, 400, { error: e.message });
      }
      return;
    }

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
