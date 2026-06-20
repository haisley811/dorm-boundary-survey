import type { ResponseRow } from "@/lib/supabase";

export type CountItem = {
  label: string;
  count: number;
};

export type AdminStats = {
  total: number;
  regionDistribution: CountItem[];
  beijingSamples: number;
  dormSizeDistribution: CountItem[];
  boundaryStrategyRanking: CountItem[];
  intrusionRanking: CountItem[];
  psychologicalEffectRanking: CountItem[];
  responsibilityDistribution: CountItem[];
  resultTypeDistribution: CountItem[];
};

export function buildStats(rows: ResponseRow[]): AdminStats {
  return {
    total: rows.length,
    regionDistribution: countSingle(rows, "region"),
    beijingSamples: rows.filter((row) => row.is_beijing_school === "是" || row.region === "北京").length,
    dormSizeDistribution: countSingle(rows, "dorm_size"),
    boundaryStrategyRanking: countArray(rows, "boundary_methods"),
    intrusionRanking: countArray(rows, "intrusion_types"),
    psychologicalEffectRanking: countArray(rows, "psychological_effects"),
    responsibilityDistribution: countSingle(rows, "responsibility"),
    resultTypeDistribution: countSingle(rows, "result_type")
  };
}

function countSingle(rows: ResponseRow[], key: keyof ResponseRow): CountItem[] {
  const map = new Map<string, number>();

  rows.forEach((row) => {
    const value = row[key];
    if (typeof value === "string" && value.length > 0) {
      map.set(value, (map.get(value) ?? 0) + 1);
    }
  });

  return toSortedItems(map);
}

function countArray(rows: ResponseRow[], key: keyof ResponseRow): CountItem[] {
  const map = new Map<string, number>();

  rows.forEach((row) => {
    const values = row[key];
    if (Array.isArray(values)) {
      values.forEach((value) => map.set(value, (map.get(value) ?? 0) + 1));
    }
  });

  return toSortedItems(map);
}

function toSortedItems(map: Map<string, number>) {
  return Array.from(map, ([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "zh-Hans-CN"));
}
