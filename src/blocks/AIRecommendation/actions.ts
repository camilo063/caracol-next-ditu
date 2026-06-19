"use server";

import { generateObject } from "ai";
import config from "@payload-config";
import { getPayload } from "payload";
import { z } from "zod";

/** Forma estricta de salida del LLM — usamos generateObject + Zod. */
const recommendationSchema = z.object({
  brand: z.string().describe("slug de la marca recomendada (de la lista permitida)"),
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

/** Marca resuelta que el componente pasa al action (desde la relación poblada). */
export interface AllowedBrand {
  slug: string;
  label: string;
  color: string;
}

interface RecommendArgs {
  prompt: string;
  model?: string;
  systemPrompt?: string;
  /** Marcas permitidas (resueltas). Si vacío, se traen todas del catálogo. */
  allowedBrands?: AllowedBrand[];
}

/** Trae todas las marcas del catálogo (fallback cuando el bloque no restringe). */
async function fetchAllBrands(): Promise<AllowedBrand[]> {
  const payload = await getPayload({ config });
  const res = await payload.find({ collection: "brands", limit: 100, depth: 0 });
  return res.docs.map((b) => ({
    slug: String(b.slug),
    label: String(b.name),
    color: String(b.color ?? "#015BC4"),
  }));
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
      allowedBrands && allowedBrands.length > 0 ? allowedBrands : await fetchAllBrands();
    const allowedList = allowed.map((b) => `${b.slug} (${b.label})`).join(", ");

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

    // Cruzamos el slug devuelto por el LLM contra las marcas permitidas para
    // sacar label + color. Fallback neutral si devuelve un slug fuera de lista.
    const match = allowed.find((b) => b.slug === object.brand);
    return {
      ok: true,
      data: {
        ...object,
        brandLabel: match?.label ?? object.brand,
        brandColor: match?.color ?? "#015BC4",
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
