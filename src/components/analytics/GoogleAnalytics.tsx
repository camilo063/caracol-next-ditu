/**
 * GoogleAnalytics — inyecta el snippet de Google Analytics administrable
 * desde SiteSettings.analytics (Payload).
 *
 * Se renderiza SOLO cuando:
 *   1. El checkbox `enabled` está activo en el admin, y
 *   2. El deploy corre en ambiente de producción.
 *
 * El snippet pegado por el cliente (etiquetas <script> completas) se inserta
 * tal cual vía dangerouslySetInnerHTML. Al venir en el HTML server-rendered,
 * el navegador ejecuta los <script> en el parseo inicial.
 */

/** True solo en el ambiente de producción real (Vercel) o build prod local. */
function isProductionEnv(): boolean {
  if (process.env.VERCEL_ENV) return process.env.VERCEL_ENV === "production";
  return process.env.NODE_ENV === "production";
}

type GoogleAnalyticsProps = {
  enabled?: boolean | null;
  script?: string | null;
};

export function GoogleAnalytics({ enabled, script }: GoogleAnalyticsProps) {
  if (!enabled || !script?.trim() || !isProductionEnv()) return null;

  return <div suppressHydrationWarning dangerouslySetInnerHTML={{ __html: script }} />;
}
