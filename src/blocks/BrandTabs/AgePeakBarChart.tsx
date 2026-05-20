"use client";

import * as React from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts";

export interface AgePeakBarChartProps {
  data: Array<{ range: string; value: number; isPeak?: boolean | null }>;
  peakColor?: string;
  baseColor?: string;
}

/**
 * AgePeakBarChart — bar chart con animación grow-from-0 (Recharts default).
 * La barra con `isPeak: true` se pinta en color brand.
 *
 * Duración 400ms ease-out. Re-monta cuando cambia el tab → re-anima.
 */
export function AgePeakBarChart({
  data,
  peakColor = "#003381",
  baseColor = "#D9D9D9",
}: AgePeakBarChartProps) {
  return (
    <div className="h-[88px] w-full min-w-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="range"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 10, fill: "#121212", fontWeight: 500 }}
          />
          <YAxis hide domain={[0, "dataMax"]} />
          <Bar
            dataKey="value"
            radius={[2, 2, 0, 0]}
            isAnimationActive
            animationBegin={0}
            animationDuration={400}
            animationEasing="ease-out"
          >
            {data.map((d, i) => (
              <Cell key={`${d.range}-${i}`} fill={d.isPeak ? peakColor : baseColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
