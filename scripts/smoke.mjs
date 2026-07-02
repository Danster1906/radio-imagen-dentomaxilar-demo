// Prueba de humo del portal: node scripts/smoke.mjs [--shots]
// Levanta server.js en un puerto libre, valida la API (incluida la
// regresión de fuga de contraseñas) y recorre la app en Chromium.
import { spawn } from "node:child_process";
import { readFileSync, mkdirSync, globSync } from "node:fs";
import { randomBytes } from "node:crypto";

const PORT = Number(process.env.SMOKE_PORT || 5097);
const BASE = `http://localhost:${PORT}`;
const SHOTS = process.argv.includes("--shots");
const SHOTS_DIR = "scripts/smoke-shots";

let failures = 0;
function check(name, ok, detail = "") {
  console.log(`${ok ? "✓" : "✗"} ${name}${ok || !detail ? "" : ` — ${detail}`}`);
  if (!ok) failures++;
}

function adminCredentials() {
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    return { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD };
  }
  const db = JSON.parse(readFileSync("data/doctors.json", "utf-8"));
  return { email: db.admin.email, password: db.admin.password };
}

async function waitForServer(timeoutMs = 8000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 150));
  }
  return false;
}

const server = spawn("node", ["server.js"], {
  env: { ...process.env, PORT: String(PORT) },
  stdio: ["ignore", "pipe", "pipe"],
});
let serverLog = "";
server.stdout.on("data", (d) => (serverLog += d));
server.stderr.on("data", (d) => (serverLog += d));

let tempDoctorEmail = null;
let adminToken = null;

try {
  check("servidor arriba", await waitForServer(), serverLog.slice(-400));

  // --- HTTP ---
  const home = await fetch(`${BASE}/`);
  check("GET / → 200 html", home.status === 200 && (home.headers.get("content-type") || "").includes("text/html"));

  const doctorsRes = await fetch(`${BASE}/api/doctors`);
  const doctorsText = await doctorsRes.text();
  check("GET /api/doctors → 200", doctorsRes.status === 200);
  check("GET /api/doctors no expone contraseñas", !doctorsText.includes('"password"'));

  const badLogin = await fetch(`${BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "nadie@example.com", password: "mal" }),
  });
  check("POST /api/login credenciales malas → 401", badLogin.status === 401);

  const admin = adminCredentials();
  const adminLogin = await fetch(`${BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(admin),
  });
  const adminData = adminLogin.ok ? await adminLogin.json() : {};
  adminToken = adminData.adminToken || null;
  check("login admin → 200 + token", adminLogin.status === 200 && Boolean(adminToken));

  const ordersRes = await fetch(`${BASE}/api/orders`);
  check("GET /api/orders → 200", ordersRes.status === 200);

  // Doctor temporal para el flujo de navegador (se elimina al final)
  const suffix = randomBytes(4).toString("hex");
  tempDoctorEmail = `smoke-${suffix}@test.local`;
  const tempPassword = `Smoke-${suffix}!aA1`;
  const createRes = await fetch(`${BASE}/api/doctors`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-token": adminToken || "" },
    body: JSON.stringify({ email: tempDoctorEmail, name: "Dr Smoke Test", password: tempPassword }),
  });
  const created = createRes.ok ? await createRes.json() : {};
  check("POST /api/doctors crea doctor", createRes.status === 201);
  check("respuesta de alta no incluye contraseña", !JSON.stringify(created).includes('"password"'));

  const docLogin = await fetch(`${BASE}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: tempDoctorEmail, password: tempPassword }),
  });
  const docData = docLogin.ok ? await docLogin.json() : {};
  check("login doctor → 200 sin contraseña en respuesta", docLogin.status === 200 && docData.role === "doctor" && !JSON.stringify(docData).includes('"password"'));

  // --- Navegador ---
  const { chromium } = await import("playwright");
  // En Replit el chromium descargado por Playwright no tiene libs de sistema;
  // usar el binario del Nix store (o SMOKE_CHROMIUM) cuando exista.
  const nixChromium = globSync("/nix/store/*-playwright-chromium/chrome-linux/chrome")[0];
  const executablePath = process.env.SMOKE_CHROMIUM || nixChromium;
  const browser = await chromium.launch(executablePath ? { executablePath } : {});
  const page = await browser.newPage();
  const pageErrors = [];
  page.on("pageerror", (err) => pageErrors.push(String(err)));

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  check("carga sin errores de JS", pageErrors.length === 0, pageErrors.join(" | "));
  check("#login-screen visible al cargar", await page.locator("#login-screen").isVisible());

  await page.fill('input[name="loginEmail"]', tempDoctorEmail);
  await page.fill('input[name="loginPassword"]', tempPassword);
  await page.click('#login-form button[type="submit"]');
  await page.locator("#app-shell").waitFor({ state: "visible", timeout: 8000 });
  check("login → #app-shell visible", await page.locator("#app-shell").isVisible());
  check("login → #login-screen oculto", await page.locator("#login-screen").isHidden());

  if (SHOTS) mkdirSync(SHOTS_DIR, { recursive: true });
  const navButtons = await page.locator('.nav-item[data-view]:visible').all();
  for (const btn of navButtons) {
    const view = await btn.getAttribute("data-view");
    await btn.click();
    const active = await page.locator(`.view.active#${view}`).count();
    check(`vista ${view} activa al navegar`, active === 1);
    if (SHOTS) await page.screenshot({ path: `${SHOTS_DIR}/${view}.png`, fullPage: true });
  }

  check("sin errores de JS tras navegar", pageErrors.length === 0, pageErrors.join(" | "));

  // Flujo admin: login y render del panel
  const adminPage = await browser.newPage();
  const adminErrors = [];
  adminPage.on("pageerror", (err) => adminErrors.push(String(err)));
  await adminPage.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await adminPage.fill('input[name="loginEmail"]', admin.email);
  await adminPage.fill('input[name="loginPassword"]', admin.password);
  await adminPage.click('#login-form button[type="submit"]');
  await adminPage.locator("#app-shell").waitFor({ state: "visible", timeout: 8000 });
  check("admin → vista admin activa", (await adminPage.locator(".view.active#admin").count()) === 1);
  check("admin → lista de doctores renderiza", (await adminPage.locator(".admin-doctor-card").count()) >= 1);
  check("admin → tabla de órdenes renderiza", (await adminPage.locator(".admin-row").count()) >= 1);
  check("admin sin errores de JS", adminErrors.length === 0, adminErrors.join(" | "));
  if (SHOTS) await adminPage.screenshot({ path: `${SHOTS_DIR}/admin.png`, fullPage: true });

  await browser.close();
} catch (err) {
  check("ejecución sin excepciones", false, String(err));
} finally {
  // Limpieza: borrar el doctor temporal
  if (tempDoctorEmail && adminToken) {
    await fetch(`${BASE}/api/doctors/${encodeURIComponent(tempDoctorEmail)}`, {
      method: "DELETE",
      headers: { "x-admin-token": adminToken },
    }).catch(() => {});
  }
  server.kill();
}

console.log(failures === 0 ? "\nTodo OK" : `\n${failures} fallo(s)`);
process.exit(failures === 0 ? 0 : 1);
