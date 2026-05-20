"use client";

import Image from "next/image";

import { CountUp } from "@/components/animations";

/**
 * DituAudienciaBlock — Figma 512:5929 / 512:2243.
 *
 * Estructura:
 *  1. Sticker + heading "Cada mes, MILLONES DE PANTALLAS prendidas"
 *  2. 3 stat cards (Descargas / Dispositivos / Pico) con border cyan + backdrop-blur
 *  3. Card grande con 60 MIN watch time + 4 sub-cards de device (Smart TV/Mobile/Tablet/Web)
 *  4. Fuente line
 *  5. +1.7M de seguidores / que esperan ver tu marca + mascot hand
 *  6. Network counters row (6 redes con número final)
 *  7. Fuente line
 *
 * Tokens Ditu:
 *  - #12082D Violeta oscuro
 *  - #77EDED Cyan accent
 *  - Ditu Display Bold/Medium
 *  - Spline Sans body
 */

const CYAN = "#77EDED";
const NAVY_DARK = "#12082D";
const GREY_LIGHT = "#E4E4E4";

interface StatCard {
  label: string;
  value: number;
  format?: (v: number) => string;
  description: string;
  icon: string;
  large?: boolean;
}

interface DeviceCard {
  label: string;
  minutes: number;
  icon: string;
}

interface NetworkCount {
  network: "facebook" | "tiktok" | "x" | "youtube" | "instagram" | "whatsapp";
  followers: number;
}

export interface DituAudienciaProps {
  anchorId?: string;
  /** Total seguidores grande (default 1700000 = +1.7M). */
  totalFollowersHeadline?: string;
}

const DEFAULT_STATS: StatCard[] = [
  {
    label: "Descargas acumuladas",
    value: 10717937,
    format: (v) => Math.round(v).toLocaleString("es-CO"),
    description: "De puertas abiertas para tu marca",
    icon: "/ditu/icon-download.svg",
    large: true,
  },
  {
    label: "Dispositivos activos",
    value: 3039409,
    format: (v) => Math.round(v).toLocaleString("es-CO"),
    description: "Pantallas encendidas cada mes",
    icon: "/ditu/icon-livetv.svg",
  },
  {
    label: "Pico dispositivos/día",
    value: 474339,
    format: (v) => Math.round(v).toLocaleString("es-CO"),
    description: "En su momento de mayor atención",
    icon: "/ditu/icon-bolt.svg",
  },
];

const DEFAULT_DEVICES: DeviceCard[] = [
  { label: "Smart TV", minutes: 52, icon: "/ditu/icon-smarttv.svg" },
  { label: "Mobile", minutes: 32, icon: "/ditu/icon-mobile.svg" },
  { label: "Tablet", minutes: 34, icon: "/ditu/icon-tablet.svg" },
  { label: "Web", minutes: 28, icon: "/ditu/icon-web.svg" },
];

const DEFAULT_NETWORKS: NetworkCount[] = [
  { network: "facebook", followers: 45274642 },
  { network: "tiktok", followers: 21101000 },
  { network: "x", followers: 20675885 },
  { network: "youtube", followers: 19201460 },
  { network: "instagram", followers: 14076513 },
  { network: "whatsapp", followers: 4991401 },
];

const NETWORK_ICON: Record<NetworkCount["network"], string> = {
  facebook: "/ditu/social-facebook.svg",
  tiktok: "/ditu/social-tiktok.svg",
  x: "/ditu/social-x.svg",
  youtube: "/ditu/social-youtube.svg",
  instagram: "/ditu/social-instagram.svg",
  whatsapp: "/ditu/social-whatsapp.svg",
};

