import pg from "pg";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `scrypt:${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  if (!stored || !stored.startsWith("scrypt:")) return false;
  const [, salt, hash] = stored.split(":");
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

const DDL = `
CREATE TABLE IF NOT EXISTS accounts (
  email             TEXT PRIMARY KEY,
  id                TEXT UNIQUE NOT NULL,
  role              TEXT NOT NULL DEFAULT 'doctor',
  account_type      TEXT NOT NULL DEFAULT 'personal'
                    CHECK (account_type IN ('personal', 'clinic')),
  name              TEXT NOT NULL,
  handle            TEXT,
  specialty         TEXT DEFAULT '',
  clinic            TEXT DEFAULT '',
  contact_phone     TEXT DEFAULT '',
  city              TEXT DEFAULT '',
  password          TEXT,
  password_hash     TEXT,
  notifications     BOOLEAN NOT NULL DEFAULT TRUE,
  referred_patients INTEGER NOT NULL DEFAULT 0,
  points            INTEGER NOT NULL DEFAULT 0,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clinic_doctors (
  id            BIGSERIAL PRIMARY KEY,
  account_email TEXT NOT NULL REFERENCES accounts(email) ON DELETE CASCADE,
  doctor_name   TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (account_email, doctor_name)
);

CREATE TABLE IF NOT EXISTS orders (
  id              TEXT PRIMARY KEY,
  doctor_id       TEXT NOT NULL,
  treating_doctor TEXT,
  status          TEXT NOT NULL DEFAULT 'Recibida',
  data            JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS orders_doctor_idx ON orders (doctor_id);

CREATE TABLE IF NOT EXISTS partner_events (
  id         BIGSERIAL PRIMARY KEY,
  email      TEXT NOT NULL,
  order_id   TEXT,
  delta      INTEGER NOT NULL,
  reason     TEXT NOT NULL DEFAULT 'manual',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS files_index (
  order_id       TEXT PRIMARY KEY,
  doctor_id      TEXT,
  files          JSONB NOT NULL DEFAULT '[]',
  all_downloaded BOOLEAN NOT NULL DEFAULT FALSE,
  downloaded_at  TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS upload_sessions (
  upload_id    TEXT PRIMARY KEY,
  order_id     TEXT NOT NULL,
  doctor_id    TEXT,
  filename     TEXT NOT NULL,
  label        TEXT DEFAULT '',
  patient_name TEXT DEFAULT '',
  study_type   TEXT DEFAULT '',
  size_bytes   BIGINT NOT NULL,
  part_size    INTEGER NOT NULL,
  total_parts  INTEGER NOT NULL,
  parts        JSONB NOT NULL DEFAULT '{}',
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'complete', 'aborted')),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS plus_interest (
  id         BIGSERIAL PRIMARY KEY,
  email      TEXT NOT NULL,
  module     TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (email, module)
);

CREATE TABLE IF NOT EXISTS sessions (
  token        TEXT PRIMARY KEY,
  email        TEXT NOT NULL,
  account_id   TEXT NOT NULL,
  role         TEXT NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

const SEED_LOCK_KEY = 727201;

function readJsonSafe(path, fallback) {
  try {
    return JSON.parse(readFileSync(resolve(path), "utf-8"));
  } catch {
    return fallback;
  }
}

function rowToDoctor(row) {
  return {
    id: row.id,
    handle: row.handle || "",
    name: row.name,
    specialty: row.specialty || "",
    clinic: row.clinic || "",
    contactPhone: row.contact_phone || "",
    email: row.email,
    city: row.city || "",
    notifications: row.notifications,
    accountType: row.account_type,
    partner: {
      referredPatients: row.referred_patients,
      points: row.points,
    },
  };
}

function rowToOrder(row) {
  return {
    ...row.data,
    id: row.id,
    doctorId: row.doctor_id,
    status: row.status,
    treatingDoctor: row.treating_doctor || row.data?.doctor || "",
  };
}

function rowToEvent(row) {
  return {
    email: row.email,
    orderId: row.order_id,
    delta: row.delta,
    timestamp: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    reason: row.reason,
  };
}

export function buildHandle(name) {
  return (
    "@" +
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

async function seedFromJsonIfEmpty(client) {
  const { rows } = await client.query("SELECT count(*)::int AS n FROM accounts");
  if (rows[0].n > 0) return;

  const doctorsDb = readJsonSafe("data/doctors.json", { doctors: {}, admin: null });
  const orders = readJsonSafe("data/orders.json", []);
  const eventsDb = readJsonSafe("data/partner-events.json", { events: [] });
  const filesIndex = readJsonSafe("data/files-index.json", {});

  const admin = doctorsDb.admin || { email: "admin@radioimagen.mx", password: "RadioImagen2026!" };
  await client.query(
    `INSERT INTO accounts (email, id, role, name, handle, password)
     VALUES ($1, 'ADM-0001', 'admin', 'Admin Radio Imagen', '@radio-imagen-admin', $2)`,
    [admin.email.toLowerCase(), admin.password],
  );

  let seededDoctors = 0;
  for (const [email, doc] of Object.entries(doctorsDb.doctors || {})) {
    await client.query(
      `INSERT INTO accounts (email, id, role, account_type, name, handle, specialty, clinic,
                             contact_phone, city, password, notifications, referred_patients, points)
       VALUES ($1, $2, 'doctor', 'personal', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        email.toLowerCase(),
        doc.id,
        doc.name,
        doc.handle || buildHandle(doc.name),
        doc.specialty || "",
        doc.clinic || "",
        doc.contactPhone || "",
        doc.city || "",
        doc.password,
        doc.notifications !== false,
        doc.partner?.referredPatients || 0,
        doc.partner?.points || 0,
      ],
    );
    seededDoctors += 1;
  }

  // created_at decreciente por índice: el arreglo JSON está ordenado del más nuevo al más viejo
  const base = Date.now();
  let seededOrders = 0;
  for (let i = 0; i < orders.length; i += 1) {
    const order = orders[i];
    if (!order?.id) continue;
    await client.query(
      `INSERT INTO orders (id, doctor_id, treating_doctor, status, data, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $6)
       ON CONFLICT (id) DO NOTHING`,
      [
        order.id,
        order.doctorId || "",
        order.treatingDoctor || order.doctor || "",
        order.status || "Recibida",
        JSON.stringify(order),
        new Date(base - i * 60000),
      ],
    );
    seededOrders += 1;
  }

  for (const event of eventsDb.events || []) {
    await client.query(
      `INSERT INTO partner_events (email, order_id, delta, reason, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [event.email, event.orderId || null, event.delta, event.reason || "manual", event.timestamp || new Date()],
    );
  }

  for (const [orderId, entry] of Object.entries(filesIndex)) {
    await client.query(
      `INSERT INTO files_index (order_id, doctor_id, files, all_downloaded, downloaded_at)
       VALUES ($1, $2, $3, $4, $5) ON CONFLICT (order_id) DO NOTHING`,
      [orderId, entry.doctorId || null, JSON.stringify(entry.files || []), Boolean(entry.allDownloaded), entry.downloadedAt || null],
    );
  }

  console.log(
    `Base de datos sembrada desde data/*.json: ${seededDoctors} doctores, ${seededOrders} órdenes, ` +
      `${(eventsDb.events || []).length} eventos de puntos.`,
  );
}

async function hashPlaintextPasswords(client) {
  const { rows } = await client.query("SELECT email, password FROM accounts WHERE password IS NOT NULL");
  for (const row of rows) {
    await client.query(
      "UPDATE accounts SET password_hash = $2, password = NULL WHERE email = $1",
      [row.email, hashPassword(row.password)],
    );
  }
  if (rows.length) {
    console.log(`Contraseñas migradas a hash scrypt: ${rows.length} cuentas.`);
  }
}

export async function initDb() {
  const client = await pool.connect();
  try {
    await client.query("SELECT 1");
    await client.query(DDL);
    await client.query("SELECT pg_advisory_lock($1)", [SEED_LOCK_KEY]);
    try {
      await client.query("BEGIN");
      await seedFromJsonIfEmpty(client);
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      await client.query("SELECT pg_advisory_unlock($1)", [SEED_LOCK_KEY]);
    }
    await hashPlaintextPasswords(client);
  } finally {
    client.release();
  }
}

// ---------- Cuentas ----------

export async function getAccounts() {
  const { rows } = await pool.query("SELECT * FROM accounts ORDER BY id");
  const doctors = {};
  let admin = null;
  for (const row of rows) {
    if (row.role === "admin") {
      admin = { email: row.email };
    } else {
      doctors[row.email] = rowToDoctor(row);
    }
  }
  return { doctors, admin };
}

export async function getAccountByEmail(email) {
  const { rows } = await pool.query("SELECT * FROM accounts WHERE email = $1", [email.toLowerCase()]);
  return rows[0] || null;
}

export async function findDoctorByIdOrEmail(idOrEmail) {
  const { rows } = await pool.query(
    "SELECT * FROM accounts WHERE role = 'doctor' AND (id = $1 OR email = lower($1))",
    [idOrEmail],
  );
  return rows[0] ? rowToDoctor(rows[0]) : null;
}

export async function createAccount({ email, name, password, specialty, clinic, contactPhone, city, validatedPatients, accountType }) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query(
      `SELECT COALESCE(MAX(NULLIF(regexp_replace(id, '\\D', '', 'g'), '')::int), 0) + 1 AS next
       FROM accounts WHERE role = 'doctor'`,
    );
    const id = `DR-${String(rows[0].next).padStart(4, "0")}`;
    const points = (validatedPatients || 0) * 100;
    const { rows: inserted } = await client.query(
      `INSERT INTO accounts (email, id, role, account_type, name, handle, specialty, clinic,
                             contact_phone, city, password_hash, notifications, referred_patients, points)
       VALUES ($1, $2, 'doctor', $3, $4, $5, $6, $7, $8, $9, $10, TRUE, $11, $12)
       RETURNING *`,
      [
        email.toLowerCase(),
        id,
        accountType === "clinic" ? "clinic" : "personal",
        name,
        buildHandle(name),
        specialty || "",
        clinic || "",
        contactPhone || "",
        city || "",
        hashPassword(password),
        validatedPatients || 0,
        points,
      ],
    );
    await client.query("COMMIT");
    return rowToDoctor(inserted[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function updatePassword(email, password) {
  const { rowCount } = await pool.query(
    "UPDATE accounts SET password_hash = $2, password = NULL WHERE email = $1 AND role = 'doctor'",
    [email.toLowerCase(), hashPassword(password)],
  );
  return rowCount > 0;
}

export async function upgradePasswordHash(email, password) {
  await pool.query(
    "UPDATE accounts SET password_hash = $2, password = NULL WHERE email = $1",
    [email.toLowerCase(), hashPassword(password)],
  );
}

export async function updatePartner(email, { referredPatients, points }) {
  const { rows } = await pool.query(
    `UPDATE accounts SET
       referred_patients = COALESCE($2, referred_patients),
       points = COALESCE($3, points)
     WHERE email = $1 AND role = 'doctor'
     RETURNING referred_patients, points`,
    [email.toLowerCase(), referredPatients ?? null, points ?? null],
  );
  if (!rows[0]) return null;
  return { referredPatients: rows[0].referred_patients, points: rows[0].points };
}

export async function updateNotifications(email, notifications) {
  const { rowCount } = await pool.query(
    "UPDATE accounts SET notifications = $2 WHERE email = $1 AND role = 'doctor'",
    [email.toLowerCase(), notifications],
  );
  return rowCount > 0;
}

export async function deleteAccount(email) {
  const { rowCount } = await pool.query(
    "DELETE FROM accounts WHERE email = $1 AND role = 'doctor'",
    [email.toLowerCase()],
  );
  return rowCount > 0;
}

// ---------- Roster de clínicas ----------

export async function getClinicRoster(email) {
  const { rows } = await pool.query(
    "SELECT doctor_name FROM clinic_doctors WHERE account_email = $1 ORDER BY doctor_name",
    [email.toLowerCase()],
  );
  return rows.map((row) => row.doctor_name);
}

export async function addClinicDoctor(email, doctorName) {
  await pool.query(
    `INSERT INTO clinic_doctors (account_email, doctor_name)
     VALUES ($1, $2) ON CONFLICT (account_email, doctor_name) DO NOTHING`,
    [email.toLowerCase(), doctorName.trim()],
  );
}

// ---------- Órdenes ----------

export async function listOrders(doctorId) {
  const query = doctorId
    ? { text: "SELECT * FROM orders WHERE doctor_id = $1 ORDER BY created_at DESC", values: [doctorId] }
    : { text: "SELECT * FROM orders ORDER BY created_at DESC" };
  const { rows } = await pool.query(query);
  return rows.map(rowToOrder);
}

export async function createOrder(body) {
  const { rows } = await pool.query(
    `INSERT INTO orders (id, doctor_id, treating_doctor, status, data)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [body.id, body.doctorId, body.treatingDoctor || body.doctor || "", body.status || "Recibida", JSON.stringify(body)],
  );
  return rowToOrder(rows[0]);
}

export async function updateOrder(orderId, patch) {
  const { rows } = await pool.query(
    `UPDATE orders SET
       data = data || $2::jsonb,
       status = COALESCE($3, status),
       treating_doctor = COALESCE($4, treating_doctor),
       updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [orderId, JSON.stringify(patch), patch.status ?? null, patch.treatingDoctor ?? null],
  );
  return rows[0] ? rowToOrder(rows[0]) : null;
}

// ---------- Eventos de puntos ----------

export async function listEvents() {
  const { rows } = await pool.query("SELECT * FROM partner_events ORDER BY created_at, id");
  return rows.map(rowToEvent);
}

export async function addEvent({ email, orderId, delta, reason }) {
  const { rows } = await pool.query(
    `INSERT INTO partner_events (email, order_id, delta, reason)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [email, orderId || null, delta, reason || "manual"],
  );
  return rowToEvent(rows[0]);
}

// ---------- Índice de archivos ----------

function rowToFilesEntry(row) {
  const entry = { doctorId: row.doctor_id, files: row.files || [] };
  if (row.all_downloaded) entry.allDownloaded = true;
  if (row.downloaded_at) entry.downloadedAt = row.downloaded_at.toISOString?.() || row.downloaded_at;
  return entry;
}

export async function getFilesIndex() {
  const { rows } = await pool.query("SELECT * FROM files_index");
  const index = {};
  for (const row of rows) index[row.order_id] = rowToFilesEntry(row);
  return index;
}

export async function getFilesForOrder(orderId) {
  const { rows } = await pool.query("SELECT * FROM files_index WHERE order_id = $1", [orderId]);
  return rows[0] ? rowToFilesEntry(rows[0]).files : [];
}

export async function upsertFileEntry(orderId, doctorId, file) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query("SELECT files FROM files_index WHERE order_id = $1 FOR UPDATE", [orderId]);
    const files = rows[0]?.files || [];
    // Re-subir el mismo filename reemplaza la entrada completa (reinicia
    // descargado/borrado/reenvío solicitado).
    const entry = { ...file, uploadedAt: new Date().toISOString() };
    const existingIndex = files.findIndex((f) => f.filename === file.filename);
    if (existingIndex === -1) {
      files.push(entry);
    } else {
      files[existingIndex] = entry;
    }
    await client.query(
      `INSERT INTO files_index (order_id, doctor_id, files)
       VALUES ($1, $2, $3)
       ON CONFLICT (order_id) DO UPDATE
         SET files = EXCLUDED.files, doctor_id = EXCLUDED.doctor_id, all_downloaded = FALSE`,
      [orderId, doctorId || null, JSON.stringify(files)],
    );
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function getFileEntry(orderId, filename) {
  const { rows } = await pool.query("SELECT files FROM files_index WHERE order_id = $1", [orderId]);
  return (rows[0]?.files || []).find((f) => f.filename === filename) || null;
}

export async function getFilesOwner(orderId) {
  const { rows } = await pool.query("SELECT doctor_id FROM files_index WHERE order_id = $1", [orderId]);
  return rows[0]?.doctor_id || null;
}

export async function updateFileEntry(orderId, filename, patch) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query("SELECT files FROM files_index WHERE order_id = $1 FOR UPDATE", [orderId]);
    const files = rows[0]?.files || [];
    const entry = files.find((f) => f.filename === filename);
    if (!entry) {
      await client.query("COMMIT");
      return null;
    }
    Object.assign(entry, patch);
    const allDownloaded = files.length > 0 && files.every((f) => f.downloaded);
    await client.query(
      "UPDATE files_index SET files = $2, all_downloaded = $3 WHERE order_id = $1",
      [orderId, JSON.stringify(files), allDownloaded],
    );
    await client.query("COMMIT");
    return entry;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function markFileDownloaded(orderId, filename) {
  return updateFileEntry(orderId, filename, {
    downloaded: true,
    downloadedAt: new Date().toISOString(),
  });
}

export async function markOrderDownloaded(orderId) {
  await pool.query(
    "UPDATE files_index SET all_downloaded = TRUE, downloaded_at = now() WHERE order_id = $1",
    [orderId],
  );
}

// ---------- Sesiones de subida por fragmentos ----------

export async function createUploadSession({ uploadId, orderId, doctorId, filename, label, patientName, studyType, sizeBytes, partSize, totalParts }) {
  await pool.query(
    `INSERT INTO upload_sessions (upload_id, order_id, doctor_id, filename, label, patient_name, study_type, size_bytes, part_size, total_parts)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [uploadId, orderId, doctorId || null, filename, label || "", patientName || "", studyType || "", sizeBytes, partSize, totalParts],
  );
}

export async function getUploadSession(uploadId) {
  const { rows } = await pool.query("SELECT * FROM upload_sessions WHERE upload_id = $1", [uploadId]);
  return rows[0] || null;
}

export async function recordUploadPart(uploadId, index, bytes) {
  await pool.query(
    "UPDATE upload_sessions SET parts = jsonb_set(parts, ARRAY[$2::text], to_jsonb($3::bigint)) WHERE upload_id = $1",
    [uploadId, String(index), bytes],
  );
}

export async function setUploadSessionStatus(uploadId, status) {
  await pool.query("UPDATE upload_sessions SET status = $2 WHERE upload_id = $1", [uploadId, status]);
}

export async function deleteUploadSession(uploadId) {
  await pool.query("DELETE FROM upload_sessions WHERE upload_id = $1", [uploadId]);
}

export async function listStaleUploadSessions(hours = 24) {
  const { rows } = await pool.query(
    "SELECT * FROM upload_sessions WHERE status = 'pending' AND created_at < now() - ($1 || ' hours')::interval",
    [String(hours)],
  );
  return rows;
}

// ---------- Interés en Consulta plus ----------

export async function addPlusInterest(email, module) {
  const { rowCount } = await pool.query(
    "INSERT INTO plus_interest (email, module) VALUES ($1, $2) ON CONFLICT DO NOTHING",
    [email.toLowerCase(), module],
  );
  return rowCount > 0;
}

export async function listPlusInterest() {
  const { rows } = await pool.query("SELECT email, module, created_at FROM plus_interest ORDER BY created_at DESC");
  return rows.map((row) => ({
    email: row.email,
    module: row.module,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
  }));
}

export async function getPlusInterestForEmail(email) {
  const { rows } = await pool.query("SELECT module FROM plus_interest WHERE email = $1", [email.toLowerCase()]);
  return rows.map((row) => row.module);
}

// ---------- Sesiones de doctor ----------

export async function createSession(email, accountId, role) {
  const token = randomBytes(24).toString("hex");
  await pool.query(
    "INSERT INTO sessions (token, email, account_id, role) VALUES ($1, $2, $3, $4)",
    [token, email.toLowerCase(), accountId, role],
  );
  return token;
}

export async function getSession(token) {
  const { rows } = await pool.query(
    "UPDATE sessions SET last_seen_at = now() WHERE token = $1 RETURNING email, account_id, role",
    [token],
  );
  if (!rows[0]) return null;
  return { email: rows[0].email, accountId: rows[0].account_id, role: rows[0].role };
}

export async function deleteSession(token) {
  await pool.query("DELETE FROM sessions WHERE token = $1", [token]);
}

export async function closeDb() {
  await pool.end();
}
