/**
 * Helpers de marcas — color, label, slug.
 * Colores oficiales confirmados por cliente (2026-05-15).
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
  /** Color primary del brand (hex). Se inyecta como --color-primary en BrandTabs. */
  color: string;
  /** Color secundario para fondo deep. */
  colorDark?: string;
  /** Color alterno (accent / soft). */
  colorAccent?: string;
}

export const BRAND_META: Record<BrandKey, BrandMeta> = {
  ditu: {
    label: "Ditu",
    color: "#8232F0", // Violeta
    colorDark: "#1F1647", // Violeta Oscuro
    colorAccent: "#77EDED", // Azul Claro complementario
  },
  caracoltv: {
    label: "Caracol TV",
    color: "#015BC4", // Azul Medio
    colorDark: "#003380", // Azul Oscuro
    colorAccent: "#00ACFF", // Azul Claro
  },
  caracoldigital: {
    label: "Caracol Digital",
    color: "#003CCA", // Digital Azul Medio
    colorDark: "#0D3AA0", // Digital Azul Oscuro
    colorAccent: "#2862FF", // Digital Azul Claro
  },
  golcaracol: { label: "Gol Caracol", color: "#00C853", colorDark: "#006B2B" },
  caracolsports: { label: "Caracol Sports", color: "#FF6F00", colorDark: "#B23E00" },
  bluradio: { label: "Blu Radio", color: "#1976D2", colorDark: "#0D47A1" },
  lakalle: { label: "La Kalle", color: "#FF1744", colorDark: "#B71C1C" },
  volk: { label: "Volk", color: "#00B8D4", colorDark: "#006978" },
  bumbox: { label: "BumBox", color: "#FFC200", colorDark: "#9E6E00" },
  caracolmedios: { label: "Caracol Medios", color: "#212121", colorDark: "#000000" },
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
