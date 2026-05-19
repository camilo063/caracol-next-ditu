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
 * GenderPieChart — donut chart con animación grow-from-0.
 * Recharts anima el Pie por default desde el centro al render — ese mismo
 * efecto cubre la spec "grow from 0" cuando el componente se monta al cambiar
 * de tab (porque el padre lo re-monta vía key).
 *
 * Duración 400ms ease-out.
 */
export function GenderPieChart({
  femalePercent,
  femaleLabel = "Mujeres",
  maleLabel = "Hombres",
  primaryColor = "#015BC4",
  secondaryColor = "#66B3FF",
}: GenderPieChartProps) {
  const female = Math.max(0, Math.min(100, femalePercent));
  const male = 100 - female;
  const data = [
    { name: femaleLabel, value: female, color: primaryColor },
    { name: maleLabel, value: male, color: secondaryColor },
  ];

  return (
    <div className="relative aspect-square w-full max-w-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius="42%"
            outerRadius="90%"
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
      {/* Etiquetas internas — colocadas con porcentaje al 75% radial */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-[11px] leading-tight font-bold text-white">
            {female}% {femaleLabel}
          </p>
        </div>
      </div>
      <div className="pointer-events-none absolute" style={{ top: "20%", right: "8%" }}>
        <p
          className="text-[10px] leading-tight font-bold"
          style={{ color: secondaryColor }}
        >
          {male}% {maleLabel}
        </p>
      </div>
    </div>
  );
}
