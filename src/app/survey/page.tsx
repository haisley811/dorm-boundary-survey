"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { questions, type QuestionId } from "@/data/questions";
import { calculateResult, type SurveyAnswers } from "@/lib/calculateResult";

export default function SurveyPage() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<SurveyAnswers>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const question = questions[current];
  const answer = answers[question.id];
  const selectedValues = useMemo(() => (Array.isArray(answer) ? answer : answer ? [answer] : []), [answer]);
  const progress = ((current + 1) / questions.length) * 100;
  const canContinue = selectedValues.length > 0;
  const isMultiple = question.type === "multiple";
  const isLastQuestion = current === questions.length - 1;
  const showActionBar = isMultiple || isLastQuestion;
  const nextButtonLabel = isLastQuestion ? (isSubmitting ? "正在生成画像..." : "提交并查看结果") : "下一题";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [current]);

  function chooseSingle(id: QuestionId, option: string) {
    const nextAnswers = { ...answers, [id]: option };
    setAnswers(nextAnswers);

    if (!isLastQuestion) {
      window.setTimeout(() => {
        void goNext(nextAnswers);
      }, 220);
    }
  }

  function toggleMultiple(id: QuestionId, option: string) {
    const previous = Array.isArray(answers[id]) ? (answers[id] as string[]) : [];
    const next = previous.includes(option) ? previous.filter((item) => item !== option) : [...previous, option];
    setAnswers({ ...answers, [id]: next });
  }

  function goNext(nextAnswers = answers) {
    setError("");

    if (!selectedValues.length && nextAnswers === answers) {
      setError("请先选择至少一个选项。");
      return;
    }

    if (current < questions.length - 1) {
      setCurrent((value) => value + 1);
      return;
    }

    submit(nextAnswers);
  }

  function submit(finalAnswers: SurveyAnswers) {
    setIsSubmitting(true);
    setError("");

    const result = calculateResult(finalAnswers);
    const respondentId = getRespondentId();
    sessionStorage.setItem("dorm-boundary-result", JSON.stringify({ answers: finalAnswers, result }));

    fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: finalAnswers, respondentId }),
      keepalive: true
    }).catch(() => {
      // 本地预览或 Supabase 暂时失败时，不阻挡用户查看结果。
    });

    router.push("/result");
  }

  return (
    <main className={`min-h-dvh overflow-y-auto px-4 py-5 sm:px-8 ${showActionBar ? "pb-[calc(9rem+env(safe-area-inset-bottom))]" : "pb-10"}`}>
      <div className="mx-auto flex min-h-[calc(100dvh-40px)] max-w-3xl flex-col">
        <header className="border-b border-ink/10 pb-5">
          <div className="mb-4 flex items-center justify-between text-sm text-ink/50">
            <span>
              {String(current + 1).padStart(2, "0")} / {questions.length}
            </span>
            <button type="button" className="text-ink/45 transition hover:text-ink" onClick={() => router.push("/")}>
              退出
            </button>
          </div>
          <div className="h-3 overflow-hidden border border-ink/15 bg-white/30">
            <motion.div
              className="h-full curtain-surface"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            />
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-start py-7 sm:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              <p className="mb-3 text-xs uppercase tracking-[0.24em] text-steel">{isMultiple ? "multiple choice" : "single choice"}</p>
              <h1 className="text-2xl font-semibold leading-9 text-ink sm:text-4xl sm:leading-[1.25]">{question.title}</h1>

              {isMultiple && (
                <div className="mt-6 border border-ink/15 bg-paperLight/85 p-4 shadow-soft backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.22em] text-steel">selected</p>
                  <p className="mt-1 text-sm leading-6 text-ink/60">已选择 {selectedValues.length} 项。多选题可继续向下滑动查看全部选项，选完后点击底部按钮进入下一题。</p>
                </div>
              )}

              {isLastQuestion && !isMultiple && (
                <div className="mt-6 border border-ink/15 bg-paperLight/85 p-4 shadow-soft backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.22em] text-steel">final step</p>
                  <p className="mt-1 text-sm leading-6 text-ink/60">选择一个答案后，点击底部按钮查看你的边界画像。</p>
                </div>
              )}

              <div className={`mt-7 grid gap-3 ${isMultiple ? "sm:grid-cols-2" : ""}`}>
                {question.options.map((option) => {
                  const selected = selectedValues.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => (isMultiple ? toggleMultiple(question.id, option) : chooseSingle(question.id, option))}
                      className={`group relative overflow-hidden border px-5 py-4 text-left text-base leading-7 transition duration-200 hover:-translate-y-0.5 hover:border-steel ${isMultiple ? "min-h-14" : "min-h-16"} ${
                        selected ? "border-ink bg-ink text-paper" : "border-ink/12 bg-paperLight/72 text-ink shadow-[0_10px_30px_rgba(31,31,29,0.04)]"
                      }`}
                    >
                      <span className="relative z-10 flex items-center justify-between gap-4">
                        <span>{option}</span>
                        <span className={`h-2 w-8 shrink-0 ${selected ? "bg-paper/70" : "bg-steel/35"}`} />
                      </span>
                      <span className="absolute inset-y-0 left-0 w-10 -translate-x-10 bg-white/25 transition group-hover:translate-x-[calc(100vw)]" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <footer className="border-t border-ink/10 py-5">
          {question.type === "single" && isSubmitting && <p className="text-center text-sm text-ink/55">正在生成画像...</p>}
          {error && <p className="mt-3 text-center text-sm text-mutedRed">{error}</p>}
        </footer>
      </div>

      {showActionBar && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/15 bg-paper/95 px-4 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-18px_50px_rgba(31,31,29,0.10)] backdrop-blur sm:px-8">
          <div className="mx-auto flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-ink/62">
              {isMultiple ? `已选择 ${selectedValues.length} 项` : selectedValues.length > 0 ? `已选择：${selectedValues[0]}` : "请选择一个答案"}
            </p>
            <button
              type="button"
              disabled={!canContinue || isSubmitting}
              onClick={() => void goNext()}
              className="min-h-12 w-full border border-ink bg-ink px-6 text-sm font-medium text-paper transition hover:bg-steel disabled:cursor-not-allowed disabled:border-ink/20 disabled:bg-ink/20 sm:w-48"
            >
              {nextButtonLabel}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function getRespondentId() {
  const storageKey = "dorm-boundary-respondent-id";
  const existing = localStorage.getItem(storageKey);

  if (existing) {
    return existing;
  }

  const id = crypto.randomUUID();
  localStorage.setItem(storageKey, id);
  return id;
}
