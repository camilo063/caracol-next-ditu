import type { Block } from "payload";

import { anchorIdField, sectionHeaderFields } from "../shared-fields";

/**
 * AIRecommendationBlock ⭐
 * "El anunciante describe su objetivo, la IA sugiere marca y formato.
 *  Primer mediakit en Colombia con IA — diferenciador brutal."
 *
 * Backend en Fase 3/5: usa Vercel AI Gateway + generateObject con Zod schema.
 */
export const AIRecommendationBlock: Block = {
  slug: "ai-recommendation",
  labels: { singular: "IA de recomendación", plural: "IA de recomendación" },
  fields: [
    anchorIdField,
    ...sectionHeaderFields,
    {
      name: "placeholder",
      type: "text",
      label: "Placeholder del input",
      defaultValue:
        "Quiero llegar a hombres 25-45 en Bogotá interesados en fútbol durante el Mundial…",
    },
    {
      name: "submitLabel",
      type: "text",
      defaultValue: "Recomendar",
    },
    {
      name: "model",
      type: "select",
      label: "Modelo LLM (Vercel AI Gateway)",
      defaultValue: "anthropic/claude-haiku-4-5",
      options: [
        {
          label: "Anthropic Claude Haiku 4.5 (rápido, barato)",
          value: "anthropic/claude-haiku-4-5",
        },
        {
          label: "Anthropic Claude Sonnet 4.6 (calidad)",
          value: "anthropic/claude-sonnet-4-6",
        },
        { label: "OpenAI gpt-4o-mini", value: "openai/gpt-4o-mini" },
        { label: "OpenAI gpt-4.1", value: "openai/gpt-4.1" },
      ],
    },
    {
      name: "systemPrompt",
      type: "textarea",
      label: "System prompt",
      defaultValue:
        "Eres un asesor comercial del ecosistema Caracol Medios. Dada la descripción del objetivo de un anunciante, recomienda la marca y el formato óptimos, con justificación breve. Responde en español neutro y conciso.",
      admin: { rows: 5 },
    },
    {
      name: "allowedBrands",
      type: "relationship",
      relationTo: "brands",
      hasMany: true,
      label: "Marcas habilitadas para recomendar",
      admin: {
        description:
          "Marcas que la IA puede recomendar. Si vacío, se permiten todas las del catálogo.",
      },
    },
    {
      name: "examples",
      type: "array",
      label: "Ejemplos rápidos (chips)",
      labels: { singular: "Ejemplo", plural: "Ejemplos" },
      admin: {
        description:
          "Sugerencias que se muestran como chips para que el usuario pueda probar la IA sin escribir.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "label",
          type: "text",
          required: true,
          admin: { placeholder: "Mundial" },
        },
        { name: "prompt", type: "textarea", required: true },
      ],
    },
    {
      name: "disclaimer",
      type: "textarea",
      label: "Disclaimer al pie del bloque",
      defaultValue:
        "Las recomendaciones son sugerencias automatizadas. Para una propuesta a medida, contáctanos.",
    },
  ],
};
