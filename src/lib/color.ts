import type { FieldHook, TextField, TextFieldSingleValidation } from "payload";

/**
 * color — normalización de los hex que se escriben a mano en el admin.
 *
 * Todos los colores del CMS son campos de texto donde el editor pega un hex.
 * El cliente reportó que cambiar el color de una categoría a violeta oscuro no
 * cambiaba nada: había guardado `12082D`, sin el `#`. Ese valor viaja tal cual
 * al `style` del badge, el navegador lo descarta por inválido y el resultado es
 * un badge sin fondo y con el borde en `currentColor` — no un error, solo un
 * badge que no cambia. Copiar el hex sin `#` desde el texto de ayuda es lo más
 * natural del mundo, así que el CMS tiene que aceptarlo.
 *
 * `normalizeHexColor` acepta lo que la gente realmente escribe —con o sin `#`,
 * en mayúsculas o minúsculas, de 3 o de 6 dígitos, con espacios alrededor— y
 * devuelve siempre la forma larga con `#` y en mayúsculas. Lo que no sea un hex
 * devuelve `null`, para que el llamador decida si eso es un error de validación
 * o un valor a ignorar.
 */

const HEX = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

/** Hex normalizado a `#RRGGBB`, o `null` si el valor no es un hex. */
export function normalizeHexColor(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const match = value.trim().match(HEX);
  if (!match) return null;
  const digits = match[1];
  const full = digits.length === 3 ? digits.replace(/(.)/g, "$1$1") : digits;
  return `#${full.toUpperCase()}`;
}

/**
 * Igual que `normalizeHexColor`, pero devuelve el fallback cuando el valor no
 * sirve. Para el render: un color inválido en la base no puede romper la página.
 */
export function hexColorOr(value: unknown, fallback: string): string {
  return normalizeHexColor(value) ?? fallback;
}

/**
 * Props a esparcir en cualquier campo de texto que guarde un hex.
 *
 * Normaliza al guardar —así el valor queda bien en la base y no solo en el
 * render— y rechaza lo que no sea un hex con un mensaje que dice qué se
 * esperaba. Vacío sigue siendo válido: varios de estos campos son opcionales y
 * su ausencia significa "usa el color por defecto".
 */
export const hexColorFieldProps: {
  hooks: TextField["hooks"];
  validate: TextFieldSingleValidation;
} = {
  hooks: {
    beforeValidate: [
      (({ value }) => normalizeHexColor(value) ?? value) satisfies FieldHook,
    ],
  },
  validate: (value, options) => {
    // Un `validate` propio reemplaza al de Payload, y el suyo es el que hace
    // cumplir `required`. Sin esto, poner estas props en un campo obligatorio
    // —`Brands.color` lo es— dejaría pasar el vacío hasta el NOT NULL de la base.
    if (value === undefined || value === null || value === "") {
      return (options as { required?: boolean })?.required
        ? "Este campo es obligatorio."
        : true;
    }
    return (
      normalizeHexColor(value) !== null ||
      "Escribe un color en hexadecimal, por ejemplo #12082D. Se acepta con o sin #."
    );
  },
};
