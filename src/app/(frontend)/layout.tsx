import type { Metadata } from "next";
import localFont from "next/font/local";
import { Montserrat, Poppins, Spline_Sans } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

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

export default function FrontendLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
        {children}
        {/* Vercel Analytics + Speed Insights — no-op fuera de Vercel (e.g. AWS).
            Recoge Core Web Vitals + Web Analytics gratis en plan Hobby+. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
