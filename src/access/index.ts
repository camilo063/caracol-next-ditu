import type { Access, FieldAccess } from "payload";

/** Cualquiera (también anónimos) pueden leer. Para contenido público. */
export const anyone: Access = () => true;

/** Sólo usuarios autenticados. */
export const authenticated: Access = ({ req }) => Boolean(req.user);

/** Sólo usuarios con role=admin. */
export const adminsOnly: Access = ({ req }) => req.user?.role === "admin";

/** Lectura pública de documentos publicados; los borradores sólo se ven autenticados. */
export const publishedOrAuth: Access = ({ req }) => {
  if (req.user) return true;
  return {
    _status: { equals: "published" },
  };
};

/** Field-level: sólo admin puede modificar este campo. */
export const adminsOnlyField: FieldAccess = ({ req }) => req.user?.role === "admin";
