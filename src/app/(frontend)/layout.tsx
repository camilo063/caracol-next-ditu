import type { Metadata } from "next";
import { Montserrat, Spline_Sans } from "next/font/google";

import "@/styles/globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800", "900"],
  display: "swap",
});

const splineSans = Spline_Sans({
  variable: "--font-spline-sans",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
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
      className={`${montserrat.variable} ${splineSans.variable} h-full antialiased`}
    >
      <body className="bg-background text-foreground flex min-h-full flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
