import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Stat — bloque de métrica destacada.
 * Pensado para hero stats tipo "3M pantallas activas" y "42 min watch time" del Ditu hero
 * y para tarjetas de Audiencia + Redes.
 *
 * Nota: usamos `valuePrefix`/`valueSuffix` (no `prefix`/`suffix`) porque esos últimos
 * son atributos HTML globales y rompen el typing de HTMLAttributes<HTMLDivElement>.
 */
const statVariants = cva("flex flex-col gap-1", {
  variants: {
    size: {
      sm: "[--stat-value-size:1.75rem]",
      md: "[--stat-value-size:2.5rem]",
      lg: "[--stat-value-size:3rem]",
      xl: "[--stat-value-size:3.75rem]",
      "2xl": "[--stat-value-size:4.5rem]",
    },
    tone: {
      default: "text-foreground",
      primary: "text-primary",
      inverse: "text-white",
    },
    align: {
      left: "items-start text-left",
      center: "items-center text-center",
      right: "items-end text-right",
    },
  },
  defaultVariants: {
    size: "lg",
    tone: "default",
    align: "left",
  },
});

type StatBaseProps = Omit<React.HTMLAttributes<HTMLDivElement>, "prefix" | "suffix">;

export interface StatProps extends StatBaseProps, VariantProps<typeof statVariants> {
  value: React.ReactNode;
  label: React.ReactNode;
  valuePrefix?: React.ReactNode;
  valueSuffix?: React.ReactNode;
  hint?: React.ReactNode;
}

const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  (
    {
      value,
      label,
      valuePrefix,
      valueSuffix,
      hint,
      size,
      tone,
      align,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(statVariants({ size, tone, align, className }))}
        {...props}
      >
        <div className="flex items-baseline gap-1">
          {valuePrefix ? (
            <span className="font-display text-2xl font-extrabold opacity-70">
              {valuePrefix}
            </span>
          ) : null}
          <span
            className="font-display leading-none font-black tracking-tight"
            style={{ fontSize: "var(--stat-value-size)" }}
          >
            {value}
          </span>
          {valueSuffix ? (
            <span className="font-display text-2xl font-extrabold opacity-70">
              {valueSuffix}
            </span>
          ) : null}
        </div>
        <span className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
          {label}
        </span>
        {hint ? <span className="text-muted-foreground text-xs">{hint}</span> : null}
      </div>
    );
  },
);
Stat.displayName = "Stat";

export { Stat, statVariants };
