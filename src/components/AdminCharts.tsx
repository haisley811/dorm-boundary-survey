"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CountItem } from "@/lib/adminStats";

const colors = ["#6F7F8F", "#9B5C5F", "#1F1F1D", "#B8B8B0", "#8D918A", "#C6B8B8"];

export function MiniBarChart({ data }: { data: CountItem[] }) {
  const chartData = data.slice(0, 8);

  if (chartData.length === 0) {
    return <div className="flex h-48 items-center justify-center border border-ink/10 text-sm text-ink/45">暂无数据</div>;
  }

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ left: 18, right: 12, top: 6, bottom: 6 }}>
          <CartesianGrid stroke="rgba(31,31,29,0.08)" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "rgba(31,31,29,0.55)" }} />
          <YAxis dataKey="label" type="category" width={92} tick={{ fontSize: 11, fill: "rgba(31,31,29,0.65)" }} />
          <Tooltip cursor={{ fill: "rgba(111,127,143,0.08)" }} />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {chartData.map((item, index) => (
              <Cell key={item.label} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ResultPieChart({ data }: { data: CountItem[] }) {
  if (data.length === 0) {
    return <div className="flex h-56 items-center justify-center border border-ink/10 text-sm text-ink/45">暂无数据</div>;
  }

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="label" innerRadius={42} outerRadius={78} paddingAngle={3}>
            {data.map((item, index) => (
              <Cell key={item.label} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
