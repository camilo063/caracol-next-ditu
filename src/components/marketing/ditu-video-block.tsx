import Image from "next/image";

/**
 * DituVideoBlock — fullwidth video/image showcase, Figma 512:2244.
 *
 * Specs:
 *  - Container: gradient from-#291763 via-#32197b (25.483%) to-#3b1a93 (100%).
 *  - Image full-width 1440x809 con rounded-[12px].
 *  - El frame Figma muestra un mockup de la app Ditu sobre fondo púrpura.
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
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #291763 0%, #32197B 25.48%, #3B1A93 100%)",
      }}
    >
      <div className="relative aspect-[1440/809] w-full">
        <Image
          src={src}
          alt={alt}
          fill
          sizes="100vw"
          className="object-cover"
          priority={false}
        />
      </div>
    </section>
  );
}
