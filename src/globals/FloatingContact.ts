import type { GlobalConfig } from "payload";

import { authenticated, publishedOrAuth } from "@/access";
import { globalTag, revalidateTag } from "@/lib/payload/cache-tags";

/**
 * FloatingContact — implementa la NOTA TÉCNICA del Figma (node 899:4832).
 *
 * - Botón flotante visible en ambas landings.
 * - Click abre panel con representantes (mailto: + wa.me/).
 * - Fade-in 300ms ease (animación se implementa en Fase 3 con tw-animate-css).
 *
 * Compartido entre `/` y `/ditu` — el theme se hereda de la página donde se monta.
 */
export const FloatingContact: GlobalConfig = {
  slug: "floating-contact",
  label: "Botón flotante de contacto",
  access: {
    read: publishedOrAuth,
    update: authenticated,
  },
  hooks: {
    afterChange: [
      async () => revalidateTag(globalTag("floating-contact"), { expire: 0 }),
    ],
  },
  fields: [
    {
      name: "enabled",
      type: "checkbox",
      label: "Mostrar botón flotante",
      defaultValue: true,
    },
    {
      name: "buttonLabel",
      type: "text",
      label: "Texto del botón flotante",
      defaultValue: "Contáctanos",
    },
    {
      name: "buttonIcon",
      type: "select",
      defaultValue: "MessageCircle",
      options: [
        { label: "MessageCircle", value: "MessageCircle" },
        { label: "PhoneCall", value: "PhoneCall" },
        { label: "Sparkles", value: "Sparkles" },
        { label: "Mail", value: "Mail" },
      ],
    },
    {
      name: "panelHeading",
      type: "text",
      defaultValue: "Habla con nuestro equipo",
    },
    {
      name: "panelDescription",
      type: "textarea",
      defaultValue: "Escríbenos por correo o WhatsApp. Te respondemos en menos de 24 h.",
    },
    {
      name: "representatives",
      type: "array",
      label: "Representantes",
      labels: { singular: "Representante", plural: "Representantes" },
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: "name", type: "text", required: true },
        { name: "role", type: "text" },
        { name: "email", type: "email", required: true },
        {
          name: "whatsapp",
          type: "text",
          required: true,
          admin: { placeholder: "573001234567" },
        },
        { name: "photo", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "position",
      type: "select",
      defaultValue: "bottom-right",
      options: [
        { label: "Esquina inferior derecha", value: "bottom-right" },
        { label: "Esquina inferior izquierda", value: "bottom-left" },
      ],
    },
  ],
};
