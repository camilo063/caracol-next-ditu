import type { GlobalConfig } from "payload";

import { authenticated, publishedOrAuth } from "@/access";
import { globalTag, revalidateTag } from "@/lib/payload/cache-tags";
import { networkOptions } from "@/blocks/shared-fields";

export const FooterDitu: GlobalConfig = {
  slug: "footer-ditu",
  label: "Footer — Ditu",
  access: {
    read: publishedOrAuth,
    update: authenticated,
  },
  hooks: {
    afterChange: [async () => revalidateTag(globalTag("footer-ditu"))],
  },
  fields: [
    {
      name: "encuentranosLabel",
      type: "text",
      label: 'Label "Encuentranos"',
      defaultValue: "Encuentranos",
    },
    {
      name: "socialLinks",
      type: "array",
      label: "Redes sociales",
      labels: { singular: "Red", plural: "Redes" },
      fields: [
        {
          name: "network",
          type: "select",
          required: true,
          options: networkOptions as unknown as { label: string; value: string }[],
        },
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "bottomLine",
      type: "text",
      label: "Linea inferior (legales / copyright)",
      defaultValue: "© Caracol Medios. Todos los derechos reservados.",
    },
  ],
};
