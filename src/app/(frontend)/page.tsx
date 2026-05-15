import Link from "next/link";

/**
 * Home — Caracol Next (placeholder Fase 0).
 * El contenido real se construye en Fase 3/4 del Prompt 3 con Payload Blocks.
 */
export default function HomePage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-2xl space-y-6 text-center">
        <p className="text-primary text-sm font-semibold tracking-wide uppercase">
          Caracol Next
        </p>
        <h1 className="font-display text-5xl leading-tight font-black md:text-7xl">
          Mediakit en construcción
        </h1>
        <p className="text-muted-foreground text-lg">
          Estás viendo el shell inicial del proyecto. Admin Payload disponible en{" "}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/admin" className="text-primary underline">
            /admin
          </a>
          . Landing Ditu disponible en{" "}
          <Link href="/ditu" className="text-primary underline">
            /ditu
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
