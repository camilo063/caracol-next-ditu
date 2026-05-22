import Link from "next/link";

import { Button } from "@/components/ui";

/**
 * 404 — branded.
 * Bg navy (#003381) matchea el Hub Landing. Mensaje + CTA volver a home.
 */
export default function NotFound() {
  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center text-white"
      style={{ backgroundColor: "#003381" }}
    >
      <p
        className="font-display text-[14px] font-bold uppercase sm:text-[16px]"
        style={{ color: "#00ACFF", letterSpacing: "0.1em" }}
      >
        Error 404
      </p>
      <h1
        className="font-display mt-4 text-[44px] font-extrabold tracking-tight sm:text-[64px] lg:text-[80px]"
        style={{ lineHeight: 1.05 }}
      >
        Página no encontrada.
      </h1>
      <p className="mt-6 max-w-xl text-[16px] text-white/80 sm:text-[18px]">
        La página que buscas no existe o fue movida. Vuelve al inicio para seguir
        navegando el ecosistema Caracol.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
        <Button asChild size="lg">
          <Link
            href="/"
            style={{
              backgroundColor: "#00ACFF",
              borderColor: "#00ACFF",
              color: "#FFFFFF",
            }}
          >
            Volver al inicio
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/caracol-next" className="!border-white !text-white">
            Conoce Caracol Next
          </Link>
        </Button>
      </div>
    </div>
  );
}
