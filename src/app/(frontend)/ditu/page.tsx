/**
 * Ditu — `/ditu` landing (placeholder Fase 0).
 * Aplica clase `theme-ditu` para que el primary se sobreescriba a violeta Ditu.
 * El contenido real se construye en Fase 3/4 del Prompt 3.
 */
export default function DituPage() {
  return (
    <main className="theme-ditu bg-background flex flex-1 items-center justify-center px-6 py-24">
      <div className="max-w-2xl space-y-6 text-center">
        <p className="text-primary text-sm font-semibold tracking-wide uppercase">Ditu</p>
        <h1 className="font-display text-5xl leading-tight font-black md:text-7xl">
          Plataforma de entretenimiento
        </h1>
        <p className="text-muted-foreground text-lg">
          Landing Ditu en construcción. Tono propio: entretenimiento y calidez.
        </p>
      </div>
    </main>
  );
}
