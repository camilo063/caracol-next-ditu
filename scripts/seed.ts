/**
 * Seed orchestrator — pobla Payload con la data de demo-data.ts.
 *
 * Uso: `npm run seed`
 *
 * Idempotente: re-ejecutarlo no duplica records. Cada sub-script hace
 * lookup por unique key (filename, slug+landing, email, etc.).
 *
 * NUNCA correr en build de Vercel — sobreescribiría cambios del editor.
 * Solo manual one-shot por entorno (dev/preview/prod).
 *
 * Pre-flight: requiere PAYLOAD_SECRET y DATABASE_URI en environment.
 */

import { getPayload } from "payload";

import config from "@payload-config";

import { seedGlobals } from "./seed/seed-globals";
import { seedPages } from "./seed/seed-pages";
import { seedUsers } from "./seed/seed-users";
import { uploadAssets } from "./seed/upload-assets";

function assertEnv(name: string): void {
  if (!process.env[name]) {
    throw new Error(
      `Missing env var: ${name}. Cargar .env o .env.local antes de correr 'npm run seed'.`,
    );
  }
}

async function main(): Promise<void> {
  assertEnv("PAYLOAD_SECRET");
  assertEnv("DATABASE_URI");

  const t0 = Date.now();
  console.log("🌱 Iniciando seed...\n");

  const payload = await getPayload({ config });

  // 1. Subir assets (media collection) → Map<publicPath, mediaId>.
  const assetMap = await uploadAssets(payload);
  console.log("");

  // 2. Crear admin user (idempotente).
  await seedUsers(payload);
  console.log("");

  // 3. Seedear todos los globals.
  await seedGlobals(payload, assetMap);
  console.log("");

  // 4. Seedear las 2 pages base.
  await seedPages(payload, assetMap);
  console.log("");

  const dt = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`✅ Seed completo en ${dt}s.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ Seed falló:");
  console.error(err);
  process.exit(1);
});
