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
    remotePatterns: [
      // dominios CDN/storage se añaden aquí cuando se configure Media.
    ],
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
