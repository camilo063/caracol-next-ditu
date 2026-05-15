"use server";

import { generateObject } from "ai";
import { z } from "zod";

import { brandMeta, type BrandKey } from "@/lib/brand";

/** Forma estricta de salida del LLM — usamos generateObject + Zod. */
const recommendationSchema = z.object({
  brand: z.enum([
    "ditu",
    "caracoltv",
    "golcaracol",
    "caracolsports",
    "bluradio",
    "lakalle",
    "volk",
    "bumbox",
    "caracoldigital",
    "caracolmedios",
  ]),
  format: z.string().describe("Nombre del formato de pauta recomendado"),
  reasoning: z.string().describe("Justificación breve, máx 2 frases"),
  alternativeBrands: z.array(z.string()).max(2).describe("Marcas alternativas posibles"),
});

export type Recommendation = z.infer<typeof recommendationSchema> & {
  brandLabel: string;
  brandColor: string;
};

export interface RecommendationResult {
  ok: boolean;
  data?: Recommendation;
  error?: string;
}

interface RecommendArgs {
  prompt: string;
  model?: string;
  systemPrompt?: string;
  allowedBrands?: string[];
}

/**
 * Server Action — llama a Vercel AI Gateway con generateObject.
 * Usa modelo identificado por `"provider/model"` string (sin SDK provider-specific).
 */
export async function recommend({
  prompt,
  model = "anthropic/claude-haiku-4-5",
  systemPrompt,
  allowedBrands,
}: RecommendArgs): Promise<RecommendationResult> {
  const cleaned = prompt.trim();
  if (cleaned.length < 5) {
    return { ok: false, error: "Describe tu objetivo con un poco más de detalle." };
  }

  try {
    const allowed =
      allowedBrands && allowedBrands.length > 0
        ? allowedBrands
        : Object.keys(brandMeta("ditu") ? brandMeta : {});
    const allowedList = (allowed as string[])
      .map((b) => `${b} (${brandMeta(b).label})`)
      .join(", ");

    const { object } = await generateObject({
      model,
      schema: recommendationSchema,
      system:
        systemPrompt ??
        "Eres un asesor comercial del ecosistema Caracol Medios. Responde en español neutro y conciso.",
      prompt: [
        `Marcas disponibles para recomendar (responde con el slug, no el nombre): ${allowedList}.`,
        "",
        "Objetivo del anunciante:",
        cleaned,
      ].join("\n"),
    });

    const meta = brandMeta(object.brand as BrandKey);
    return {
      ok: true,
      data: {
        ...object,
        brandLabel: meta.label,
        brandColor: meta.color,
      },
    };
  } catch (err) {
    console.error("[AIRecommendation] error", err);
    return {
      ok: false,
      error:
        "No pudimos generar la recomendación. Si el problema persiste, escríbenos por WhatsApp.",
    };
  }
}
