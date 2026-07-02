// Extrae el HTML real y los assets de un export de Claude Design (bundler).
// Uso: node scripts/extract-design.mjs <export.html> <salida.html> [dir-assets]
// - El HTML de la página vive en <script type="__bundler/template">
// - Los assets (base64 por UUID) viven en <script type="__bundler/manifest">
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";

const [, , inputPath, outputPath, assetsDir = "img/design"] = process.argv;

if (!inputPath || !outputPath) {
  console.error("Uso: node scripts/extract-design.mjs <export.html> <salida.html> [dir-assets]");
  process.exit(1);
}

const source = readFileSync(inputPath, "utf-8");

function extractBlock(type) {
  const marker = `<script type="${type}"`;
  const start = source.indexOf(marker);
  if (start === -1) return null;
  const contentStart = source.indexOf(">", start) + 1;
  const end = source.indexOf("</script>", contentStart);
  return source.slice(contentStart, end).trim();
}

let template = extractBlock("__bundler/template");
if (!template) {
  console.error("No se encontró el bloque __bundler/template — ¿es un export de Claude Design?");
  process.exit(1);
}

// El template puede venir codificado (base64 o JSON-string)
if (!template.includes("<")) {
  try { template = Buffer.from(template, "base64").toString("utf-8"); } catch {}
}
if (template.startsWith('"')) {
  try { template = JSON.parse(template); } catch {}
}

// Decodificar manifest de assets y reescribir referencias UUID → archivos
const manifestRaw = extractBlock("__bundler/manifest");
let assetCount = 0;
if (manifestRaw) {
  let manifest = {};
  try {
    manifest = JSON.parse(manifestRaw);
  } catch {
    try { manifest = JSON.parse(Buffer.from(manifestRaw, "base64").toString("utf-8")); } catch {}
  }
  const extByMime = {
    "image/png": ".png", "image/jpeg": ".jpg", "image/svg+xml": ".svg",
    "image/webp": ".webp", "image/gif": ".gif", "font/woff2": ".woff2",
  };
  mkdirSync(assetsDir, { recursive: true });
  for (const [uuid, asset] of Object.entries(manifest)) {
    const data = asset?.data || asset?.content;
    if (!data) continue;
    const ext = extByMime[asset.mime || asset.mimeType] || "";
    const filename = `${uuid.slice(0, 8)}${ext}`;
    writeFileSync(join(assetsDir, filename), Buffer.from(data, "base64"));
    // Reescribir toda referencia al UUID en el template
    template = template.replaceAll(uuid, `${assetsDir}/${filename}`);
    assetCount++;
  }
}

writeFileSync(outputPath, template, "utf-8");
console.log(`✓ ${basename(outputPath)} extraído (${template.length} bytes, ${assetCount} assets → ${assetsDir})`);
