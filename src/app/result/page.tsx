"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BoundaryCard } from "@/components/BoundaryCard";
import { RadarPortrait } from "@/components/RadarPortrait";
import { resultTypes, type ResultTypeKey } from "@/data/resultTypes";
import type { CalculatedResult, RadarScores } from "@/lib/calculateResult";

type StoredResult = {
  result?: Partial<CalculatedResult> & {
    resultType?: string;
    radar?: Partial<RadarScores>;
  };
};

const fallbackType = Object.keys(resultTypes)[0] as ResultTypeKey;
const fallbackRadar: RadarScores = {
  "视觉边界": 55,
  "听觉边界": 55,
  "时间边界": 55,
  "规则边界": 55,
  "心理恢复": 55
};

export default function ResultPage() {
  const [stored, setStored] = useState<StoredResult | null>(null);
  const [hasLocalResult, setHasLocalResult] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("dorm-boundary-result");
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as StoredResult;
      setStored(parsed);
      setHasLocalResult(true);
    } catch {
      sessionStorage.removeItem("dorm-boundary-result");
    }
  }, []);

  const resultType = useMemo(() => {
    const storedType = stored?.result?.resultType;
    return storedType && storedType in resultTypes ? (storedType as ResultTypeKey) : fallbackType;
  }, [stored]);

  const result = resultTypes[resultType] ?? resultTypes[fallbackType];
  const radar = { ...fallbackRadar, ...stored?.result?.radar };
  const shareText = `我的宿舍边界画像是：${result.title}。${result.subtitle}`;

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <header className="border-b border-ink/10 pb-5 text-sm text-ink/45">result / boundary portrait</header>
        {!hasLocalResult && (
          <div className="mt-6 border border-mutedRed/30 bg-white/45 p-4 text-sm leading-7 text-mutedRed">
            没有读取到刚刚的测试记录。你可以先查看示例画像，或返回重新测试一次。
          </div>
        )}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="grid gap-8 py-10 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div>
            <p className="text-sm tracking-[0.28em] text-steel">你的宿舍边界画像</p>
            <h1 className="mt-4 text-5xl font-semibold tracking-normal text-ink sm:text-7xl">{result.title}</h1>
            <p className="mt-5 text-xl leading-9 text-ink/68">{result.subtitle}</p>
            <p className="mt-7 text-base leading-8 text-ink/68">{result.description}</p>
            <div className="mt-8 flex flex-wrap gap-2">
              {result.keywords.map((keyword) => (
                <span key={keyword} className="border border-ink/15 bg-white/30 px-3 py-2 text-sm text-ink/65">
                  {keyword}
                </span>
              ))}
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <button className="min-h-12 border border-ink bg-ink px-6 text-sm text-paper transition hover:bg-steel" type="button" onClick={() => void copyResult()}>
                {copied ? "已复制" : "复制结果"}
              </button>
              <Link className="inline-flex min-h-12 items-center justify-center border border-ink/20 bg-white/25 px-6 text-sm text-ink transition hover:border-ink" href="/survey">
                再测一次
              </Link>
            </div>
          </div>
          <div className="grid gap-5">
            <BoundaryCard result={result} />
            <RadarPortrait radar={radar} />
          </div>
        </motion.section>
      </div>
    </main>
  );
}
