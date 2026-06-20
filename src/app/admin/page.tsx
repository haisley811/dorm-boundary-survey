"use client";

import { useState } from "react";
import { MiniBarChart, ResultPieChart } from "@/components/AdminCharts";
import type { AdminStats, CountItem } from "@/lib/adminStats";

type AdminResponse = {
  stats: AdminStats;
};

function ChartBlock({ title, data }: { title: string; data: CountItem[] }) {
  return (
    <section className="border border-ink/12 bg-paperLight/72 p-5 shadow-soft">
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      <MiniBarChart data={data} />
    </section>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadStats() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/stats", {
        headers: {
          "x-admin-password": password
        }
      });
      const payload = (await response.json()) as AdminResponse & { error?: string };

      if (!response.ok) {
        throw new Error(payload.error || "无法读取后台数据。");
      }

      setStats(payload.stats);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "无法读取后台数据。");
    } finally {
      setLoading(false);
    }
  }

  function downloadCsv() {
    const encoded = encodeURIComponent(password);
    window.location.href = `/api/export?password=${encoded}`;
  }

  if (!stats) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <section className="w-full max-w-md border border-ink/15 bg-paperLight/80 p-7 shadow-soft backdrop-blur">
          <p className="text-xs uppercase tracking-[0.24em] text-steel">admin board</p>
          <h1 className="mt-3 text-3xl font-semibold text-ink">数据后台</h1>
          <input
            className="mt-8 min-h-12 w-full border border-ink/15 bg-white/45 px-4 outline-none transition focus:border-steel"
            type="password"
            placeholder="ADMIN_PASSWORD"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <button
            type="button"
            className="mt-4 min-h-12 w-full border border-ink bg-ink px-5 text-sm text-paper transition hover:bg-steel disabled:cursor-not-allowed disabled:bg-ink/25"
            disabled={!password || loading}
            onClick={() => void loadStats()}
          >
            {loading ? "读取中..." : "进入后台"}
          </button>
          {error && <p className="mt-4 text-sm text-mutedRed">{error}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 flex flex-col justify-between gap-4 border-b border-ink/10 pb-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-steel">response data</p>
            <h1 className="mt-3 text-4xl font-semibold text-ink">宿舍边界提交记录</h1>
          </div>
          <button type="button" className="min-h-11 border border-ink bg-ink px-5 text-sm text-paper transition hover:bg-steel" onClick={downloadCsv}>
            CSV 下载
          </button>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="border border-ink/12 bg-white/35 p-5">
            <p className="text-sm text-ink/45">总提交数</p>
            <p className="mt-2 text-4xl font-semibold">{stats.total}</p>
          </div>
          <div className="border border-ink/12 bg-white/35 p-5">
            <p className="text-sm text-ink/45">北京样本数量</p>
            <p className="mt-2 text-4xl font-semibold">{stats.beijingSamples}</p>
          </div>
          <div className="border border-ink/12 bg-white/35 p-5">
            <p className="text-sm text-ink/45">结果类型数</p>
            <p className="mt-2 text-4xl font-semibold">{stats.resultTypeDistribution.length}</p>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-2">
          <ChartBlock title="地区分布" data={stats.regionDistribution} />
          <ChartBlock title="寝室人数分布" data={stats.dormSizeDistribution} />
          <ChartBlock title="边界策略排名" data={stats.boundaryStrategyRanking} />
          <ChartBlock title="侵入类型排名" data={stats.intrusionRanking} />
          <ChartBlock title="心理影响排名" data={stats.psychologicalEffectRanking} />
          <ChartBlock title="责任归因分布" data={stats.responsibilityDistribution} />
          <section className="border border-ink/12 bg-paperLight/72 p-5 shadow-soft lg:col-span-2">
            <h2 className="text-lg font-semibold text-ink">结果类型分布</h2>
            <ResultPieChart data={stats.resultTypeDistribution} />
          </section>
        </section>
      </div>
    </main>
  );
}
