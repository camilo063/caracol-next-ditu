import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat, Poppins, Spline_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { getSiteSettings } from "@/lib/cms";

import "@/styles/globals.css";

/** Montserrat — fuente principal de Caracol Next + Hub. */
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

/** Poppins — eyebrow/tags Caracol Next (Figma). */
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

/** Spline Sans — fuente secundaria de Ditu (body / UI). */
const splineSans = Spline_Sans({
  variable: "--font-spline-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/** Ditu Display — fuente propia (display/headings de Ditu). */
const dituDisplay = localFont({
  variable: "--font-ditu-display",
  display: "swap",
  src: [
    {
      path: "../../../public/fonts/Ditu-Display-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/Ditu-Display-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Caracol Next + Ditu — Mediakit",
    template: "%s · Caracol Next",
  },
  description:
    "Mediakit oficial Caracol Next + Ditu. Audiencia, formatos de pauta y momentos clave del ecosistema Caracol.",
  applicationName: "Caracol Next + Ditu",
};

export default async function FrontendLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();
  const maintenanceMode = settings.maintenanceMode.enabled;

  // JSON-LD Organization schema — visible para crawlers + Rich Results.
  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName,
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
    description: settings.defaultSeo.description,
  };

  return (
    <html
      lang="es-CO"
      className={`${montserrat.variable} ${poppins.variable} ${splineSans.variable} ${dituDisplay.variable} h-full antialiased`}
    >
      {/* suppressHydrationWarning: extensiones de navegador (Grammarly, etc.)
          inyectan atributos como `data-new-gr-c-s-check-loaded` en <body>
          antes de la hydration de React, causando mismatch warnings. */}
      <body
        className="bg-background text-foreground flex min-h-full flex-col font-sans"
        suppressHydrationWarning
      >
        {/* JSON-LD Organization — alimenta Rich Results / Knowledge Panel. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {maintenanceMode ? (
          <MaintenancePage message={settings.maintenanceMode.message} />
        ) : (
          children
        )}
        {/* Vercel Analytics + Speed Insights — no-op fuera de Vercel (e.g. AWS).
            Recoge Core Web Vitals + Web Analytics gratis en plan Hobby+. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

/**
 * Maintenance page — visible cuando un admin activa
 * `site-settings.maintenanceMode.enabled` desde `/admin`. Reemplaza TODA la
 * navegación pública con un mensaje + bg navy del Hub.
 */
function MaintenancePage({ message }: { message: string }) {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center text-white"
      style={{ backgroundColor: "#003381" }}
    >
      <p
        className="font-display text-[14px] font-bold uppercase sm:text-[16px]"
        style={{ color: "#00ACFF", letterSpacing: "0.1em" }}
      >
        Mantenimiento
      </p>
      <h1
        className="font-display mt-4 text-[36px] font-extrabold tracking-tight sm:text-[56px] lg:text-[72px]"
        style={{ lineHeight: 1.05 }}
      >
        Volvemos pronto.
      </h1>
      <p className="mt-6 max-w-xl text-[16px] text-white/85 sm:text-[18px]">{message}</p>
    </div>
  );
}
