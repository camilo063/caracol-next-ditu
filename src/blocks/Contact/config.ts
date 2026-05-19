import type { Block } from "payload";

import { anchorIdField, ctaField, sectionHeaderFields } from "../shared-fields";

/**
 * ContactBlock — sección de contacto al final de cada landing.
 * "Más accionable, con ancla desde el header. Reducir fricción para cerrar."
 *
 * Usa el plugin @payloadcms/plugin-form-builder para el formulario.
 * Los representantes se renderizan junto al form para llamada directa por WhatsApp / email.
 */
export const ContactBlock: Block = {
  slug: "contact",
  labels: { singular: "Contacto", plural: "Contacto" },
  fields: [
    anchorIdField,
    ...sectionHeaderFields,
    {
      name: "headingEmphasis",
      type: "text",
      label: "Heading énfasis (bold, segunda línea)",
      admin: {
        description:
          "Texto que aparece en negrita debajo del heading. Para el cierre tipo 'Con nosotros, lleva tu marca' + 'al siguiente nivel.'",
        placeholder: "al siguiente nivel.",
      },
    },
    ctaField({
      name: "ctaButton",
      label: "Botón CTA (solo layout cta-simple)",
    }),
    {
      name: "form",
      type: "relationship",
      relationTo: "forms",
      label: "Formulario asociado",
      required: false,
      admin: {
        description:
          "Crea el formulario en Forms y aquí lo referencias. Si vacío, se muestra solo la lista de representantes.",
      },
    },
    {
      name: "representatives",
      type: "array",
      label: "Representantes comerciales",
      labels: { singular: "Representante", plural: "Representantes" },
      admin: { initCollapsed: true },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "role", type: "text", admin: { placeholder: "Ejecutiva de cuentas" } },
        { name: "email", type: "email", required: true },
        {
          name: "whatsapp",
          type: "text",
          required: true,
          admin: {
            description: "Solo dígitos (incl. cód. país). Ej. 573001234567",
            placeholder: "573001234567",
          },
        },
        { name: "photo", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "layout",
      type: "select",
      defaultValue: "form-reps",
      options: [
        { label: "Form izquierda + reps derecha", value: "form-reps" },
        { label: "Form full width, reps abajo", value: "stacked" },
        { label: "Solo reps (sin form)", value: "reps-only" },
        { label: "Solo form (sin reps)", value: "form-only" },
        {
          label: "CTA simple (heading + descripción + botón)",
          value: "cta-simple",
        },
      ],
    },
  ],
};
