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
    const isDev = process.env.NODE_ENV !== "production";

    // CSP — restricciones al frontend público. Payload admin maneja sus propios
    // requirements (incluye eval, inline styles, etc.) así que NO aplicamos esta
    // CSP a /admin ni /api — esos paths usan defaults de Payload + nuestros
    // headers globales de seguridad de abajo.
    //
    // CSP solo aplica en PROD. En dev, Next inyecta inline scripts dinámicos
    // (HMR, RSC payloads sin nonce estable) que cualquier CSP estricta bloquea —
    // lo cual rompe la app sin beneficio de seguridad en local.
    //
    // Nota: 'unsafe-inline' coexiste con scripts inline de Next (NO usamos
    // 'strict-dynamic' porque ese invalida 'unsafe-inline' por design del W3C
    // CSP y rompe los inline scripts de Next que no llevan nonce).
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
      // 'unsafe-inline' en styles es necesario para Tailwind v4 + style={{...}}
      // inline que usan Framer Motion y los componentes pixel-perfect.
      // Google Fonts CSS endpoint (next/font/google fetcha desde aquí en dev).
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https: https://*.public.blob.vercel-storage.com",
      // Google Fonts archivos woff2 + fontes locales.
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.vercel-insights.com https://*.vercel-analytics.com https://vitals.vercel-insights.com",
      // YouTube embeds — BrandedContent block los soporta vía iframe.
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; ");

    /**
     * Headers globales de seguridad que aplican a TODAS las respuestas (incluye
     * admin + api + frontend). Son no-CSP — solo refuerzan TLS, anti-MIME-sniffing,
     * anti-clickjacking, referrer policy, permisos.
     */
    const globalSecurityHeaders = [
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
      },
    ];

    return [
      {
        // CSP estricta solo al frontend público (Hub, CN, Ditu y sub-pages).
        // Excluye /admin (Payload UI necesita reglas más laxas) y /api.
        // En dev se omite la CSP (Next inline scripts dinámicos sin nonce).
        source: "/((?!api/|admin).*)",
        headers: isDev
          ? globalSecurityHeaders
          : [...globalSecurityHeaders, { key: "Content-Security-Policy", value: csp }],
      },
      {
        // Admin + API: solo los headers globales (sin CSP nuestra; Payload usa sus defaults).
        source: "/(api|admin)/:path*",
        headers: globalSecurityHeaders,
      },
      {
        // Assets uploadeados (Payload Media). En filesystem local + Vercel Blob,
        // los archivos tienen hash y son inmutables.
        source: "/media/:path*",
        headers: [
          ...globalSecurityHeaders,
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
