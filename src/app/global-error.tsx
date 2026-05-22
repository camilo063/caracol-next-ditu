"use client";

/**
 * global-error.tsx — error boundary de último recurso. Renderea su propio
 * <html> + <body> porque ocurre fuera del root layout (e.g. crash en layout).
 *
 * Diseño minimal — el frontend pixel-perfect no aplica acá; solo dar un
 * mensaje claro + CTA recargar.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es-CO">
      <body
        style={{
          backgroundColor: "#003381",
          color: "#FFFFFF",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <p
          style={{
            color: "#00ACFF",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontSize: "14px",
          }}
        >
          Error inesperado
        </p>
        <h1
          style={{
            marginTop: "16px",
            fontSize: "clamp(32px, 5vw, 56px)",
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          Algo se rompió en nuestro servidor.
        </h1>
        <p
          style={{
            marginTop: "16px",
            maxWidth: "640px",
            color: "rgba(255,255,255,0.8)",
            fontSize: "16px",
          }}
        >
          Estamos trabajando en arreglarlo. Intenta recargar la página o vuelve más tarde.
        </p>
        {error.digest ? (
          <p
            style={{
              marginTop: "12px",
              fontSize: "12px",
              color: "rgba(255,255,255,0.5)",
              fontFamily: "ui-monospace, monospace",
            }}
          >
            ref: {error.digest}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: "32px",
            backgroundColor: "#00ACFF",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "4px",
            padding: "12px 32px",
            fontSize: "16px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Recargar
        </button>
      </body>
    </html>
  );
}
