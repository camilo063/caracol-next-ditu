import type { CollectionConfig } from "payload";

/**
 * Stub mínimo de auth para que Payload arranque (Fase 0).
 * En Fase 2 del Prompt 3 se expande con roles/permissions reales.
 */
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
  },
  auth: true,
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [],
};
