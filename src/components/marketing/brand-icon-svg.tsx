import { cn } from "@/lib/utils";

/**
 * BrandIconSvg — íconos SVG inline por marca del ecosistema Caracol.
 * Versión placeholder en lo que se suben los PNG/SVG reales al admin.
 * Cada ícono ocupa el contenedor (width/height 100%) con fondo del color brand.
 */

export interface BrandIconSvgProps {
  brand: string;
  className?: string;
}

const SIZE = 40;

export function BrandIconSvg({ brand, className }: BrandIconSvgProps) {
  switch (brand) {
    case "caracoltv":
      return <CaracolTvIcon className={className} />;
    case "ditu":
      return <DituIcon className={className} />;
    case "golcaracol":
      return <GolCaracolIcon className={className} />;
    case "caracolsports":
      return <CaracolSportsIcon className={className} />;
    case "bluradio":
      return <BluRadioIcon className={className} />;
    case "lakalle":
      return <LaKalleIcon className={className} />;
    case "volk":
      return <VolkIcon className={className} />;
    case "bumbox":
      return <BumBoxIcon className={className} />;
    case "caracoldigital":
      return <CaracolDigitalIcon className={className} />;
    case "caracolmedios":
      return <CaracolMediosIcon className={className} />;
    default:
      return <DefaultBrandIcon className={className} />;
  }
}

/* ---------- helpers ---------- */

function IconShell({
  children,
  bg,
  className,
}: {
  children: React.ReactNode;
  bg: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative inline-flex h-full w-full items-center justify-center overflow-hidden rounded-[10px]",
        className,
      )}
      style={{ background: bg }}
    >
      {children}
    </span>
  );
}

/* ============================== Marcas ============================== */

/** Caracol TV — eye/orbital con texto "Tú nos ves Caracol Te Ve". */
function CaracolTvIcon({ className }: { className?: string }) {
  return (
    <IconShell
      bg="linear-gradient(180deg, #003380 0%, #015BC4 100%)"
      className={className}
    >
      <svg
        viewBox="0 0 40 40"
        width={SIZE}
        height={SIZE}
        className="h-[68%] w-[68%]"
        fill="none"
      >
        <ellipse
          cx="20"
          cy="20"
          rx="17"
          ry="7.5"
          stroke="white"
          strokeWidth="2.2"
          transform="rotate(-20 20 20)"
        />
        <circle cx="20" cy="20" r="4.2" fill="white" />
        <circle cx="20" cy="20" r="1.6" fill="#003380" />
      </svg>
    </IconShell>
  );
}

/** Ditu — wordmark lowercase violet. */
function DituIcon({ className }: { className?: string }) {
  return (
    <IconShell
      bg="linear-gradient(180deg, #8232F0 0%, #561BDB 100%)"
      className={className}
    >
      <span
        className="font-display text-[20px] leading-none font-black tracking-tight text-white"
        style={{ marginTop: 2 }}
      >
        ditu
      </span>
    </IconShell>
  );
}

/** Gol Caracol — "G" estilizada en gradiente naranja-rojo. */
function GolCaracolIcon({ className }: { className?: string }) {
  return (
    <IconShell
      bg="linear-gradient(135deg, #FF6F00 0%, #FF1744 100%)"
      className={className}
    >
      <svg viewBox="0 0 40 40" className="h-[70%] w-[70%]" fill="none">
        <path
          d="M14 8 L26 8 C30 8 32 11 32 14 L32 16 L26 16 L26 14 L18 14 L18 26 L26 26 L26 22 L22 22 L22 18 L32 18 L32 26 C32 29 30 32 26 32 L14 32 C10 32 8 29 8 26 L8 14 C8 11 10 8 14 8 Z"
          fill="white"
        />
      </svg>
    </IconShell>
  );
}