export function DituAudienciaBlock({
  anchorId = "cifras",
  totalFollowersHeadline = "+1.7M",
}: DituAudienciaProps) {
  return (
    <section
      id={anchorId}
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #3B1A93 0%, #2A1469 60%, #12082D 100%)",
      }}
    >
      {/* TOP block: Sticker + heading + stat cards */}
      <div className="mx-auto flex max-w-[1440px] flex-col gap-12 px-6 pt-24 pb-12 sm:gap-16 sm:px-12 sm:pt-32 lg:gap-[84px] lg:px-[120px] lg:pt-[180px] lg:pb-[64px]">
        {/* Sticker + heading */}
        <div className="flex flex-col gap-3">
          <div className="inline-block w-fit">
            <div
              className="inline-flex items-center rounded-[8px] px-2 py-1.5"
              style={{
                backgroundColor: CYAN,
                color: NAVY_DARK,
                transform: "rotate(-1.97deg)",
              }}
            >
              <p className="font-display text-[24px] leading-[1] font-bold whitespace-nowrap uppercase sm:text-[36px] lg:text-[48px]">
                Las cifras que mueven a Ditu
              </p>
            </div>
          </div>
          <h2 className="font-display text-[36px] leading-[1] font-bold tracking-tight text-white uppercase sm:text-[60px] lg:text-[84px]">
            Cada mes, <span style={{ color: CYAN }}>millones de pantallas</span>{" "}
            prendidas.
          </h2>
        </div>

        {/* 3 stat cards row */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {DEFAULT_STATS.map((stat) => (
            <article
              key={stat.label}
              className={`relative flex flex-col items-end gap-2 rounded-[16px] border p-6 backdrop-blur-[30px] sm:p-8 lg:p-[40px] ${stat.large ? "md:col-span-1" : ""}`}
              style={{
                borderColor: CYAN,
                backgroundColor: "rgba(255,255,255,0.04)",
              }}
            >
              <div className="flex items-center gap-2 self-end">
                <Image
                  src={stat.icon}
                  alt=""
                  width={30}
                  height={30}
                  className="h-[24px] w-[24px] lg:h-[30px] lg:w-[30px]"
                />
                <span
                  className="font-display inline-flex items-center rounded-[4px] px-3 py-1 text-[14px] leading-[1] font-medium whitespace-nowrap uppercase sm:text-[16px] lg:text-[18px]"
                  style={{ backgroundColor: CYAN, color: NAVY_DARK }}
                >
                  {stat.label}
                </span>
              </div>
              <p
                className={`font-display font-bold whitespace-nowrap text-white ${stat.large ? "text-[44px] sm:text-[64px] lg:text-[80px]" : "text-[36px] sm:text-[48px] lg:text-[64px]"}`}
                style={{ lineHeight: 1 }}
              >
                <CountUp value={stat.value} format={stat.format} />
              </p>
              <p
                className="text-right text-[14px] leading-snug sm:text-[16px]"
                style={{
                  color: GREY_LIGHT,
                  fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                }}
              >
                {stat.description}
              </p>
            </article>
          ))}
        </div>

        {/* Watch time row: 60 MIN + 4 device sub-cards */}
        <div
          className="flex flex-col items-stretch gap-6 rounded-[16px] border p-6 sm:flex-row sm:items-center sm:p-8 lg:gap-6 lg:p-[40px]"
          style={{ borderColor: CYAN }}
        >
          {/* 60 MIN left */}
          <div className="flex flex-col items-start gap-2 px-2 py-4 lg:px-8 lg:py-5">
            <div className="flex items-center gap-2">
              <Image
                src="/ditu/icon-schedule.svg"
                alt=""
                width={30}
                height={30}
                className="h-[24px] w-[24px] lg:h-[30px] lg:w-[30px]"
              />
              <span
                className="font-display inline-flex items-center rounded-[4px] px-3 py-1 text-[14px] leading-[1] font-medium whitespace-nowrap uppercase sm:text-[16px] lg:text-[18px]"
                style={{ backgroundColor: CYAN, color: NAVY_DARK }}
              >
                Watch time promedio
              </span>
            </div>
            <p className="font-display text-[44px] leading-[1] font-bold whitespace-nowrap text-white sm:text-[56px] lg:text-[64px]">
              60 MIN
            </p>
            <p
              className="text-[14px] leading-snug sm:text-[16px]"
              style={{
                color: GREY_LIGHT,
                fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
              }}
            >
              Por sesión, sin interrupciones
            </p>
          </div>

          {/* Vertical divider on lg */}
          <div
            className="hidden h-[197px] w-px self-center lg:block"
            style={{ backgroundColor: "rgba(119,237,237,0.4)" }}
          />

          {/* 4 device cards */}
          <div className="grid flex-1 grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {DEFAULT_DEVICES.map((dev) => (
              <div
                key={dev.label}
                className="flex flex-col items-center gap-4 rounded-[16px] border border-white/70 p-4 backdrop-blur-sm lg:p-5"
                style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
              >
                <div
                  className="flex h-[64px] w-[64px] items-center justify-center rounded-full lg:h-[80px] lg:w-[80px]"
                  style={{ border: `2px solid ${CYAN}` }}
                >
                  <Image
                    src={dev.icon}
                    alt=""
                    width={32}
                    height={32}
                    className="h-7 w-7 lg:h-8 lg:w-8"
                  />
                </div>
                <div className="text-center">
                  <p className="font-display text-[26px] leading-[1.1] font-bold text-white lg:text-[32px]">
                    {dev.minutes} min
                  </p>
                  <p
                    className="text-[14px] sm:text-[16px]"
                    style={{
                      color: GREY_LIGHT,
                      fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                    }}
                  >
                    {dev.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source */}
        <div className="flex items-center justify-end gap-1">
          <span
            className="inline-block h-[10px] w-[10px] rounded-full"
            style={{ backgroundColor: CYAN }}
          />
          <p
            className="font-display text-[12px] leading-[18px] text-white"
            style={{ fontWeight: 500 }}
          >
            Fuente: Ditu AVS Accenture · Abril 2026
          </p>
        </div>
      </div>

      {/* BOTTOM block: +1.7M + scrolling networks */}
      <div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 pt-4 pb-16 sm:px-12 lg:gap-[48px] lg:px-[120px] lg:pb-[80px]">
        {/* +1.7M de seguidores headline */}
        <div className="relative flex flex-wrap items-end gap-4 sm:gap-6">
          <p
            className="font-display text-[64px] leading-[1] font-bold whitespace-nowrap uppercase sm:text-[96px] lg:text-[128px]"
            style={{ color: CYAN }}
          >
            {totalFollowersHeadline}
          </p>
          <div className="flex flex-col gap-1">
            <p className="font-display text-[28px] leading-[1] font-bold text-white uppercase sm:text-[44px] lg:text-[64px]">
              DE SEGUIDORES
            </p>
            <p className="font-display text-[28px] leading-[1] font-medium text-white uppercase sm:text-[44px] lg:text-[64px]">
              QUE ESPERAN VER TU MARCA
            </p>
          </div>
          {/* Mascot hand decorativo */}
          <div className="absolute -top-4 right-4 hidden h-[80px] w-[80px] lg:-top-2 lg:right-[20%] lg:block lg:h-[107px] lg:w-[107px]">
            <Image
              src="/ditu/mascot-hand.svg"
              alt=""
              width={107}
              height={121}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Networks row */}
        <div className="flex flex-wrap items-center justify-between gap-6 sm:gap-8 lg:gap-y-[68px]">
          {DEFAULT_NETWORKS.map((net) => (
            <div key={net.network} className="flex items-start gap-3">
              <Image
                src={NETWORK_ICON[net.network]}
                alt=""
                width={48}
                height={48}
                className="h-10 w-10 lg:h-12 lg:w-12"
              />
              <div className="flex flex-col items-start">
                <p
                  className="font-display text-[18px] leading-[28px] font-semibold whitespace-nowrap text-white lg:text-[20px]"
                  style={{ fontFamily: "var(--font-montserrat), system-ui" }}
                >
                  <CountUp
                    value={net.followers}
                    format={(v) => Math.round(v).toLocaleString("es-CO")}
                  />
                </p>
                <p
                  className="text-[14px] leading-[20px] text-white lg:text-[16px]"
                  style={{ fontFamily: "var(--font-montserrat), system-ui" }}
                >
                  Seguidores
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Source */}
        <div className="flex items-center justify-end gap-1">
          <span
            className="inline-block h-[10px] w-[10px] rounded-full"
            style={{ backgroundColor: CYAN }}
          />
          <p
            className="font-display text-[12px] leading-[18px] text-white"
            style={{ fontWeight: 500 }}
          >
            Fuente: TGI CO 2025
          </p>
        </div>
      </div>
    </section>
  );
}
