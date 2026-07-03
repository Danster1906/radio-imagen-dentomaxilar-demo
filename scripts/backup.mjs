// Respaldo de la base de datos PostgreSQL con pg_dump (formato custom).
// Uso: npm run backup  →  genera backups/backup-YYYYMMDD-HHMMSS.dump
// Restaurar en cualquier proveedor Postgres:
//   pg_restore --clean --if-exists -d "$NUEVA_DATABASE_URL" backups/backup-....dump
import { spawnSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL no está configurada.");
  process.exit(1);
}

mkdirSync("backups", { recursive: true });
const stamp = new Date()
  .toISOString()
  .slice(0, 19)
  .replace(/[-:]/g, "")
  .replace("T", "-");
const file = `backups/backup-${stamp}.dump`;

const result = spawnSync("pg_dump", ["-Fc", "-f", file, process.env.DATABASE_URL], { stdio: "inherit" });

if (result.error?.code === "ENOENT") {
  console.error("pg_dump no está instalado en este entorno.");
  process.exit(1);
}
if (result.status !== 0) {
  console.error("pg_dump terminó con error.");
  process.exit(result.status || 1);
}

const size = statSync(file).size;
console.log(`Respaldo creado: ${file} (${(size / 1024).toFixed(1)} KB)`);
console.log(`Para restaurar: pg_restore --clean --if-exists -d "$NUEVA_DATABASE_URL" ${file}`);
