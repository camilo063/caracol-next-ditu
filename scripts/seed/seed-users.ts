import type { Payload } from "payload";

const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@caracoltv.com.co";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "CaracolCMS2026!";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? "Admin Caracol";

/**
 * Crea (idempotentemente) el usuario admin inicial.
 *
 * - Password default: "CaracolCMS2026!" (cumple la policy: 15 chars,
 *   mayúscula, número, símbolo).
 * - Sobreescribir via SEED_ADMIN_PASSWORD env var en CI/prod.
 * - Documentar al cliente que debe cambiar el password en primer login.
 */
export async function seedUsers(payload: Payload): Promise<void> {
  console.log("👤 Seedeando admin user...");

  const existing = await payload.find({
    collection: "users",
    where: { email: { equals: ADMIN_EMAIL } },
    limit: 1,
  });

  if (existing.docs.length > 0) {
    console.log(`  ↻ Admin ${ADMIN_EMAIL} ya existe (id=${existing.docs[0]!.id})`);
    return;
  }

  const created = await payload.create({
    collection: "users",
    data: {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      name: ADMIN_NAME,
      role: "admin",
    },
  });

  console.log(`  + Admin creado: ${ADMIN_EMAIL} (id=${created.id})`);
  console.log(`  ⚠ Password temporal: ${ADMIN_PASSWORD} — CAMBIAR EN PRIMER LOGIN.`);
}
