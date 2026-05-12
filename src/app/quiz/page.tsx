"use client";

import { useState } from "react";
import Link from "next/link";
import { ExamRunner } from "@/components/exam-runner";
import { buildPracticeSet, getBankStats } from "@/lib/question-bank";
import type { BankQuestion } from "@/lib/exam-types";
import { CATEGORIES, type Grade, type CategoryId } from "@/lib/lessons-data";

const COUNTS = [5, 10, 20, 30] as const;

export default function QuizPage() {
  const [grade, setGrade] = useState<Grade | "all">("all");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [count, setCount] = useState(10);
  const [run, setRun] = useState<BankQuestion[] | null>(null);

  const stats = getBankStats();

  const start = () => {
    const filter: { grade?: Grade; category?: CategoryId } = {};
    if (grade !== "all") filter.grade = grade;
    if (category !== "all") filter.category = category;
    setRun(buildPracticeSet(count, filter));
    window.scrollTo(0, 0);
  };

  if (run && run.length > 0) {
    return (
      <ExamRunner
        key={run.map((q) => q.id).join(",")}
        questions={run}
        grade={grade === "all" ? run[0].grade : grade}
        timeLimitSec={null}
        title={`ランダムクイズ（${run.length}問）`}
        examId="quiz"
        recordResult={false}
        showSubjectBreakdown={category === "all"}
        onExit={() => {
          setRun(null);
          window.scrollTo(0, 0);
        }}
        onRestart={start}
      />
    );
  }

  const noQuestions = stats.total === 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-extrabold text-amber-400 mb-3">ランダムクイズ</h1>
      <p className="text-gray-400 mb-1">
        問題バンクからランダム出題。毎回問題が入れ替わります。間違えた問題は自動で「復習リスト」に入ります。
      </p>
      <p className="text-gray-600 text-xs mb-8">
        収録: 合計 {stats.total}問（2級 {stats.byGrade["2"]} / 1級 {stats.byGrade["1"]}）
      </p>

      {noQuestions ? (
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8 text-center text-gray-400">
          問題バンクを準備中です。少し待ってからお試しください。
        </div>
      ) : (
        <div className="space-y-6 p-6 bg-gray-900 rounded-2xl border border-gray-800">
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">級</h3>
            <div className="grid grid-cols-3 gap-2">
              {(["all", "2", "1"] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  className={`py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                    grade === g
                      ? "bg-amber-500/20 border-amber-500 text-amber-300"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {g === "all" ? "両方" : `${g}級`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">科目</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <button
                onClick={() => setCategory("all")}
                className={`py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                  category === "all"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300"
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                全科目
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`py-2.5 rounded-lg border text-xs sm:text-sm font-semibold transition-colors ${
                    category === c.id
                      ? "bg-amber-500/20 border-amber-500 text-amber-300"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {c.icon} {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3">問題数</h3>
            <div className="grid grid-cols-4 gap-2">
              {COUNTS.map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={`py-2.5 rounded-lg border text-sm font-semibold transition-colors ${
                    count === n
                      ? "bg-amber-500/20 border-amber-500 text-amber-300"
                      : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                  }`}
                >
                  {n}問
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={start}
            className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-gray-950 font-bold text-base transition-colors"
          >
            スタート →
          </button>
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <Link href="/exam" className="text-amber-400 hover:text-amber-300">→ 本番モード（時間制限・科目別判定）</Link>
        <Link href="/calc-drill" className="text-amber-400 hover:text-amber-300">→ 計算ドリル</Link>
        <Link href="/review" className="text-amber-400 hover:text-amber-300">→ 復習リスト</Link>
      </div>
    </div>
  );
}
