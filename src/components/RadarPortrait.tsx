"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import type { RadarScores } from "@/lib/calculateResult";

export function RadarPortrait({ radar }: { radar: RadarScores }) {
  const data = Object.entries(radar ?? {}).map(([dimension, value]) => ({ dimension, value }));

  return (
    <div className="h-72 border border-ink/15 bg-white/30 p-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="rgba(31,31,29,0.16)" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: "rgba(31,31,29,0.64)", fontSize: 12 }} />
          <Radar dataKey="value" stroke="#6F7F8F" fill="#6F7F8F" fillOpacity={0.28} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
