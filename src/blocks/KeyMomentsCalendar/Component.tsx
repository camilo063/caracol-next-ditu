import { Container, Section, SectionHeading } from "@/components/ui";
import { EventCard } from "@/components/marketing";
import type { KeyMomentsBlockProps } from "../types";

export function KeyMomentsCalendarComponent({
  anchorId,
  eyebrow,
  heading,
  description,
  events,
  displayMode,
}: KeyMomentsBlockProps) {
  if (!events || events.length === 0) return null;

  return (
    <Section id={anchorId ?? undefined} tone="default" padding="lg">
      <Container size="xl">
        <SectionHeading
          eyebrow={eyebrow ?? undefined}
          title={heading}
          description={description ?? undefined}
        />

        {displayMode === "list" ? (
          <ul className="divide-border border-border mt-10 divide-y border-y">
            {events.map((e) => (
              <li
                key={e.id ?? e.name}
                className="grid gap-2 py-5 md:grid-cols-[200px_1fr_auto] md:items-center"
              >
                <span className="font-display text-xl font-extrabold">{e.name}</span>
                <p className="text-muted-foreground text-sm">{e.description}</p>
                {e.cta?.label && e.cta?.href ? (
                  <a
                    href={e.cta.href}
                    className="text-primary text-sm font-bold underline"
                  >
                    {e.cta.label} →
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        ) : displayMode === "timeline" ? (
          <div className="-mx-4 mt-10 overflow-x-auto px-4">
            <div className="flex min-w-max gap-4 pb-4">
              {events.map((e) => (
                <div key={e.id ?? e.name} className="w-[320px] shrink-0">
                  <EventCard
                    name={e.name}
                    dateStart={e.dateStart}
                    dateEnd={e.dateEnd}
                    description={e.description}
                    image={e.image}
                    importance={e.importance}
                    category={e.category ?? undefined}
                    ctaLabel={e.cta?.label}
                    ctaHref={e.cta?.href}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((e) => (
              <EventCard
                key={e.id ?? e.name}
                name={e.name}
                dateStart={e.dateStart}
                dateEnd={e.dateEnd}
                description={e.description}
                image={e.image}
                importance={e.importance}
                category={e.category ?? undefined}
                ctaLabel={e.cta?.label}
                ctaHref={e.cta?.href}
              />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}
