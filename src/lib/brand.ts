/**
 * Helpers de marcas — color, label, slug.
 * Colores Figma extraídos vía MCP (Mediakit Caracol — Design System, 2026-05-19).
 *
 * Cada brand tiene 4 colores semánticos:
 *  - `color`: primario, usado para el HEADING del brand en el tab content.
 *  - `colorDark`: usado para el PANEL derecho (background del logo).
 *  - `chartPeak`: color de la barra "peak" del Edad Pico bar chart.
 *  - `colorAccent` (opcional): accent secundario (ej. cyan, magenta, amarillo).
 */

export type BrandKey =
  | "ditu"
  | "caracoltv"
  | "golcaracol"
  | "caracolsports"
  | "bluradio"
  | "lakalle"
  | "volk"
  | "bumbox"
  | "caracoldigital"
  | "caracolmedios";

interface BrandMeta {
  label: string;
  /** Color primario del brand — usado en HEADING del tab. */
  color: string;
  /** Color oscuro del brand — usado en el PANEL derecho del tab. */
  colorDark?: string;
  /** Color accent (cyan, amarillo, magenta) — opcional. */
  colorAccent?: string;
  /** Color usado para la barra peak del Edad Pico bar chart. */
  chartPeak?: string;
}

export const BRAND_META: Record<BrandKey, BrandMeta> = {
  ditu: {
    label: "Ditu",
    color: "#8232F0", // Ditu/Primario/Violeta
    colorDark: "#1F1647", // Ditu/Primario/Violeta Oscuro
    colorAccent: "#77EDED", // Ditu/Primario/Azul Claro complementario
    chartPeak: "#8232F0",
  },
  caracoltv: {
    label: "Caracol TV",
    color: "#003381", // CaracolTV/Primario/Azul Oscuro (heading + panel uniforme)
    colorDark: "#003381",
    colorAccent: "#00ACFF",
    chartPeak: "#003381",
  },
  caracoldigital: {
    label: "Caracol Digital",
    color: "#003CCA",
    colorDark: "#0D3AA0",
    colorAccent: "#2862FF",
    chartPeak: "#003CCA",
  },
  golcaracol: {
    label: "Gol Caracol",
    color: "#006AEF", // GolCaracol/Primario/Azul 2 — usado en heading
    colorDark: "#071D49", // GolCaracol/Primario/Azul Oscuro — usado en panel
    chartPeak: "#006AEF",
  },
  caracolsports: {
    label: "Caracol Sports",
    color: "#005294", // CaracolSports/Primario/Azul Profundo
    colorDark: "#005294",
    colorAccent: "#00B3FB", // CaracolSports/Primario/Azul Celeste
    chartPeak: "#005294",
  },
  bluradio: {
    label: "Blu Radio",
    color: "#00AEEF", // BluRadio/Primario/Azul Medio
    // Side panel y slice menor del pie chart usan el azul oscuro, no el medio
    // (fix bug "géneros con el mismo color" — antes pie primary == secondary).
    colorDark: "#005BAA",
    chartPeak: "#005BAA",
  },
  lakalle: {
    label: "La Kalle",
    color: "#353535", // LaKalle/Primario/Negro
    colorDark: "#353535",
    colorAccent: "#FEFF00", // LaKalle/Primario/Amarillo
    chartPeak: "#FEFF00",
  },
  volk: {
    label: "Volk",
    color: "#0E3DFF", // Volk/Primario/Azul
    colorDark: "#0E3DFF",
    colorAccent: "#FF0080", // Volk/Primario/Magenta
    chartPeak: "#0E3DFF",
  },
  bumbox: {
    label: "BumBox",
    color: "#1EB1FB", // BumBox/Primario/Azul Claro
    // Side panel y slice menor del pie usan el azul oscuro real (Figma 402:8734)
    // — antes ambos slices del pie usaban el mismo azul claro (bug reportado).
    colorDark: "#042D66",
    chartPeak: "#042D66",
  },
  caracolmedios: {
    label: "Caracol Medios",
    color: "#212121",
    colorDark: "#000000",
    chartPeak: "#212121",
  },
};

/** Si el brand-key viene desconocido, devuelve un fallback neutral. */
export function brandMeta(key: string | null | undefined): BrandMeta {
  if (!key) return { label: "Marca", color: "#015BC4" };
  return BRAND_META[key as BrandKey] ?? { label: key, color: "#015BC4" };
}

/** Inline style para inyectar el color brand como `--color-primary`. */
export function brandStyle(key: string | null | undefined): React.CSSProperties {
  const meta = brandMeta(key);
  return {
    "--color-primary": meta.color,
    "--color-ring": meta.color,
    ...(meta.colorDark ? { "--color-accent": meta.colorDark } : {}),
  } as React.CSSProperties;
}
