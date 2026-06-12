"use client";

import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import React, { useRef } from "react";

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
  href?: string;
}

export interface DituAudienciaProps {
  anchorId?: string;
  /** Total seguidores grande (default 1700000 = +1.7M). */
  totalFollowersHeadline?: string;
  stats?: StatCard[];
  devices?: DeviceCard[];
  networks?: NetworkCount[];
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

const DEVICE_SVG: Record<string, React.ReactNode> = {
  smarttv: (
    <svg
      className="h-7 w-7 lg:h-8 lg:w-8"
      viewBox="0 0 29 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.2 3.2V15.2H25.6V3.2H3.2ZM0 3.2C0 1.435 1.435 0 3.2 0H25.6C27.365 0 28.8 1.435 28.8 3.2V15.2C28.8 16.965 27.365 18.4 25.6 18.4H3.2C1.435 18.4 0 16.965 0 15.2V3.2ZM8 20.8H20.8C21.685 20.8 22.4 21.515 22.4 22.4C22.4 23.285 21.685 24 20.8 24H8C7.115 24 6.4 23.285 6.4 22.4C6.4 21.515 7.115 20.8 8 20.8Z"
        fill="#77EDED"
      />
    </svg>
  ),
  mobile: (
    <svg
      className="h-7 w-7 lg:h-8 lg:w-8"
      viewBox="0 0 22 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.93333 32C2.12667 32 1.43611 31.7152 0.861667 31.1455C0.287222 30.5758 0 29.8909 0 29.0909V2.90909C0 2.10909 0.287222 1.42424 0.861667 0.854546C1.43611 0.284848 2.12667 0 2.93333 0H17.6C18.4067 0 19.0972 0.284848 19.6717 0.854546C20.2461 1.42424 20.5333 2.10909 20.5333 2.90909V7.41818C20.9733 7.58788 21.3278 7.85455 21.5967 8.21818C21.8656 8.58182 22 8.99394 22 9.45455V12.3636C22 12.8242 21.8656 13.2364 21.5967 13.6C21.3278 13.9636 20.9733 14.2303 20.5333 14.4V29.0909C20.5333 29.8909 20.2461 30.5758 19.6717 31.1455C19.0972 31.7152 18.4067 32 17.6 32H2.93333ZM2.93333 29.0909H17.6V2.90909H2.93333V29.0909ZM7.33333 27.6364H13.2C13.6156 27.6364 13.9639 27.497 14.245 27.2182C14.5261 26.9394 14.6667 26.5939 14.6667 26.1818C14.6667 25.7697 14.5261 25.4242 14.245 25.1455C13.9639 24.8667 13.6156 24.7273 13.2 24.7273H7.33333C6.91778 24.7273 6.56944 24.8667 6.28833 25.1455C6.00722 25.4242 5.86667 25.7697 5.86667 26.1818C5.86667 26.5939 6.00722 26.9394 6.28833 27.2182C6.56944 27.497 6.91778 27.6364 7.33333 27.6364Z"
        fill="#77EDED"
      />
    </svg>
  ),
  tablet: (
    <svg
      className="h-7 w-7 lg:h-8 lg:w-8"
      viewBox="0 0 24 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.95 25.6167C13.2056 25.3611 13.3333 25.0444 13.3333 24.6667C13.3333 24.2889 13.2056 23.9722 12.95 23.7167C12.6944 23.4611 12.3778 23.3333 12 23.3333C11.6222 23.3333 11.3056 23.4611 11.05 23.7167C10.7944 23.9722 10.6667 24.2889 10.6667 24.6667C10.6667 25.0444 10.7944 25.3611 11.05 25.6167C11.3056 25.8722 11.6222 26 12 26C12.3778 26 12.6944 25.8722 12.95 25.6167ZM2.66667 29.3333C1.93333 29.3333 1.30556 29.0722 0.783333 28.55C0.261111 28.0278 0 27.4 0 26.6667V2.66667C0 1.93333 0.261111 1.30556 0.783333 0.783333C1.30556 0.261111 1.93333 0 2.66667 0H21.3333C22.0667 0 22.6944 0.261111 23.2167 0.783333C23.7389 1.30556 24 1.93333 24 2.66667V26.6667C24 27.4 23.7389 28.0278 23.2167 28.55C22.6944 29.0722 22.0667 29.3333 21.3333 29.3333H2.66667ZM2.66667 22.6667V26.6667H21.3333V22.6667H2.66667ZM2.66667 20H21.3333V6.66667H2.66667V20ZM2.66667 4H21.3333V2.66667H2.66667V4Z"
        fill="#77EDED"
      />
    </svg>
  ),
  web: (
    <svg
      className="h-7 w-7 lg:h-8 lg:w-8"
      viewBox="0 0 27 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.66667 21.3333C1.93333 21.3333 1.30556 21.0722 0.783333 20.55C0.261111 20.0278 0 19.4 0 18.6667V2.66667C0 1.93333 0.261111 1.30556 0.783333 0.783333C1.30556 0.261111 1.93333 0 2.66667 0H24C24.7333 0 25.3611 0.261111 25.8833 0.783333C26.4056 1.30556 26.6667 1.93333 26.6667 2.66667V18.6667C26.6667 19.4 26.4056 20.0278 25.8833 20.55C25.3611 21.0722 24.7333 21.3333 24 21.3333H2.66667ZM2.66667 18.6667H16.6667V14H2.66667V18.6667ZM19.3333 18.6667H24V6.66667H19.3333V18.6667ZM2.66667 11.3333H16.6667V6.66667H2.66667V11.3333Z"
        fill="#77EDED"
      />
    </svg>
  ),
};

const DEFAULT_DEVICES: DeviceCard[] = [
  { label: "Smart TV", minutes: 52, icon: "smarttv" },
  { label: "Mobile", minutes: 32, icon: "mobile" },
  { label: "Tablet", minutes: 34, icon: "tablet" },
  { label: "Web", minutes: 28, icon: "web" },
];

const DEFAULT_NETWORKS: NetworkCount[] = [
  { network: "facebook", followers: 45274642, href: "https://www.facebook.com" },
  { network: "tiktok", followers: 21101000, href: "https://www.tiktok.com" },
  { network: "x", followers: 20675885, href: "https://www.x.com" },
  { network: "youtube", followers: 19201460, href: "https://www.youtube.com" },
  { network: "instagram", followers: 14076513, href: "https://www.instagram.com" },
  { network: "whatsapp", followers: 4991401, href: "https://www.whatsapp.com" },
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
  stats,
  devices,
  networks,
}: DituAudienciaProps) {
  const finalStats = stats && stats.length > 0 ? stats : DEFAULT_STATS;
  const finalDevices = devices && devices.length > 0 ? devices : DEFAULT_DEVICES;
  const finalNetworks = networks && networks.length > 0 ? networks : DEFAULT_NETWORKS;
  const reduceMotion = useReducedMotion();

  // Ref para el bloque superior (stats) y el inferior (followers + redes)
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  // Ref exclusivo del grid de redes — sincroniza todos los CountUp
  const networksRef = useRef<HTMLDivElement>(null);

  const topInView = useInView(topRef, { once: true, margin: "0px 0px -80px 0px" });
  const bottomInView = useInView(bottomRef, { once: true, margin: "0px 0px -80px 0px" });
  const networksInView = useInView(networksRef, {
    once: true,
    margin: "0px 0px -40px 0px",
  });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reduceMotion ? 0 : 0.14, delayChildren: 0.05 },
    },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.65,
        ease: [0.25, 0.46, 0.45, 0.94] as const,
      },
    },
  };

  return (
    <section
      id={anchorId}
      className="relative w-full overflow-hidden"
      style={{
        // Figma 512:2243: 145.23deg rgb(66,18,131) → rgb(89,33,215) → rgb(82,37,194) → rgb(31,22,71)
        background:
          "linear-gradient(145.23deg, #421283 0%, #5921D7 37.027%, #5225C2 74.432%, #1F1647 102.7%)",
        paddingBottom: "calc(205 / 1440 * 100vw + 40px)",
      }}
    >
      {/* TOP block: Sticker + heading + stat cards */}
      <motion.div
        ref={topRef}
        className="mx-auto flex max-w-360 flex-col gap-12 px-6 pt-24 pb-12 sm:gap-16 sm:px-12 sm:pt-32 lg:gap-21 lg:px-30 lg:pt-45 lg:pb-16"
        variants={containerVariants}
        initial="hidden"
        animate={topInView ? "visible" : "hidden"}
      >
        {/* Sticker + heading */}
        <motion.div className="flex flex-col gap-3" variants={itemVariants}>
          <div className="inline-block w-fit">
            <div
              className="inline-flex items-center rounded-[8px] px-2 py-1.5"
              style={{
                backgroundColor: CYAN,
                color: NAVY_DARK,
                transform: "rotate(-1.97deg)",
              }}
            >
              <p className="font-display text-[24px] leading-none font-bold whitespace-nowrap uppercase sm:text-[36px] lg:text-[48px]">
                Las cifras que mueven a Ditu
              </p>
            </div>
          </div>
          <h2 className="font-display text-[48px] leading-none font-bold text-white uppercase sm:text-[60px] lg:text-[84px]">
            Cada mes,{" "}
            <span style={{ color: CYAN }}>
              millones <br /> de pantallas
            </span>{" "}
            prendidas.
          </h2>
        </motion.div>

        {/* 3 stat cards — flex en vez de grid (spec usuario "Cambiar grid por
            flex para manejar tarjetas de distintos tamaños"). En mobile,
            misma altura centradas (spec mobile: "tarjetas misma medida y
            centradas"). En desktop, la primera más grande (large) ocupa más. */}
        {/* Figma 738:2633: flex gap-[24px] items-center w-full — 3 tarjetas en fila.
            Descargas flex-[1_0_0] (crece), las otras shrink-0 (tamaño natural).
            Sin flex-wrap: las 3 siempre en una sola fila en desktop. */}
        <motion.div
          className="flex flex-col items-stretch gap-6 lg:flex-row lg:items-stretch"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "0px 0px -60px 0px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.13 } },
          }}
        >
          {finalStats.map((stat) => (
            <motion.article
              key={stat.label}
              className={`relative flex flex-col items-end gap-2 rounded-2xl border p-6 backdrop-blur-[30px] sm:p-8 lg:p-[40px] ${stat.large ? "lg:flex-[1_0_0]" : "lg:shrink-0"}`}
              style={{
                borderColor: CYAN,
              }}
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 self-end">
                <Image
                  src={stat.icon}
                  alt=""
                  width={30}
                  height={30}
                  className="h-[24px] w-[24px] lg:h-7.5 lg:w-7.5"
                />
                <span
                  className="font-display inline-flex items-center rounded-[4px] px-3 py-[4px] text-[14px] font-medium whitespace-nowrap uppercase sm:text-[16px] lg:text-[20px]"
                  style={{ backgroundColor: CYAN, color: NAVY_DARK, lineHeight: "14px" }}
                >
                  {stat.label}
                </span>
              </div>
              <p
                className={`font-display font-bold whitespace-nowrap text-white ${stat.large ? "text-[48px] sm:text-[72px] lg:text-[96px]" : "text-[36px] sm:text-[48px] lg:text-[64px]"}`}
                style={{ lineHeight: 1 }}
              >
                <CountUp value={stat.value} format={stat.format} reserveWidth />
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
            </motion.article>
          ))}
        </motion.div>

        {/* Watch time row: 60 MIN + 4 device sub-cards */}
        <motion.div
          className="flex flex-col items-stretch gap-6 rounded-[16px] border p-6 sm:flex-row sm:items-center sm:p-8 lg:gap-6 lg:p-[40px]"
          style={{ borderColor: CYAN }}
          variants={itemVariants}
        >
          {/* 60 MIN left — Figma 656:4863: backdrop-blur-[25px] rounded-[16px] px-[32px] py-[20px] */}
          <div className="flex flex-col items-start gap-2 rounded-2xl px-2 py-4 backdrop-blur-[25px] lg:px-8 lg:py-5">
            <div className="flex items-center gap-2">
              <Image
                src="/ditu/icon-schedule.svg"
                alt=""
                width={30}
                height={30}
                className="h-6 w-6 lg:h-7.5 lg:w-7.5"
              />
              <span
                className="font-display inline-flex items-center rounded-[4px] px-[12px] py-[4px] text-[14px] font-medium whitespace-nowrap uppercase sm:text-[16px] lg:text-[20px]"
                style={{ backgroundColor: CYAN, color: NAVY_DARK, lineHeight: "14px" }}
              >
                Watch time promedio
              </span>
            </div>
            {/* "60 MIN" — Figma 892:6260 / 656:4869: 64/lh-80 Ditu Display Bold */}
            <p
              className="font-display text-[44px] font-bold whitespace-nowrap text-white sm:text-[56px] lg:text-[64px]"
              style={{ lineHeight: "80px" }}
            >
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

          {/* Vertical divider — Figma 738:2713: línea dashed cyan w-[16px] h-[197px].
              Recreado con CSS background dashed (sin requerir asset extra). */}
          <div
            aria-hidden="true"
            className="hidden h-[197px] w-[16px] self-center lg:flex lg:justify-center"
          >
            <div
              className="h-full w-px"
              style={{
                backgroundImage: `repeating-linear-gradient(180deg, ${CYAN} 0 8px, transparent 8px 14px)`,
              }}
            />
          </div>

          {/* 4 device cards — Figma 738:2631/2707/2695/2677.
              gap-[18px] interno, p-[20px], border-white, backdrop-blur-[7px]. */}
          <motion.div
            className="grid flex-1 grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-[24px]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -40px 0px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.11 } },
            }}
          >
            {finalDevices.map((dev) => (
              <motion.div
                key={dev.label}
                className="flex flex-col items-center gap-[18px] rounded-[16px] border border-white p-4 lg:p-[20px]"
                style={{
                  backdropFilter: "blur(7px)",
                }}
                variants={itemVariants}
              >
                {/* Icono — Figma usa composite 80×80 (círculo + icon). Replico con
                    círculo cyan + icono centrado para matchear el visual. */}
                <div
                  className="flex h-[64px] w-[64px] items-center justify-center rounded-full lg:h-[80px] lg:w-[80px]"
                  style={{ border: `2px solid ${CYAN}` }}
                >
                  {DEVICE_SVG[dev.icon]}
                </div>
                <div className="text-center">
                  <p
                    className="font-display text-[26px] font-bold text-white lg:text-[32px]"
                    style={{ lineHeight: "40px" }}
                  >
                    {dev.minutes} min
                  </p>
                  <p
                    className="text-[14px] sm:text-[16px]"
                    style={{
                      color: GREY_LIGHT,
                      fontFamily: "var(--font-spline-sans), system-ui, sans-serif",
                      lineHeight: "normal",
                    }}
                  >
                    {dev.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Source */}
        <motion.div
          className="flex items-center justify-end gap-1"
          variants={itemVariants}
        >
          <span
            className="inline-block h-[13px] w-[13px] shrink-0 rounded-full"
            style={{ backgroundColor: CYAN }}
          />
          <p
            className="font-display text-[12px] leading-[18px] text-white"
            style={{ fontWeight: 500 }}
          >
            Fuente: Ditu AVS Accenture · Abril 2026
          </p>
        </motion.div>
      </motion.div>

      {/* BOTTOM block: +1.7M + scrolling networks */}
      <motion.div
        ref={bottomRef}
        className="mx-auto flex max-w-[1440px] flex-col gap-10 px-[20px] pt-4 pb-16 sm:px-12 lg:gap-[48px] lg:px-[120px] lg:pb-[80px]"
        variants={containerVariants}
        initial="hidden"
        animate={bottomInView ? "visible" : "hidden"}
      >
        {/* +1.7M de seguidores headline.
            Mobile: flex-col para que +1.7M quede arriba y el texto abajo (sin overflow).
            sm+: flex-row con wrap. lg+: inline con gap-[8px]. */}
        <motion.div
          className="relative flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-start sm:gap-6 lg:flex-row lg:items-end lg:gap-[8px]"
          variants={itemVariants}
        >
          <p
            className="font-display text-[56px] leading-[1] font-bold whitespace-nowrap uppercase sm:text-[96px] lg:text-[128px]"
            style={{ color: CYAN }}
          >
            {totalFollowersHeadline}
          </p>
          <div className="relative flex flex-col gap-1">
            {/* Mascot hand — posicionada sobre "MARCA" (esquina superior derecha del bloque de texto) */}
            <span className="relative flex w-fit items-end gap-6">
              <p className="font-display text-[36px] leading-none font-bold text-white uppercase sm:text-[44px] lg:text-[64px]">
                DE SEGUIDORES
              </p>
              <Image
                src="/ditu/mascot-hand.svg"
                alt=""
                width={107}
                height={121}
                className="contain pointer-events-none absolute -right-19 h-20 w-18 translate-y-[6px] sm:-right-25 sm:h-24 sm:w-22 sm:translate-y-[9px] lg:-right-33 lg:h-30.25 lg:w-26.75 lg:translate-y-[11px]"
              />
            </span>

            <p className="font-display text-[36px] leading-[1.1] font-medium text-white uppercase sm:text-[44px] lg:text-[64px]">
              QUE ESPERAN VER TU MARCA
            </p>
          </div>
        </motion.div>

        {/* Networks row — ref compartido: todos los CountUp arrancan al mismo tiempo. */}
        <motion.div
          ref={networksRef}
          className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-8 lg:flex lg:flex-wrap lg:items-center lg:justify-center lg:gap-6 lg:gap-y-17"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.1 } },
          }}
        >
          {finalNetworks.map((net) => (
            <motion.div
              key={net.network}
              className="flex flex-col items-center gap-1 sm:flex-row sm:items-start sm:gap-3"
              variants={itemVariants}
            >
              <a
                href={net.href ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 transition-transform duration-200 ease-out hover:scale-110"
              >
                <Image
                  src={NETWORK_ICON[net.network]}
                  alt={net.network}
                  width={48}
                  height={48}
                  className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12"
                />
              </a>
              <div className="flex flex-col items-center gap-0.5 sm:items-start">
                <p className="font-display text-[20px] leading-5 font-semibold text-white sm:text-[20px] sm:leading-6 lg:text-[28px] lg:leading-7">
                  <CountUp
                    value={net.followers}
                    format={(v) => Math.round(v).toLocaleString("es-CO")}
                    shouldStart={networksInView}
                    reserveWidth
                  />
                </p>
                <p
                  className="text-[12px] leading-4 text-white sm:text-[14px] sm:leading-[20px] lg:text-[16px]"
                  style={{ fontFamily: "var(--font-spline-sans), system-ui" }}
                >
                  Seguidores
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Source */}
        <motion.div
          className="flex items-center justify-end gap-1"
          variants={itemVariants}
        >
          <span
            className="inline-block h-[13px] w-[13px] shrink-0 rounded-full"
            style={{ backgroundColor: CYAN }}
          />
          <p
            className="font-display text-[12px] leading-[18px] text-white"
            style={{ fontWeight: 500 }}
          >
            Fuente: TGI CO 2025
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}
