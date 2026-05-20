"use client";

import * as React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export interface GenderPieChartProps {
  femalePercent: number;
  femaleLabel?: string;
  maleLabel?: string;
  /** Color para "Mujeres" (% mayor). */
  primaryColor?: string;
  /** Color para "Hombres" (% menor). */
  secondaryColor?: string;
}

/**
 * GenderPieChart — pie SÓLIDO (no donut) con animación grow-from-0.
 * Matching Figma 402:8162-8167 — labels INSIDE las slices en blanco.
 *
 * Recharts anima el Pie por default desde el centro al render. Re-monta al
 * cambiar de tab (vía key) para re-disparar la animación.
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
  const data = [
    { name: femaleLabel, value: female, color: primaryColor },
    { name: maleLabel, value: male, color: secondaryColor },
  ];

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
            animationDuration={400}
            animationEasing="ease-out"
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      {/* Labels INSIDE las slices — posiciones del Figma (relative al 120x120 box).
          Mujeres (slice grande): ~centro-derecha del pie.
          Hombres (slice pequeña): ~esquina superior izquierda. */}
      <div
        className="pointer-events-none absolute font-semibold text-white"
        style={{
          left: "58px",
          top: "62.77px",
          fontSize: "10px",
          textAlign: "center",
          lineHeight: "normal",
          whiteSpace: "nowrap",
        }}
      >
        <span className="block">{female}%</span>
        <span className="block">{femaleLabel}</span>
      </div>
      <div
        className="pointer-events-none absolute font-medium text-white"
        style={{
          left: "8.15px",
          top: "26.77px",
          fontSize: "10px",
          textAlign: "center",
          lineHeight: "normal",
          whiteSpace: "nowrap",
        }}
      >
        <span className="block">{male}%</span>
        <span className="block">{maleLabel}</span>
      </div>
    </div>
  );
}