/** Caracol Sports — eye + texto "sports". */
function CaracolSportsIcon({ className }: { className?: string }) {
  return (
    <IconShell
      bg="linear-gradient(180deg, #003380 0%, #015BC4 100%)"
      className={className}
    >
      <svg viewBox="0 0 40 40" className="h-[80%] w-[80%]" fill="none">
        <ellipse
          cx="20"
          cy="16"
          rx="13"
          ry="5"
          stroke="white"
          strokeWidth="1.6"
          transform="rotate(-15 20 16)"
        />
        <circle cx="20" cy="16" r="3" fill="white" />
        <text
          x="20"
          y="32"
          textAnchor="middle"
          fontFamily="system-ui, sans-serif"
          fontWeight="700"
          fontSize="8"
          fill="white"
          letterSpacing="0.5"
        >
          sports
        </text>
      </svg>
    </IconShell>
  );
}

/** Blu Radio — círculo con sound waves. */
function BluRadioIcon({ className }: { className?: string }) {
  return (
    <IconShell
      bg="linear-gradient(180deg, #00ACFF 0%, #0277BD 100%)"
      className={className}
    >
      <svg viewBox="0 0 40 40" className="h-[68%] w-[68%]" fill="none">
        <circle cx="20" cy="20" r="14" stroke="white" strokeWidth="2.2" fill="none" />
        <circle cx="20" cy="20" r="9" stroke="white" strokeWidth="1.6" fill="none" />
        <line
          x1="14"
          y1="20"
          x2="16"
          y2="20"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="19"
          y1="16"
          x2="19"
          y2="24"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="22"
          y1="18"
          x2="22"
          y2="22"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="25"
          y1="20"
          x2="26"
          y2="20"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </IconShell>
  );
}

/** La Kalle — "k" wordmark verde lima. */
function LaKalleIcon({ className }: { className?: string }) {
  return (
    <IconShell
      bg="linear-gradient(135deg, #FF1744 0%, #B71C1C 100%)"
      className={className}
    >
      <span className="font-display text-[22px] leading-none font-black text-white">
        K
      </span>
    </IconShell>
  );
}

/** Volk — cyan accent. */
function VolkIcon({ className }: { className?: string }) {
  return (
    <IconShell
      bg="linear-gradient(135deg, #00B8D4 0%, #006978 100%)"
      className={className}
    >
      <svg viewBox="0 0 40 40" className="h-[58%] w-[58%]" fill="none">
        <path
          d="M8 10 L16 30 L20 18 L24 30 L32 10"
          stroke="white"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </IconShell>
  );
}

/** BumBox — "B" wordmark amarillo. */
function BumBoxIcon({ className }: { className?: string }) {
  return (
    <IconShell
      bg="linear-gradient(180deg, #00ACFF 0%, #2862FF 100%)"
      className={className}
    >
      <span
        className="font-display text-[24px] leading-none font-black"
        style={{ color: "#FFC200" }}
      >
        B
      </span>
    </IconShell>
  );
}

/** Caracol Digital — "C" con accent. */
function CaracolDigitalIcon({ className }: { className?: string }) {
  return (
    <IconShell
      bg="linear-gradient(180deg, #003CCA 0%, #0D3AA0 100%)"
      className={className}
    >
      <span
        className="font-display text-[22px] leading-none font-black"
        style={{ color: "#2862FF" }}
      >
        C
      </span>
    </IconShell>
  );
}

/** Caracol Medios — fallback con orbital. */
function CaracolMediosIcon({ className }: { className?: string }) {
  return (
    <IconShell
      bg="linear-gradient(180deg, #212121 0%, #000000 100%)"
      className={className}
    >
      <svg viewBox="0 0 40 40" className="h-[68%] w-[68%]" fill="none">
        <ellipse
          cx="20"
          cy="20"
          rx="17"
          ry="7.5"
          stroke="white"
          strokeWidth="2.2"
          transform="rotate(-20 20 20)"
        />
        <circle cx="20" cy="20" r="4" fill="white" />
      </svg>
    </IconShell>
  );
}

function DefaultBrandIcon({ className }: { className?: string }) {
  return (
    <IconShell bg="#5C6BC0" className={className}>
      <span className="text-[14px] font-bold text-white">?</span>
    </IconShell>
  );
}
