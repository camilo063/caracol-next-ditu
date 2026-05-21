/**
 * DituVideoBlock — fullwidth video/image showcase, Figma 512:2244.
 *
 * Specs Figma exactas:
 *  - Container: bg-gradient-to-b from #291763 (0%) via #32197b (25.483%)
 *    to #3b1a93 (100.01%).
 *  - Image wrapper: aspect-[507/285] (1.778:1), rounded-[12px], full width.
 *  - Image cropped via offsets: w-[139.45%] h-[1437.19%] top-[-414.39%]
 *    left-[-19.72%] (crop específico de un screenshot vertical 707×4096).
 *  - El frame Figma muestra un mockup de la app Ditu sobre fondo púrpura.
 *
 * NOTA: el `<img>` raw se usa en vez de next/image porque necesitamos el
 * crop exacto del Figma con percentages negativos absolutos — `fill` de
 * next/image no permite override de positioning.
 */
export interface DituVideoBlockProps {
  /** Imagen/video del bloque (default: /ditu/video-block.png). */
  src?: string;
  alt?: string;
  /** Anchor ID opcional para navegación. */
  anchorId?: string;
}

export function DituVideoBlock({
  src = "/ditu/video-block.png",
  alt = "",
  anchorId,
}: DituVideoBlockProps) {
  return (
    <section
      id={anchorId}
      className="relative flex w-full flex-col items-start justify-center overflow-hidden"
      style={{
        // Figma 512:2244: gradient-to-b con stops exactos.
        background:
          "linear-gradient(180deg, #291763 0%, #32197B 25.483%, #3B1A93 100.01%)",
      }}
    >
      <div className="relative aspect-[507/285] w-full shrink-0 rounded-[12px]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[12px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="absolute block"
            style={{
              width: "139.45%",
              height: "1437.19%",
              top: "-414.39%",
              left: "-19.72%",
              maxWidth: "none",
            }}
          />
        </div>
      </div>
    </section>
  );
}
