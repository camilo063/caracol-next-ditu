import type { CollectionConfig } from "payload";

import { adminsOnly, adminsOnlyField, authenticated } from "@/access";

/**
 * Users collection — auth + role-based access.
 * - admin: control total (puede crear/borrar otros usuarios).
 * - editor: puede crear/editar contenido pero no usuarios.
 */
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["name", "email", "role"],
  },
  auth: true,
  access: {
    create: adminsOnly,
    read: authenticated,
    update: authenticated, // los usuarios pueden editar su perfil; el field-level limita el role
    delete: adminsOnly,
    admin: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      defaultValue: "editor",
      access: {
        update: adminsOnlyField,
      },
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
      ],
      admin: {
        description: "Sólo admins pueden cambiar este campo.",
      },
    },
  ],
};
