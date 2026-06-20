import type { ResultType } from "@/data/resultTypes";

export function BoundaryCard({ result }: { result: ResultType }) {
  return (
    <section className="border border-ink/15 bg-paperLight/80 p-5 shadow-soft backdrop-blur sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-5">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-ink/45">Boundary Portrait</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-normal text-ink">{result.title}</h2>
        </div>
        <div className="h-20 w-16 border border-ink/15 curtain-surface" />
      </div>
      <p className="text-base leading-8 text-ink/70">{result.cardText}</p>
      <div className="mt-7 grid grid-cols-3 gap-2">
        {result.keywords.map((keyword) => (
          <span key={keyword} className="border border-ink/15 bg-white/35 px-3 py-2 text-center text-xs text-ink/65">
            {keyword}
          </span>
        ))}
      </div>
    </section>
  );
}
