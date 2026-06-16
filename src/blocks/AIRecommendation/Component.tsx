"use client";

import * as React from "react";
import { Sparkles, Loader2 } from "lucide-react";

import { Button, Container, Section, SectionHeading, Textarea } from "@/components/ui";
import { cn } from "@/lib/utils";
import type { AIRecommendationBlockProps } from "../types";
import { brandFromDoc } from "@/lib/brand";
import { recommend, type Recommendation } from "./actions";

/** Item de la lista `examples` derivado del tipo generado por Payload. */
type AIExample = NonNullable<AIRecommendationBlockProps["examples"]>[number];

export function AIRecommendationBlockComponent({
  anchorId,
  eyebrow,
  heading,
  description,
  placeholder,
  submitLabel,
  model,
  systemPrompt,
  allowedBrands,
  examples,
  disclaimer,
}: AIRecommendationBlockProps) {
  const [prompt, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<Recommendation | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = async (text?: string) => {
    const input = (text ?? prompt).trim();
    if (!input) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // allowedBrands es una relación poblada (depth ≥ 1) → la resolvemos a
      // {slug,label,color} para el server action. Si vacío, el action trae todas.
      const resolvedBrands = Array.isArray(allowedBrands)
        ? allowedBrands
            .map((b) => {
              const meta = brandFromDoc(b as Parameters<typeof brandFromDoc>[0]);
              return meta.slug
                ? { slug: meta.slug, label: meta.label, color: meta.color }
                : null;
            })
            .filter(
              (b): b is { slug: string; label: string; color: string } => b !== null,
            )
        : undefined;

      const res = await recommend({
        prompt: input,
        model: model ?? undefined,
        systemPrompt: systemPrompt ?? undefined,
        allowedBrands: resolvedBrands,
      });
      if (res.ok && res.data) setResult(res.data);
      else setError(res.error ?? "Error desconocido.");
    } catch (err) {
      console.error(err);
      setError("No pudimos conectar con la IA.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section id={anchorId ?? undefined} tone="primary" padding="lg">
      <Container size="lg">
        <SectionHeading
          eyebrow={eyebrow ?? "IA de recomendación"}
          title={heading}
          description={description ?? undefined}
          align="center"
          titleLevel="h2"
        />
        <div className="bg-background text-foreground mt-10 rounded-3xl p-6 shadow-xl sm:p-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void onSubmit();
            }}
            className="space-y-4"
          >
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholder ?? "Describe tu objetivo…"}
              rows={4}
              className="resize-none text-base"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-muted-foreground text-xs">
                Powered by Vercel AI Gateway · {model ?? "anthropic/claude-haiku-4-5"}
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={loading || prompt.trim().length < 5}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Pensando…
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {submitLabel ?? "Recomendar"}
                  </>
                )}
              </Button>
            </div>
          </form>

          {examples && examples.length > 0 ? (
            <div className="mt-6">
              <p className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
                Ejemplos rápidos
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {examples.map((ex: AIExample, i: number) => (
                  <button
                    key={ex.id ?? i}
                    type="button"
                    className="border-border bg-muted hover:bg-foreground hover:text-background rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors"
                    onClick={() => {
                      setPrompt(ex.prompt);
                      void onSubmit(ex.prompt);
                    }}
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {result ? (
            <div
              className="border-border mt-8 rounded-2xl border p-6"
              style={
                {
                  borderColor: result.brandColor,
                  "--color-primary": result.brandColor,
                } as React.CSSProperties
              }
            >
              <p className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
                Recomendación
              </p>
              <h3
                className="font-display mt-2 text-3xl font-extrabold"
                style={{ color: result.brandColor }}
              >
                {result.brandLabel}
              </h3>
              <p className="text-foreground mt-1 text-base font-semibold">
                Formato: {result.format}
              </p>
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                {result.reasoning}
              </p>
              {result.alternativeBrands && result.alternativeBrands.length > 0 ? (
                <p className="text-muted-foreground mt-4 text-xs">
                  Alternativas:{" "}
                  {result.alternativeBrands
                    .map((b) => (b as string).toUpperCase())
                    .join(" · ")}
                </p>
              ) : null}
            </div>
          ) : null}

          {error ? (
            <div
              className={cn(
                "border-destructive/30 bg-destructive/5 text-destructive mt-8 rounded-2xl border p-4 text-sm",
              )}
            >
              {error}
            </div>
          ) : null}

          {disclaimer ? (
            <p className="text-muted-foreground mt-6 text-center text-xs">{disclaimer}</p>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
