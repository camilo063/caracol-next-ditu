"use client";

import * as React from "react";
import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";

import {
  Button,
  Container,
  Input,
  Label,
  Section,
  SectionHeading,
  Textarea,
} from "@/components/ui";
import { RepresentativeCard } from "@/components/marketing";
import { cn } from "@/lib/utils";
import type { ContactBlockProps } from "../types";

type FormShape = Record<string, string | boolean>;

interface PluginField {
  blockType: string;
  name?: string | null;
  label?: string | null;
  required?: boolean | null;
  width?: number | null;
  defaultValue?: string | boolean | null;
}

export function ContactBlockComponent(props: ContactBlockProps) {
  const {
    anchorId,
    eyebrow,
    heading,
    headingEmphasis,
    description,
    form,
    representatives,
    layout,
    ctaButton,
  } = props;

  // Layout cta-simple → cierre tipo Figma (heading + emphasis bold + descripción + 1 botón).
  if (layout === "cta-simple") {
    return (
      <CtaSimpleLayout
        anchorId={anchorId}
        heading={heading}
        headingEmphasis={headingEmphasis ?? undefined}
        description={description ?? undefined}
        ctaButton={ctaButton}
      />
    );
  }

  // `form` puede ser ID o objeto populado del plugin form-builder.
  const formObj = typeof form === "object" && form !== null ? form : null;
  const fields = (formObj?.fields ?? []) as PluginField[];
  const reps = representatives ?? [];

  const showForm = layout !== "reps-only" && fields.length > 0;
  const showReps = layout !== "form-only" && reps.length > 0;

  return (
    <Section id={anchorId ?? "contacto"} tone="muted" padding="lg">
      <Container size="xl">
        <SectionHeading
          eyebrow={eyebrow ?? undefined}
          title={heading}
          description={description ?? undefined}
          align="center"
        />

        <div
          className={cn(
            "mt-10 grid gap-8",
            layout === "stacked" && "grid-cols-1",
            (layout === "form-reps" || !layout) && "lg:grid-cols-[3fr_2fr]",
            layout === "reps-only" && "grid-cols-1",
            layout === "form-only" && "mx-auto max-w-2xl",
          )}
        >
          {showForm ? (
            <ContactForm
              formId={
                typeof form === "object" && form
                  ? (form as { id?: string | number }).id
                  : undefined
              }
              fields={fields}
              submitLabel={(formObj?.submitButtonLabel as string | null) ?? "Enviar"}
            />
          ) : null}

          {showReps ? (
            <div
              className={cn(
                "grid gap-4",
                layout === "stacked" || layout === "reps-only"
                  ? "sm:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1",
              )}
            >
              {reps.map((rep, i) => (
                <RepresentativeCard
                  key={i}
                  name={rep.name}
                  role={rep.role ?? undefined}
                  email={rep.email}
                  whatsapp={rep.whatsapp}
                  photo={rep.photo}
                  layout={layout === "stacked" ? "stacked" : "row"}
                />
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

function ContactForm({
  formId,
  fields,
  submitLabel,
}: {
  formId?: string | number;
  fields: PluginField[];
  submitLabel: string;
}) {
  const { register, handleSubmit, formState, reset } = useForm<FormShape>();
  const [status, setStatus] = React.useState<"idle" | "ok" | "error">("idle");

  const onSubmit: SubmitHandler<FormShape> = async (data) => {
    if (!formId) {
      setStatus("error");
      return;
    }
    try {
      const res = await fetch("/api/form-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form: formId,
          submissionData: Object.entries(data).map(([field, value]) => ({
            field,
            value: String(value),
          })),
        }),
      });
      if (!res.ok) throw new Error("submit failed");
      setStatus("ok");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border-border bg-background space-y-4 rounded-2xl border p-6 sm:p-8"
    >
      {/* Honeypot anti-bot — humanos no lo ven ni lo enfocan.
          Si llega lleno al server, el hook beforeChange dropea la submission. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
        {...register("_hp")}
      />
      {fields.map((field, i) => {
        const name = field.name ?? `field_${i}`;
        const label = field.label ?? name;
        const isFullWidth = !field.width || field.width >= 100;
        return (
          <div
            key={`${name}-${i}`}
            className={cn(
              !isFullWidth && "sm:mr-2 sm:inline-block sm:w-[calc(50%-0.5rem)]",
            )}
          >
            {field.blockType === "message" ? (
              <p className="text-muted-foreground text-sm">{label}</p>
            ) : (
              <>
                <Label htmlFor={name} className="mb-1.5 block">
                  {label}
                  {field.required ? (
                    <span className="text-destructive ml-0.5">*</span>
                  ) : null}
                </Label>
                {field.blockType === "textarea" ? (
                  <Textarea
                    id={name}
                    required={!!field.required}
                    rows={4}
                    {...register(name, { required: !!field.required })}
                  />
                ) : field.blockType === "checkbox" ? (
                  <input
                    id={name}
                    type="checkbox"
                    className="border-input h-4 w-4 rounded"
                    {...register(name)}
                  />
                ) : (
                  <Input
                    id={name}
                    type={field.blockType === "email" ? "email" : "text"}
                    required={!!field.required}
                    defaultValue={(field.defaultValue as string | undefined) ?? undefined}
                    {...register(name, { required: !!field.required })}
                  />
                )}
              </>
            )}
          </div>
        );
      })}
      <Button
        type="submit"
        size="lg"
        disabled={formState.isSubmitting}
        className="w-full sm:w-auto"
      >
        {formState.isSubmitting ? "Enviando…" : submitLabel}
      </Button>
      {status === "ok" ? (
        <p className="text-success text-sm font-semibold">
          ¡Gracias! Te contactaremos pronto.
        </p>
      ) : null}
      {status === "error" ? (
        <p className="text-destructive text-sm font-semibold">
          Algo falló. Inténtalo de nuevo o escríbenos por WhatsApp.
        </p>
      ) : null}
    </form>
  );
}

/* ---------------------------------------------------------------------------
   CtaSimpleLayout — cierre tipo Figma adjunto caracol-next.
   "Con nosotros, lleva tu marca" + bold "al siguiente nivel."
   + descripción + 1 botón centrado. Fondo gris claro (#F2F2F2).
   --------------------------------------------------------------------------- */

interface CtaSimpleLayoutProps {
  anchorId?: string | null;
  heading: string;
  headingEmphasis?: string;
  description?: string;
  ctaButton?: ContactBlockProps["ctaButton"];
}

function CtaSimpleLayout({
  anchorId,
  heading,
  headingEmphasis,
  description,
  ctaButton,
}: CtaSimpleLayoutProps) {
  const ctaLabel = ctaButton?.label || "Contáctenos";
  const ctaHref = ctaButton?.href || "#contacto";

  return (
    <section
      id={anchorId ?? "contacto"}
      className="bg-background py-12 sm:py-16 lg:py-[94px]"
    >
      {/* Figma 634:4392: container con px-64 py-94, gap-24 entre texto y botón.
          Sin background card — usa el bg del page. */}
      <div className="mx-auto flex max-w-[1232px] flex-col items-center gap-6 px-4 sm:px-8 lg:gap-6 lg:px-[64px]">
        <div className="flex w-full flex-col items-center gap-6 px-4 py-4 text-center sm:px-8 lg:px-10 lg:py-4">
          {/* Heading: 2 líneas — Medium 64px (line 1) + Black 64px (line 2). */}
          <h2
            className="font-display text-center text-[32px] leading-[1.125] lg:text-[64px] lg:leading-[72px]"
            style={{ color: "#003381" }}
          >
            <span className="block font-medium">{heading}</span>
            {headingEmphasis ? (
              <span className="block font-black">{headingEmphasis}</span>
            ) : null}
          </h2>
          {/* Description: Regular 24px line-height 32 color #464553. */}
          {description ? (
            <p
              className="font-display max-w-[900px] text-center text-[16px] leading-[24px] font-normal sm:text-[20px] lg:text-[24px] lg:leading-[32px]"
              style={{ color: "#464553" }}
            >
              {description}
            </p>
          ) : null}
        </div>
        {/* CTA: bg #015BC4 306x48 SemiBold 18px white px-48 py-12. */}
        <Link
          href={ctaHref}
          className={cn(
            "font-display inline-flex h-12 w-[306px] items-center justify-center rounded-[4px] text-[18px] leading-[24px] font-semibold text-white transition-opacity hover:opacity-90",
            "focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
          )}
          style={{ backgroundColor: "#015BC4" }}
        >
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}
