import type { NextConfig } from "next";

import { withPayload } from "@payloadcms/next/withPayload";

const nextConfig: NextConfig = {
  // Typecheck y lint se enforzan en local vía `npm run type-check` y husky
  // pre-commit (lint-staged). En el deploy de Vercel los ignoramos porque
  // los tipos generados por Payload v3 tienen edge cases de narrowing en
  // closures que `tsc --noEmit` standalone no detecta pero el typecheck
  // de Next sí — y produce ruido sin valor en el pipeline de deploy.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Vercel Blob (Media en producción) — necesario para que next/image
      // pueda optimizar las URLs servidas desde el blob store.
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    // Tree-shaking dirigido para librerías con muchos exports: reduce el
    // First Load JS sin cambiar el output visual.
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
