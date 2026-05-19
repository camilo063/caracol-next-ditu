"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Container, Section } from "@/components/ui";
import type { BlockOf } from "../types";

type Props = BlockOf<"audience-profile">;

const FEMALE_COLOR = "#77EDED";
const MALE_COLOR = "#8232F0";
const BAR_COLOR = "#8232F0";

export function AudienceProfileBlockComponent({
  anchorId,
  eyebrow,
  heading,
  description,
  genderSplit,
  ageBars,
  footnote,
}: Props) {
  const female = Math.max(0, Math.min(100, genderSplit?.femalePercent ?? 50));
  const male = 100 - female;
  const pieData = [
    { name: genderSplit?.femaleLabel ?? "Mujeres", value: female, color: FEMALE_COLOR },
    { name: genderSplit?.maleLabel ?? "Hombres", value: male, color: MALE_COLOR },
  ];

  const barData = (ageBars ?? []).map((b) => ({
    name: b.label,
    value: b.value,
    suffix: b.suffix ?? "",
  }));

  return (
    <Section
      id={anchorId ?? "adn"}
      padding="lg"
      className="text-white"
      style={{
        background: "linear-gradient(180deg, #1F1647 0%, #2A1F5E 60%, #1F1647 100%)",
      }}
    >
      <Container size="xl">
        <p
          className="text-xs font-bold tracking-[0.18em] uppercase"
          style={{ color: "#77EDED" }}
        >
          {eyebrow ?? "ADN Ditu"}
        </p>
        <h2 className="font-display mt-3 text-3xl leading-tight font-bold sm:text-4xl md:text-5xl">
          {heading}
        </h2>
        {description ? (
          <p className="mt-3 max-w-3xl text-base text-white/80">{description}</p>
        ) : null}

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_2fr] lg:items-center">
          {/* Pie chart */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-bold tracking-wide text-white/70 uppercase">
              Género
            </p>
            <div className="mt-4 flex items-center gap-6">
              <div className="relative h-44 w-44 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={48}
                      outerRadius={72}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display text-2xl font-bold">{female}%</span>
                  <span className="text-[10px] text-white/60 uppercase">
                    {pieData[0]!.name}
                  </span>
                </div>
              </div>
              <ul className="space-y-3 text-sm">
                {pieData.map((d) => (
                  <li key={d.name} className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className="inline-block h-3 w-3 rounded-full"
                      style={{ backgroundColor: d.color }}
                    />
                    <span className="font-bold">{d.value}%</span>
                    <span className="text-white/70">{d.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bar chart */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs font-bold tracking-wide text-white/70 uppercase">
              Watch time por canal
            </p>
            <div className="mt-4 h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  margin={{ top: 16, right: 12, left: -8, bottom: 4 }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="rgba(255,255,255,0.6)"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="rgba(255,255,255,0.6)"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                      backgroundColor: "#1F1647",
                      border: "1px solid rgba(255,255,255,0.15)",
                      borderRadius: 8,
                      color: "white",
                      fontSize: 12,
                    }}
                    formatter={(
                      v: number,
                      _name,
                      props: { payload?: { suffix?: string } },
                    ) => [
                      `${v}${props.payload?.suffix ? " " + props.payload.suffix : ""}`,
                      "Valor",
                    ]}
                  />
                  <Bar dataKey="value" fill={BAR_COLOR} radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {footnote ? (
          <p className="mt-6 text-right text-xs text-white/60">{footnote}</p>
        ) : null}
      </Container>
    </Section>
  );
}
