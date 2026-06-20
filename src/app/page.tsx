import Link from "next/link";
import { ResearchMark } from "@/components/ResearchMark";

export default function HomePage() {
  return (
    <main className="min-h-screen px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-6xl flex-col">
        <header className="flex items-center justify-between border-b border-ink/10 pb-5">
          <ResearchMark />
          <span className="text-xs text-ink/45">anonymous / 3 min</span>
        </header>

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div>
            <div className="mb-8 flex gap-3">
              <span className="h-24 w-8 border border-ink/15 curtain-surface" />
              <span className="h-24 w-8 border border-ink/15 curtain-surface opacity-70" />
              <span className="h-24 w-8 border border-ink/15 curtain-surface opacity-45" />
            </div>
            <p className="mb-4 text-sm tracking-[0.32em] text-steel">PRIVATE BOUNDARY TEST</p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-normal text-ink sm:text-7xl">你的宿舍边界</h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-ink/64">一个关于床帘、耳机、沉默与私人空间的 3 分钟测试。</p>
            <p className="mt-8 max-w-2xl text-base leading-8 text-ink/66">
              你以为拉上床帘，就拥有了私人空间吗？声音、灯光、作息、访客和宿舍检查仍然会穿过那层布。
            </p>
            <Link
              href="/survey"
              className="mt-10 inline-flex min-h-12 items-center border border-ink bg-ink px-7 text-sm font-medium text-paper transition hover:-translate-y-0.5 hover:bg-steel"
            >
              开始测试
            </Link>
          </div>

          <div className="relative min-h-[360px] border border-ink/12 bg-paperLight/55 p-5 shadow-soft backdrop-blur">
            <div className="absolute inset-x-5 top-5 flex justify-between text-[10px] uppercase tracking-[0.22em] text-ink/35">
              <span>bed curtain</span>
              <span>noise map</span>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-3">
              {["A01", "A02", "B01", "B02"].map((item, index) => (
                <div key={item} className="min-h-32 border border-ink/12 bg-white/25 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-ink/45">{item}</span>
                    <span className={`h-2 w-10 ${index % 2 ? "bg-mutedRed/55" : "bg-steel/55"}`} />
                  </div>
                  <div className="mt-7 h-12 curtain-surface" />
                  <div className="mt-4 h-px w-full bg-ink/15" />
                  <div className="mt-3 flex gap-1">
                    <span className="h-1.5 w-8 bg-ink/20" />
                    <span className="h-1.5 w-5 bg-ink/12" />
                    <span className="h-1.5 w-10 bg-ink/16" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 h-24 border border-ink/12 wave-lines" />
          </div>
        </section>

        <footer className="border-t border-ink/10 py-5 text-sm text-ink/45">本测试匿名，结果仅用于设计作品集前期调研。</footer>
      </div>
    </main>
  );
}
