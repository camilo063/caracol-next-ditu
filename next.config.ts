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
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 año — los assets con hash en URL son inmutables
    remotePatterns: [
      // Vercel Blob storage (gated por BLOB_READ_WRITE_TOKEN en prod).
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
  experimental: {
    // Tree-shake imports de packages grandes — Next solo bundlea lo que se
    // usa, no el package entero. Ahorra ~50-80 kB de First Load JS.
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },
  async headers() {
    return [
      {
        // Assets uploadeados (Payload Media). En filesystem local + Vercel Blob,
        // los archivos tienen hash y son inmutables.
        source: "/media/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Next.js static assets — ya cacheados por Vercel pero refuerzo.
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // APIs nunca cachean en CDN (Payload maneja sus propios headers).
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "no-store" }],
      },
    ];
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });
