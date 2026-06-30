import { Container, Section } from "@/components/ui";
import type { BlockOf } from "../types";

type Props = BlockOf<"estratos">;

/**
 * EstratosBlock — "Y dónde encontrarlo": 4 columnas con % grandes.
 * Matching del Figma `ditu.png` (sección Estratos socioeconomic).
 */
export function EstratosBlockComponent({
  anchorId,
  eyebrow,
  heading,
  description,
  items,
  footnote,
}: Props) {
  if (!items || items.length === 0) return null;

  return (
    <Section
      id={anchorId ?? "donde"}
      padding="lg"
      className="text-white"
      style={{
        background: "linear-gradient(180deg, #2A1F5E 0%, #1F1647 100%)",
      }}
    >
      <Container size="xl">
        <p
          className="text-xs font-bold tracking-[0.18em] uppercase"
          style={{ color: "#77EDED" }}
        >
          {eyebrow ?? "Y dónde encontrarlo"}
        </p>
        <h2 className="font-display mt-3 max-w-3xl text-2xl leading-tight font-bold sm:text-3xl md:text-4xl">
          {heading}
        </h2>
        {description ? (
          <p className="mt-3 max-w-3xl text-base text-white/80">{description}</p>
        ) : null}

        <div
          className="mt-10 grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, minmax(0, 1fr))`,
          }}
        >
          {items.map((it, i) => (
            <div
              key={it.id ?? i}
              className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-xs font-bold tracking-wide text-white/70 uppercase">
                {it.label}
              </p>
              <p
                className="font-display text-4xl leading-none font-bold sm:text-5xl"
                style={{ color: "#77EDED" }}
              >
                {it.value}
                {it.suffix ?? "%"}
              </p>
              {it.hint ? <p className="text-xs text-white/60">{it.hint}</p> : null}
            </div>
          ))}
        </div>

        {footnote ? (
          <p className="mt-6 text-right text-xs text-white/60">{footnote}</p>
        ) : null}
      </Container>
    </Section>
  );
}
