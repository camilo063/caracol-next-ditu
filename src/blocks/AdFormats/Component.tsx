"use client";

import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Button,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";
import { FormatCard } from "@/components/marketing";
import { brandMeta } from "@/lib/brand";
import { cn } from "@/lib/utils";
import type { AdFormatsBlockProps } from "../types";

const CATEGORY_LABELS: Record<string, string> = {
  display: "Display",
  video: "Video",
  audio: "Audio",
  branded: "Branded Content",
  sponsorship: "Patrocinio",
  multigallery: "Multigalería",
  other: "Otro",
};

export function AdFormatsBlockComponent({
  anchorId,
  eyebrow,
  heading,
  description,
  formats,
  displayMode,
  filtersEnabled,
}: AdFormatsBlockProps) {
  const [brandFilter, setBrandFilter] = React.useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null);

  if (!formats || formats.length === 0) return null;

  const brands = Array.from(
    new Set(formats.map((f) => f.brand).filter(Boolean)),
  ) as string[];
  const categories = Array.from(
    new Set(formats.map((f) => f.category).filter(Boolean)),
  ) as string[];

  const filtered = formats.filter((f) => {
    if (brandFilter && f.brand !== brandFilter) return false;
    if (categoryFilter && f.category !== categoryFilter) return false;
    return true;
  });

  return (
    <Section id={anchorId ?? undefined} tone="default" padding="lg">
      <Container size="xl">
        <SectionHeading
          eyebrow={eyebrow ?? undefined}
          title={heading}
          description={description ?? undefined}
        />

        {filtersEnabled && (brands.length > 1 || categories.length > 1) ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {brands.length > 1 ? (
              <FilterGroup
                label="Marca:"
                options={[
                  { value: null, label: "Todas" },
                  ...brands.map((b) => ({ value: b, label: brandMeta(b).label })),
                ]}
                value={brandFilter}
                onChange={setBrandFilter}
              />
            ) : null}
            {categories.length > 1 ? (
              <FilterGroup
                label="Tipo:"
                options={[
                  { value: null, label: "Todos" },
                  ...categories.map((c) => ({
                    value: c,
                    label: CATEGORY_LABELS[c] ?? c,
                  })),
                ]}
                value={categoryFilter}
                onChange={setCategoryFilter}
              />
            ) : null}
          </div>
        ) : null}

        {displayMode === "accordion" ? (
          <Accordion type="single" collapsible className="mt-10">
            {filtered.map((f) => (
              <AccordionItem key={f.id ?? f.name} value={f.id ?? f.name}>
                <AccordionTrigger>
                  <span className="flex flex-wrap items-center gap-2">
                    <span>{f.name}</span>
                    {f.brand ? (
                      <Badge variant="secondary">{brandMeta(f.brand).label}</Badge>
                    ) : null}
                    {f.category ? (
                      <Badge variant="outline">
                        {CATEGORY_LABELS[f.category] ?? f.category}
                      </Badge>
                    ) : null}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  {f.specs ? (
                    <p className="text-foreground/90">
                      Specs editoriales (richText) — render completo en Fase 3.5.
                    </p>
                  ) : null}
                  {f.downloadUrl ? (
                    <Button variant="outline" size="sm" asChild className="mt-3">
                      <a href={f.downloadUrl} target="_blank" rel="noopener noreferrer">
                        Descargar briefing
                      </a>
                    </Button>
                  ) : null}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : displayMode === "table" ? (
          <div className="border-border mt-10 overflow-hidden rounded-xl border">
            <table className="w-full text-left">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-xs font-bold tracking-wide uppercase">
                    Formato
                  </th>
                  <th className="px-4 py-3 text-xs font-bold tracking-wide uppercase">
                    Marca
                  </th>
                  <th className="px-4 py-3 text-xs font-bold tracking-wide uppercase">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-xs font-bold tracking-wide uppercase">
                    Brief
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {filtered.map((f) => (
                  <tr key={f.id ?? f.name}>
                    <td className="px-4 py-3 text-sm font-semibold">{f.name}</td>
                    <td className="text-muted-foreground px-4 py-3 text-sm">
                      {f.brand ? brandMeta(f.brand).label : "—"}
                    </td>
                    <td className="text-muted-foreground px-4 py-3 text-sm">
                      {f.category ? (CATEGORY_LABELS[f.category] ?? f.category) : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {f.downloadUrl ? (
                        <a
                          href={f.downloadUrl}
                          className="text-primary font-bold underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Descargar
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((f) => (
              <FormatCard
                key={f.id ?? f.name}
                name={f.name}
                brand={f.brand}
                category={
                  f.category ? (CATEGORY_LABELS[f.category] ?? f.category) : undefined
                }
                image={f.image}
                downloadUrl={f.downloadUrl}
              />
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}

function FilterGroup({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string | null; label: string }[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-xs font-bold tracking-wide uppercase">
        {label}
      </span>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt.value ?? "all"}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold transition-colors",
              value === opt.value
                ? "bg-foreground text-background border-foreground"
                : "border-border text-foreground hover:bg-muted",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
