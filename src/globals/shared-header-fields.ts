import type { Field } from "payload";

/**
 * Campos compartidos entre HeaderCaracolNext y HeaderDitu.
 * Aislamos en un módulo para mantener consistencia entre ambos Globals
 * sin acoplar via herencia (que Payload no soporta naturalmente).
 */
export const headerSharedFields: Field[] = [
  {
    name: "logo",
    type: "upload",
    relationTo: "media",
    required: false,
    admin: { description: "Logo principal (versión clara para fondos oscuros)." },
  },
  {
    name: "logoDark",
    type: "upload",
    relationTo: "media",
    required: false,
    admin: { description: "Logo alterno (versión oscura para fondos claros). Opcional." },
  },
  {
    name: "navAnchors",
    type: "array",
    label: "Ítems del nav (anclas internas)",
    labels: { singular: "Ítem", plural: "Ítems" },
    minRows: 1,
    fields: [
      { name: "label", type: "text", required: true },
      {
        name: "anchorId",
        type: "text",
        required: true,
        admin: {
          description: "ID de ancla del block destino, sin #. Ej. 'momentos'.",
          placeholder: "audiencia",
        },
      },
    ],
  },
  {
    name: "ctaButton",
    type: "group",
    label: "Botón CTA del header (opcional)",
    fields: [
      { name: "enabled", type: "checkbox", defaultValue: true },
      { name: "label", type: "text", defaultValue: "Quiero pautar" },
      { name: "href", type: "text", defaultValue: "#contacto" },
      {
        name: "openInNewTab",
        type: "checkbox",
        defaultValue: false,
        label: "Abrir el enlace en una pestaña nueva",
      },
      {
        name: "variant",
        type: "select",
        defaultValue: "default",
        options: [
          { label: "Default", value: "default" },
          { label: "Outline", value: "outline" },
          { label: "Brand Caracol Next", value: "brand-caracolnext" },
          { label: "Brand Ditu", value: "brand-ditu" },
        ],
      },
    ],
  },
  {
    name: "sticky",
    type: "checkbox",
    label: "Header sticky en scroll",
    defaultValue: true,
  },
];
