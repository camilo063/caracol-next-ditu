import type { Access, FieldAccess } from "payload";

/**
 * Roles soportados en el CMS.
 * - admin: control total (CRUD users, settings críticos, contenido).
 * - editor: CRUD contenido (pages, globals, media, categories). No users/settings.
 * - viewer: read-only en admin (preview, debug).
 */
export type Role = "admin" | "editor" | "viewer";

const userHasRole = (user: unknown, allowed: Role[]): boolean => {
  if (!user || typeof user !== "object") return false;
  const role = (user as { role?: unknown }).role;
  return typeof role === "string" && (allowed as string[]).includes(role);
};

/** Cualquiera (también anónimos) puede leer. Para contenido público. */
export const anyone: Access = () => true;

/** Sólo usuarios autenticados. */
export const authenticated: Access = ({ req }) => Boolean(req.user);

/** Sólo usuarios con role=admin. */
export const isAdmin: Access = ({ req }) => userHasRole(req.user, ["admin"]);

/** Admin o editor — para mutaciones de contenido. */
export const isAdminOrEditor: Access = ({ req }) =>
  userHasRole(req.user, ["admin", "editor"]);

/**
 * Admin, o el propio usuario sobre su propio documento.
 * Útil para Users.update — editors solo modifican su propio perfil.
 */
export const isAdminOrSelf: Access = ({ req, id }) => {
  const user = req.user;
  if (!user) return false;
  if (userHasRole(user, ["admin"])) return true;
  const userId = (user as { id?: string | number }).id;
  return userId !== undefined && userId === id;
};

/**
 * Lectura pública de documentos publicados; los borradores sólo se ven autenticados.
 * Para collections con drafts (Pages).
 */
export const publishedOrAuth: Access = ({ req }) => {
  if (req.user) return true;
  return {
    _status: { equals: "published" },
  };
};

/** Field-level: sólo admin puede modificar este campo. */
export const isAdminField: FieldAccess = ({ req }) => userHasRole(req.user, ["admin"]);

/** Field-level: admin o editor pueden modificar. */
export const isAdminOrEditorField: FieldAccess = ({ req }) =>
  userHasRole(req.user, ["admin", "editor"]);
