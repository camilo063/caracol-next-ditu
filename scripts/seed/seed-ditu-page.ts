import type { Payload } from "payload";

/**
 * Pobla el global `ditu-page` con los valores iniciales que los componentes
 * Ditu ya tenían hardcoded como DEFAULTS. A partir de este seed, el editor
 * controla cada texto/cifra desde `/admin/globals/ditu-page`.
 */
export async function seedDituPage(payload: Payload): Promise<void> {
  console.log("🟣 Seedeando ditu-page...");

  await payload.updateGlobal({
    slug: "ditu-page",
    data: {
      // ============================================
      // HERO
      // ============================================
      hero: {
        stickerText: "TU MARCA",
        headingPlaceholderText: "Tu marca ",
        headingMainText: "en todas las pantallas, ",
        headingEmphasisText: "en todo momento",
        descriptionSegments: [
          {
            text: "Somos ditu la plataforma OTT que integra lo mejor de Caracol Televisión en un ",
            boldCyan: false,
          },
          { text: "ecosistema multiplataforma", boldCyan: true },
          {
            text: ", desde la pantalla grande hasta el smartphone. Ofrecemos una experiencia gratuita de fácil acceso que se convierte en la ",
            boldCyan: false,
          },
          { text: "vitrina estratégica ideal para que tu marca", boldCyan: true },
          {
            text: " conecte con una audiencia masiva, fiel y comprometida.",
            boldCyan: false,
          },
        ],
        buttons: [
          { label: "Google Play", href: "#", icon: "googleplay" },
          { label: "App Store", href: "#", icon: "appstore" },
          { label: "Portal web", href: "#", icon: "tv" },
        ],
      },

      // ============================================
      // VIDEO BLOCK
      // ============================================
      video: { alt: "" },

      // ============================================
      // AUDIENCIA
      // ============================================
      audiencia: {
        totalFollowersHeadline: "+1.7M",
        stats: [
          {
            label: "Descargas acumuladas",
            value: 10717937,
            description: "De puertas abiertas para tu marca",
            icon: "/ditu/icon-download.svg",
            large: true,
          },
          {
            label: "Dispositivos activos",
            value: 3039409,
            description: "Pantallas encendidas cada mes",
            icon: "/ditu/icon-livetv.svg",
            large: false,
          },
          {
            label: "Pico dispositivos/día",
            value: 474339,
            description: "En su momento de mayor atención",
            icon: "/ditu/icon-bolt.svg",
            large: false,
          },
        ],
        devices: [
          { label: "Smart TV", minutes: 52, icon: "/ditu/icon-smarttv.svg" },
          { label: "Mobile", minutes: 32, icon: "/ditu/icon-mobile.svg" },
          { label: "Tablet", minutes: 34, icon: "/ditu/icon-tablet.svg" },
          { label: "Web", minutes: 28, icon: "/ditu/icon-web.svg" },
        ],
        networks: [
          { network: "facebook", followers: 45274642 },
          { network: "tiktok", followers: 21101000 },
          { network: "x", followers: 20675885 },
          { network: "youtube", followers: 19201460 },
          { network: "instagram", followers: 14076513 },
          { network: "whatsapp", followers: 4991401 },
        ],
      },

      // ============================================
      // ADN
      // ============================================
      adn: {
        ageBars: [
          { label: "18-24", value: 58, peak: false },
          { label: "25-34", value: 80, peak: false },
          { label: "35-44", value: 95, peak: false },
          { label: "45-54", value: 58, peak: false },
          { label: "55-64", value: 148, peak: true },
          { label: "+65", value: 74, peak: false },
        ],
        genderData: [
          { name: "Hombres", value: 52, color: "#77EDED" },
          { name: "Mujeres", value: 48, color: "#561BDB" },
        ],
        nseCards: [
          { label: "ESTRATO 1 o 2", value: 22.7 },
          { label: "ESTRATO 3", value: 37.8 },
          { label: "ESTRATO 4", value: 28.9 },
          { label: "ESTRATO 5 o 6", value: 10.6 },
        ],
      },

      // ============================================
      // TIPO CONTENIDO
      // ============================================
      tipoContenido: {
        autoplayInterval: 5000,
        tabs: [
          {
            label: "FAST",
            description:
              "Canales digitales con programación las 24 horas, especializados en temáticas específicas (cocina, películas de acción, series). Es la experiencia de la TV tradicional pero con contenido curado para nichos concretos.",
          },
          {
            label: "Simulcasts / en vivo",
            description:
              "Transmisión simultánea de la señal abierta y eventos en vivo. El usuario ve en streaming exactamente lo que está en pantalla, con la misma inmediatez que la TV tradicional.",
          },
          {
            label: "VOD / Catchup",
            description:
              "Biblioteca de contenido on-demand: novelas, series y producciones de Caracol disponibles cuando el usuario quiera. La libertad de elegir qué ver y cuándo.",
          },
        ],
      },

      // ============================================
      // CANALES
      // ============================================
      canales: {
        tabs: [
          { key: "envivo", label: "EN VIVO" },
          { key: "fast", label: "FAST" },
          { key: "aliados", label: "Aliados" },
        ],
        channels: [
          { tabKey: "envivo", name: "caracol televisión", brand: "caracoltv" },
          { tabKey: "envivo", name: "blu", brand: "bluradio" },
          { tabKey: "envivo", name: "noticias caracol en vivo", brand: "caracoltv" },
          { tabKey: "envivo", name: "la kalle", brand: "lakalle" },
          { tabKey: "envivo", name: "Caracol Sports", brand: "caracolsports" },
          { tabKey: "envivo", name: "a otro nivel", brand: "caracolmedios" },
          { tabKey: "envivo", name: "negocios ditu", brand: "ditu" },
          { tabKey: "fast", name: "Caracol FAST", brand: "caracoltv" },
          { tabKey: "fast", name: "Sports FAST", brand: "caracolsports" },
          { tabKey: "aliados", name: "Eventos Caracol en vivo", brand: "caracoltv" },
          { tabKey: "aliados", name: "A otro Nivel", brand: "caracolmedios" },
        ],
      },

      // ============================================
      // CALENDARIO
      // ============================================
      calendario: {
        events: [
          {
            title: "FilBo 2026",
            subtitle: "Libros e historias",
            dateLabel: "DEL 06 DE MARZO AL 04 DE MAYO",
            startDate: "2026-03-06",
            endDate: "2026-05-04",
            category: "Categoría",
            badgeVariant: "cyan",
          },
          {
            title: "Carnaval de Barranquilla",
            subtitle: "Celebraciones",
            dateLabel: "DEL 13 AL 17 DE MARZO",
            startDate: "2026-03-13",
            endDate: "2026-03-17",
            category: "Categoría",
            badgeVariant: "violet",
          },
          {
            title: "Mundial / Eurocopa",
            subtitle: "Picos deportivos",
            dateLabel: "JUN",
            startDate: "2026-06-11",
            endDate: "2026-07-19",
            category: "Categoría",
            badgeVariant: "navy",
          },
          {
            title: "Día de la independencia",
            subtitle: "Conversaciones",
            dateLabel: "20 - JUL",
            startDate: "2026-07-20",
            endDate: "2026-07-20",
            category: "Categoría",
            badgeVariant: "white",
          },
          {
            title: "San Valentín",
            subtitle: "Conexiones",
            dateLabel: "14 DE FEBRERO",
            startDate: "2026-02-14",
            endDate: "2026-02-14",
            category: "Categoría",
            badgeVariant: "cyan",
          },
          {
            title: "Día del Padre",
            subtitle: "Familias",
            dateLabel: "21 DE JUNIO",
            startDate: "2026-06-21",
            endDate: "2026-06-21",
            category: "Categoría",
            badgeVariant: "violet",
          },
          {
            title: "Día de la Madre",
            subtitle: "Tributos",
            dateLabel: "10 DE MAYO",
            startDate: "2026-05-10",
            endDate: "2026-05-10",
            category: "Categoría",
            badgeVariant: "navy",
          },
          {
            title: "Día del Amor y la Amistad",
            subtitle: "Conexiones",
            dateLabel: "19 DE SEPTIEMBRE",
            startDate: "2026-09-19",
            endDate: "2026-09-19",
            category: "Categoría",
            badgeVariant: "white",
          },
          {
            title: "Halloween",
            subtitle: "Espectáculos",
            dateLabel: "31 DE OCTUBRE",
            startDate: "2026-10-31",
            endDate: "2026-10-31",
            category: "Categoría",
            badgeVariant: "cyan",
          },
          {
            title: "Navidad",
            subtitle: "Tradiciones",
            dateLabel: "DEL 20 AL 31 DE DICIEMBRE",
            startDate: "2026-12-20",
            endDate: "2026-12-31",
            category: "Categoría",
            badgeVariant: "violet",
          },
          {
            title: "Fin de Año",
            subtitle: "Celebraciones",
            dateLabel: "31 DE DICIEMBRE",
            startDate: "2026-12-31",
            endDate: "2026-12-31",
            category: "Categoría",
            badgeVariant: "navy",
          },
          {
            title: "Festival de Cine Cartagena",
            subtitle: "Cultura audiovisual",
            dateLabel: "DEL 05 AL 12 DE OCTUBRE",
            startDate: "2026-10-05",
            endDate: "2026-10-12",
            category: "Categoría",
            badgeVariant: "white",
          },
          {
            title: "Rock al Parque",
            subtitle: "Música en vivo",
            dateLabel: "DEL 04 AL 06 DE JULIO",
            startDate: "2026-07-04",
            endDate: "2026-07-06",
            category: "Categoría",
            badgeVariant: "cyan",
          },
          {
            title: "Feria de las Flores",
            subtitle: "Tradiciones",
            dateLabel: "DEL 31 DE JULIO AL 09 DE AGOSTO",
            startDate: "2026-07-31",
            endDate: "2026-08-09",
            category: "Categoría",
            badgeVariant: "violet",
          },
        ],
      },

      // ============================================
      // PAUTA
      // ============================================
      pauta: {
        categories: [
          {
            key: "ads",
            label: "Ad's",
            formats: [
              {
                tag: "Ad-s",
                title: "pre-roll",
                description:
                  "El pre-roll es un anuncio de video que se reproduce antes de que inicie el contenido principal que el usuario ha seleccionado.",
              },
              {
                tag: "Ad-s",
                title: "MID-ROLL",
                description:
                  "Mid-roll es un anuncio que aparece en una pausa o corte programado durante la reproducción de un contenido.",
              },
              {
                tag: "Ad-s",
                title: "DAI",
                description:
                  "La pauta DAI se refiere a la inserción de anuncios en los cortes comerciales de canales que transmiten en simultáneo (simulcast) la señal de televisión lineal.",
              },
            ],
          },
          {
            key: "patrocinio",
            label: "Patrocinio",
            formats: [
              {
                tag: "Patrocinio",
                title: "patrocinio de canal",
                description:
                  "Vincula tu marca a un canal FAST completo con presencia constante en bumpers, billboards y placement editorial.",
              },
              {
                tag: "Patrocinio",
                title: "PATROCINIO DE PROGRAMA",
                description:
                  "Asocia tu marca con un programa específico de Caracol Televisión vía bumper de entrada, salida y menciones del presentador.",
              },
              {
                tag: "Patrocinio",
                title: "PATROCINIO DE EVENTO",
                description:
                  "Tu marca presente en los eventos en vivo más importantes — Mundial, Eurocopa, Festival de Cine, conciertos y más.",
              },
            ],
          },
          {
            key: "branded",
            label: "Branded",
            formats: [
              {
                tag: "Branded",
                title: "branded content",
                description:
                  "Contenido original creado en alianza con tu marca — narrativas integradas a la línea editorial de ditu y Caracol Next.",
              },
              {
                tag: "Branded",
                title: "SERIES PROPIAS",
                description:
                  "Co-producimos series y miniseries con tu marca como eje narrativo, distribuidas en ditu y redes sociales.",
              },
              {
                tag: "Branded",
                title: "PODCASTS",
                description:
                  "Branded podcasts conducidos por talento Caracol con tu marca presente desde guion hasta distribución.",
              },
            ],
          },
          {
            key: "eventos",
            label: "Eventos especiales",
            formats: [
              {
                tag: "Eventos",
                title: "MUNDIAL / EUROCOPA",
                description:
                  "Activaciones publicitarias premium durante coberturas deportivas masivas — pre/mid-rolls + branding integrado.",
              },
              {
                tag: "Eventos",
                title: "FESTIVALES",
                description:
                  "Patrocinio integral de festivales de música, cine y cultura con cobertura en vivo en Caracol Next.",
              },
              {
                tag: "Eventos",
                title: "FECHAS ESPECIALES",
                description:
                  "20 de Julio, Día del Padre, Día de la Madre — fechas de alto consumo con paquetes publicitarios curados.",
              },
            ],
          },
        ],
      },

      // ============================================
      // HABLAMOS
      // ============================================
      hablamos: {
        stickerText: "¿HABLAMOS?",
        headingLine1: "Lleva tu marca",
        headingLine2: "al siguiente nivel.",
        headingLine2Emphasis: "siguiente nivel.",
        subtitle: "Cuéntanos tus objetivos y armemos juntos la mejor estrategia.",
        ctaLabel: "Contáctanos",
        ctaHref: "#contacto",
      },
    } as Parameters<Payload["updateGlobal"]>[0]["data"],
  });

  console.log("  ✓ ditu-page");
}
