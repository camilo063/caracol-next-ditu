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
    // Un admin puede editar a cualquier usuario; un editor solo su propio
    // documento (el field-level access además impide que cambie su role).
    update: ({ req }) => {
      if (!req.user) return false;
      if (req.user.role === "admin") return true;
      return { id: { equals: req.user.id } };
    },
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
