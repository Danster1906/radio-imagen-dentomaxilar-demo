// Corre la creación de tablas y el seed desde data/*.json manualmente.
// El servidor lo hace solo al arrancar; este script sirve para verificar antes de deployar.
import { initDb, closeDb } from "../db.js";

try {
  await initDb();
  console.log("Migración/seed completado.");
} catch (err) {
  console.error("Error en la migración:", err.message);
  process.exitCode = 1;
} finally {
  await closeDb();
}
