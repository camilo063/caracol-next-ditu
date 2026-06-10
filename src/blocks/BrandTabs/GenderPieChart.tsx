"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

/** Devuelve "#121212" para colores claros y "#ffffff" para oscuros. */
function contrastColor(hex: string): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  // Luminancia relativa (fórmula W3C)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 140 ? "#121212" : "#ffffff";
}

export interface GenderPieChartProps {
  femalePercent: number;
  femaleLabel?: string;
  maleLabel?: string;
  /** Color para el SLICE MAYOR (lighter / accent). */
  primaryColor?: string;
  /** Color para el SLICE MENOR (darker / panel bg). */
  secondaryColor?: string;
}

/**
 * GenderPieChart — pie SÓLIDO (no donut) con animación grow-from-0.
 * Matching Figma 402:8162-8167.
 *
 * Lógica:
 *  - El SLICE MAYOR siempre se pinta con primaryColor (lighter/accent).
 *  - El SLICE MENOR siempre se pinta con secondaryColor (darker/panel).
 *  - Labels siguen el SLICE (no el género): la label del mayor va al
 *    centro-derecha (ml-58, mt-62.77), la del menor va al top-izq (ml-8, mt-26).
 *  - Cuando mujeres es mayoría (femalePercent ≥ 50): mujeres = larger.
 *  - Cuando hombres es mayoría: hombres = larger.
 */
export function GenderPieChart({
  femalePercent,
  femaleLabel = "Mujeres",
  maleLabel = "Hombres",
  primaryColor = "#00ACFF",
  secondaryColor = "#003381",
}: GenderPieChartProps) {
  const female = Math.max(0, Math.min(100, femalePercent));
  const male = 100 - female;
  const isFemaleMajority = female >= male;

  // Renderizamos la slice MAYOR primero (con primaryColor) y la MENOR después
  // (con secondaryColor). El Pie de Recharts empieza en 90° y va antihorario.
  const data = isFemaleMajority
    ? [
        { name: femaleLabel, value: female, color: primaryColor },
        { name: maleLabel, value: male, color: secondaryColor },
      ]
    : [
        { name: maleLabel, value: male, color: primaryColor },
        { name: femaleLabel, value: female, color: secondaryColor },
      ];

  const largerLabel = isFemaleMajority ? femaleLabel : maleLabel;
  const largerValue = isFemaleMajority ? female : male;
  const smallerLabel = isFemaleMajority ? maleLabel : femaleLabel;
  const smallerValue = isFemaleMajority ? male : female;

  return (
    <div className="relative h-[120px] w-[120px] shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            innerRadius={0}
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            paddingAngle={0}
            stroke="none"
            isAnimationActive
            animationBegin={0}
            animationDuration={600}
            animationEasing="ease-out"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {/* Larger slice label — centro-derecha del pie (Figma ml-58, mt-62.77). */}
      <div
        className="pointer-events-none absolute font-semibold"
        style={{
          left: "58px",
          top: "62.77px",
          fontSize: "10px",
          textAlign: "center",
          lineHeight: "normal",
          whiteSpace: "nowrap",
          color: contrastColor(primaryColor),
        }}
      >
        <span className="block">
          {Number.isInteger(largerValue) ? largerValue : largerValue.toFixed(1)}%
        </span>
        <span className="block">{largerLabel}</span>
      </div>
      {/* Smaller slice label — top-izquierda del pie (Figma ml-8.15, mt-26.77). */}
      <div
        className="pointer-events-none absolute font-medium"
        style={{
          left: "8.15px",
          top: "26.77px",
          fontSize: "10px",
          textAlign: "center",
          lineHeight: "normal",
          whiteSpace: "nowrap",
          color: contrastColor(secondaryColor),
        }}
      >
        <span className="block">
          {Number.isInteger(smallerValue) ? smallerValue : smallerValue.toFixed(1)}%
        </span>
        <span className="block">{smallerLabel}</span>
      </div>
    </div>
  );
}
