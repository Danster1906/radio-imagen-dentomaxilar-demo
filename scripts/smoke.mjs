// Smoke test de UI: login doctor/clínica/admin y flujos básicos.
// Uso: node scripts/smoke.mjs  (requiere el servidor corriendo en :5000)
import { chromium } from "playwright";
import { execSync } from "node:child_process";

const BASE = "http://localhost:5000";
const errors = [];

function findChromium() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  try {
    return execSync("ls -d /nix/store/*ungoogled-chromium-131*/bin/chromium 2>/dev/null | head -1")
      .toString()
      .trim() || undefined;
  } catch {
    return undefined;
  }
}

const executablePath = findChromium();
const browser = await chromium.launch(executablePath ? { executablePath } : {});
const page = await browser.newPage();
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (msg) => {
  if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
});

async function login(email, password) {
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  await page.fill('input[name="loginEmail"]', email);
  await page.fill('input[name="loginPassword"]', password);
  await page.click('#login-form button[type="submit"]');
  await page.waitForSelector("#app-shell:not([hidden])", { timeout: 8000 });
  await page.waitForTimeout(1600);
}

// --- Doctor personal ---
await login("sofia.herrera@consulta.mx", "Dentista2026!");
const metricActive = await page.textContent('[data-metric="activeOrders"]');
const orderRows = await page.locator("#doctor-order-list .order-row").count();
console.log("PERSONAL — métricas activas:", metricActive?.trim(), "| filas de órdenes:", orderRows);

await page.click('[data-view="new-order"]');
await page.waitForTimeout(300);
const clinicFieldHiddenForPersonal = await page.locator('[data-clinic-only]').first().isHidden();
console.log("PERSONAL — campo doctor tratante oculto:", clinicFieldHiddenForPersonal);

await page.click('[data-view="profile"]');
await page.waitForTimeout(300);
console.log("PERSONAL — nombre en form de perfil:", await page.inputValue('#profile-form input[name="doctorName"]'));

// --- Cuenta clínica ---
await login("clinica.dental@sonrisa.mx", "Clinica2026!");
await page.click('[data-view="new-order"]');
await page.waitForTimeout(600);
const clinicFieldVisible = await page.locator('#treating-doctor-select').isVisible();
const rosterOptions = await page.locator("#treating-doctor-select option").allTextContents();
console.log("CLÍNICA — select visible:", clinicFieldVisible, "| opciones:", rosterOptions.join(" / "));

// crear orden eligiendo "+ Agregar nuevo doctor"
await page.fill('input[name="patientName"]', "Paciente Smoke UI");
await page.fill('input[name="birthDate"]', "1990-05-10");
await page.fill('input[name="phone"]', "33 5555 4444");
await page.selectOption("#treating-doctor-select", "__new__");
await page.waitForTimeout(200);
const newFieldVisible = await page.locator('input[name="newTreatingDoctor"]').isVisible();
console.log("CLÍNICA — input nuevo doctor visible tras elegir '+ Agregar':", newFieldVisible);
await page.fill('input[name="newTreatingDoctor"]', "Dra. Laura Ortiz");
await page.click('#study-grid input[value="Ortopantomografía"]');
await page.click('#order-form button[type="submit"]');
await page.waitForTimeout(1500);
const toastText = await page.textContent("#toast");
console.log("CLÍNICA — toast tras enviar orden:", toastText?.trim());

await page.click('[data-view="new-order"]');
await page.waitForTimeout(400);
const rosterAfter = await page.locator("#treating-doctor-select option").allTextContents();
console.log("CLÍNICA — roster tras la orden:", rosterAfter.join(" / "));

// --- Consulta plus (como doctor personal, sesión aún activa antes del admin) ---
await login("sofia.herrera@consulta.mx", "Dentista2026!");
await page.click('[data-view="future"]');
await page.waitForTimeout(800);
const plusButtons = await page.locator("[data-plus-module]").count();
const kpisBtn = page.locator('[data-plus-module="kpis"]');
if (await kpisBtn.isEnabled()) {
  await kpisBtn.click();
  await page.waitForTimeout(800);
}
const kpisLabel = await kpisBtn.textContent();
console.log("CONSULTA PLUS — botones:", plusButtons, "| KPIs tras clic:", kpisLabel?.trim());

// --- Admin ---
await login("admin@radioimagen.mx", "RadioImagen2026!");
const adminRows = await page.locator("#admin-order-table .admin-row").count();
const treatingLabels = await page.locator(".treating-doctor-label").allTextContents();
const chips = await page.locator("#admin-doctor-list .admin-doctor-card header").allTextContents();
console.log("ADMIN — filas de órdenes:", adminRows);
console.log("ADMIN — etiquetas 'Atiende':", treatingLabels.join(" | ") || "(ninguna)");
console.log("ADMIN — tarjetas de cuentas:", chips.map((c) => c.replace(/\s+/g, " ").trim()).join(" || "));
const plusSummary = await page.locator("#plus-interest-summary").textContent();
console.log("ADMIN — resumen Consulta plus:", plusSummary?.replace(/\s+/g, " ").trim().slice(0, 120));

// --- Subida real por dropzone (archivo de 20 MB → 2 fragmentos) ---
import { writeFileSync, rmSync } from "node:fs";
import { randomBytes } from "node:crypto";
const testFile = "/tmp/claude-1000/estudio_smoke_ui.zip";
writeFileSync(testFile, randomBytes(20 * 1024 * 1024));

await page.click('[data-admin-section="results"]');
await page.waitForTimeout(500);
const dropzoneVisible = await page.locator("#upload-dropzone").isVisible();
console.log("ADMIN — dropzone visible:", dropzoneVisible);
await page.selectOption("#manual-upload-order", "ORD-2026-0004");
await page.setInputFiles("#upload-file-input", testFile);
await page.waitForSelector(".upload-item--done", { timeout: 90000 });
const uploadStatus = await page.locator(".upload-item-status").first().textContent();
console.log("ADMIN — subida por UI:", uploadStatus?.trim());
await page.waitForTimeout(1200);
const deliveredText = await page.locator("#delivered-files").textContent();
console.log("ADMIN — archivos entregados incluye pendiente:", deliveredText?.includes("Pendiente de descarga"));
rmSync(testFile, { force: true });

// --- Doctor ve el archivo con aviso de descarga única ---
await login("sofia.herrera@consulta.mx", "Dentista2026!");
await page.click('[data-view="results"]');
await page.waitForTimeout(600);
const downloadBtn = page.locator('[data-download-order="ORD-2026-0004"]').first();
if (await downloadBtn.count()) {
  await downloadBtn.click();
  await page.waitForTimeout(1000);
  const modalText = await page.locator("#download-file-list").textContent();
  console.log("DOCTOR — modal muestra descarga única:", modalText?.includes("Descarga única"));
  await page.click("#close-download-modal");
} else {
  console.log("DOCTOR — (orden ORD-2026-0004 no visible en resultados)");
}

await browser.close();

if (errors.length) {
  console.log("\n=== ERRORES JS ===");
  errors.forEach((e) => console.log(" -", e));
  process.exit(1);
} else {
  console.log("\nSin errores de JS en consola. SMOKE OK");
}
