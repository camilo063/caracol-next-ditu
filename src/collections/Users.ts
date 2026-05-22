import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";

import { isAdmin, isAdminField, isAdminOrSelf } from "@/access";

const IS_PROD = process.env.NODE_ENV === "production";

/**
 * Password policy: 12+ chars, una mayúscula, un número, un símbolo.
 * Solo se valida en create o cuando el password viene en update.
 */
const enforcePasswordPolicy: CollectionBeforeChangeHook = ({ data, operation }) => {
  const pw = (data as { password?: unknown }).password;
  if (operation !== "create" && (typeof pw !== "string" || pw.length === 0)) {
    return data;
  }
  if (typeof pw !== "string" || pw.length === 0) {
    throw new Error("Password requerido.");
  }
  if (pw.length < 12) {
    throw new Error("Password mínimo 12 caracteres.");
  }
  if (!/[A-Z]/.test(pw)) {
    throw new Error("Password requiere al menos una mayúscula.");
  }
  if (!/[0-9]/.test(pw)) {
    throw new Error("Password requiere al menos un número.");
  }
  if (!/[^A-Za-z0-9]/.test(pw)) {
    throw new Error("Password requiere al menos un símbolo.");
  }
  return data;
};

/**
 * Users collection — auth + RBAC.
 * Roles: admin (full) · editor (CRUD contenido) · viewer (read-only).
 */
export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Usuario", plural: "Usuarios" },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role", "updatedAt"],
    group: "Configuración",
  },
  auth: {
    tokenExpiration: IS_PROD ? 60 * 60 * 2 : 60 * 60 * 24 * 7,
    maxLoginAttempts: 5,
    lockTime: 60 * 60 * 1000,
    cookies: {
      secure: IS_PROD,
      sameSite: "Lax",
    },
  },
  access: {
    admin: ({ req }) => Boolean(req.user),
    create: isAdmin,
    read: isAdmin,
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [enforcePasswordPolicy],
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: { description: "Nombre completo, visible en logs y admin UI." },
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      access: { update: isAdminField },
      options: [
        { label: "Admin (acceso total)", value: "admin" },
        { label: "Editor (CRUD contenido)", value: "editor" },
        { label: "Viewer (solo lectura)", value: "viewer" },
      ],
      admin: {
        description:
          "Solo un admin puede cambiar este campo. Editor no ve la lista de usuarios; viewer es read-only en admin.",
      },
    },
  ],
};
